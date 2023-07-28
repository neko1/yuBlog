# element-plus 的 Upload 拓展

二次封装 element-plus 的 Upload 的 picture-card 模式 ，并提供展示尺寸设置、排序功能

```ts
// uploadProps.ts
import type { ExtractPropTypes } from 'vue'
import { isArray } from '@pureadmin/utils'
import { ElUpload } from 'element-plus'

/**
 * @description 对el-upload的拓展
 * @see {@link https://element-plus.gitee.io/zh-CN/component/upload.html}
 */
export const uploadProps = {
  ...ElUpload.props,
  action: {
    type: String,
    default: '',
  },
  listType: {
    type: String,
    default: 'picture-card',
  },
  width: {
    type: Number,
    default: 148,
  },
  height: {
    type: Number,
    default: 148,
  },
}
export type UploadProps = ExtractPropTypes<typeof uploadProps>
export const uploadEmits = {
  'update:file-list': (value: any[]) => isArray(value),
}
export type UploadEmits = typeof uploadEmits
```

```tsx
import './upload.scss'
import { ref, computed, defineComponent, unref, warn } from 'vue'
import { cloneDeep, isNumber } from '@pureadmin/utils'
import { uploadProps, uploadEmits } from './uploadProps'
import { IconifyIconOffline } from '@/components/ReIcon'
import { getToken } from '@/utils/auth'

const Upload = defineComponent({
  name: 'Upload',
  props: uploadProps,
  emits: uploadEmits,
  setup(props, { slots, emit, attrs, expose }) {
    const uploadRef = ref()

    const upladStyles = computed(() => {
      return {
        '--el-upload-list-picture-card-width': `${props.width + 2}px`,
        '--el-upload-list-picture-card-height': `${props.height + 2}px`,
      }
    })

    const uploadProps = computed(() => {
      const pHeaders = props.headers ?? {}
      const headers = {
        ...pHeaders,
        token: getToken().accessToken,
      }

      return {
        ...props,
        headers: headers,
      }
    })

    const handleChange = (uploadFile, uploadFiles) => {
      const { response } = uploadFile
      if (!response) return
      const { data = {}, code } = response
      if (code == 200 && data.url) uploadFile.url = data.url
      emit('update:file-list', cloneDeep(uploadFiles))
    }

    const leftShift = (file) => {
      const list = props.fileList
      const index = list.findIndex((v) => v.uid === file.uid)
      if (index < 1) return
      ;[list[index], list[index - 1]] = [list[index - 1], list[index]]
      emit('update:file-list', cloneDeep(list))
    }

    const rightShift = (file) => {
      const list = props.fileList
      const index = list.findIndex((v) => v.uid === file.uid)
      if (index >= list.length) return
      ;[list[index], list[index + 1]] = [list[index + 1], list[index]]
      emit('update:file-list', cloneDeep(list))
    }

    const previewList = computed(() => props.fileList.map((v) => v.url))
    const previewVisible = ref(false)
    const previewIndex = ref(0)

    const openPreview = (file) => {
      previewIndex.value = props.fileList.findIndex((v) => v.uid === file.uid)
      previewVisible.value = true
    }

    const closePreview = () => {
      previewVisible.value = false
    }

    const handleRemove = (file) => {
      unref(uploadRef)?.handleRemove(file)
    }

    const exec = (fn: string, ...args) => {
      const elUploadFn = unref(uploadRef)?.[fn]
      if (!elUploadFn) {
        const url = 'https://element-plus.gitee.io/zh-CN/component/upload.html'
        warn(`el-upload 不存在方法 ${fn}，请查阅文档：${url}`)
        return
      }
      return elUploadFn(...args)
    }

    expose({
      exec,
    })

    return () => {
      const expandSlots = {
        default: () => <IconifyIconOffline icon="ep:plus" />,
        file: ({ file }) => {
          if (isNumber(file.percentage) && file.percentage < 100) {
            return <el-progress percentage={file.percentage} show-text={false} />
          }

          const itemBtns = [
            <span class="el-upload-list__item-preview" onClick={() => openPreview(file)}>
              <IconifyIconOffline icon="ep:zoom-in" />
            </span>,
          ]

          if (!props.disabled) {
            itemBtns.push(
              <span class="el-upload-list__item-delete" onClick={() => handleRemove(file)}>
                <IconifyIconOffline icon="ep:delete" />
              </span>
            )

            const fileList = props.fileList
            if (fileList.length > 1) {
              if (file.uid !== props.fileList[0].uid) {
                itemBtns.push(
                  <span class="el-upload-list__item-left" onClick={() => leftShift(file)}>
                    <IconifyIconOffline icon="ep:d-arrow-left" />
                  </span>
                )
              }
              if (file.uid !== fileList[fileList.length - 1].uid) {
                itemBtns.push(
                  <span class="el-upload-list__item-right" onClick={() => rightShift(file)}>
                    <IconifyIconOffline icon="ep:d-arrow-right" />
                  </span>
                )
              }
            }
          }

          return (
            <>
              <img class="el-upload-list__item-thumbnail" src={file.url} />
              <span class="el-upload-list__item-actions">{itemBtns}</span>
            </>
          )
        },
      }

      let realSlots = slots
      const realClass = ['upload-vc']
      if (props.listType === 'picture-card') {
        realSlots = Object.assign(expandSlots, slots)
      }

      if (
        props.listType === 'picture-card' &&
        props.limit &&
        props.limit <= props.fileList.length
      ) {
        realClass.push('is-full')
      }

      return (
        <>
          <el-upload
            {...unref(uploadProps)}
            {...attrs}
            ref={uploadRef}
            class={realClass}
            style={unref(upladStyles)}
            on-preview={openPreview}
            on-change={handleChange}
            v-slots={realSlots}
          />
          {!unref(previewVisible) ? null : (
            <el-image-viewer
              urlList={unref(previewList)}
              initialIndex={unref(previewIndex)}
              teleported
              onClose={closePreview}
            />
          )}
        </>
      )
    }
  },
})

export default Upload

export type UploadInstance = InstanceType<typeof Upload> & {
  // 执行 el-upload 的方法
  exec: (fn: string, ...args) => any
}
```

```scss
.upload-vc {
  .el-upload--picture-card,
  .el-upload-list--picture-card .el-upload-list__item,
  &.el-upload-list--picture-card .el-upload-list__item {
    width: var(--el-upload-list-picture-card-width);
    height: var(--el-upload-list-picture-card-height);
  }

  .el-upload--picture-card {
    margin-bottom: 8px;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions span + span {
    margin-left: 0.5rem;
  }

  .el-upload-list--picture-card .el-progress {
    width: 90%;
  }

  &.is-full .el-upload--picture-card {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s linear;
  }
}
```
