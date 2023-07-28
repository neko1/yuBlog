# element-plus 的 Table 拓展

二次封装 element-plus 的 Table ，完全兼容 Api，并提供 columns 配置表格列，pagination 分页配置

```ts
// props.ts
import defaultProps from "element-plus/es/components/table/src/table/defaults";

export default {
  key: {
    type: String || Number,
    default: "0"
  },
  columns: {
    type: Array,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingConfig: {
    type: Object,
    default: () => {
    }
  },
  alignWhole: {
    type: String,
    default: "left"
  },
  headerAlign: {
    type: String,
    default: ""
  },
  showOverflowTooltip: {
    type: Boolean,
    default: false
  },
  rowHoverBgColor: {
    type: String,
    default: ""
  },
  pagination: {
    type: Object,
    default: {
      total: 0,
      pageSize: 5,
      align: "right",
      background: false,
      pageSizes: [5, 10, 15, 20],
      layout: "total, sizes, prev, pager, next, jumper"
    }
  },
  paginationSmall: {
    type: Boolean,
    default: false
  },
  adaptive: {
    type: Boolean,
    default: false
  },
  adaptiveConfig: {
    type: Object,
    default: {
      offsetBottom: 96,
      fixHeader: true,
      timeout: 60,
      zIndex: 100
    }
  },
  ...defaultProps
};
```

```tsx
// renderer.tsx
import { defineComponent } from "vue";

const props = {
  render: {
    type: Function
  },
  params: {
    type: Object
  }
};

export default defineComponent({
  name: "Renderer",
  props,
  setup(props) {
    return () => <>{props!.render(props.params)}</>;
  }
});
```

```tsx
import {
  unref,
  toRefs,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  getCurrentInstance,
  type CSSProperties
} from "vue";
import props from "./props";
import Renderer from "./renderer";
import { ElTable, ElTableColumn, ElPagination } from "element-plus";
import { isFunction, isBoolean, debounce } from "lodash";

export default defineComponent({
  name: "RenderTable",
  props,
  emits: ["page-size-change", "page-current-change"],
  setup(props, { slots, attrs, emit, expose }) {
    const {
      key,
      columns,
      loading,
      adaptive,
      pagination,
      alignWhole,
      headerAlign,
      loadingConfig,
      adaptiveConfig,
      rowHoverBgColor,
      showOverflowTooltip
    } = toRefs(props);

    const instance = getCurrentInstance()!;
    let conditions =
      unref(pagination) &&
      unref(pagination).currentPage &&
      unref(pagination).pageSize;

    let convertLoadingConfig = computed(() => {
      if (!unref(loadingConfig)) return;
      let { text, spinner, svg, viewBox } = unref(loadingConfig);
      return {
        "element-loading-text": text,
        "element-loading-spinner": spinner,
        "element-loading-svg": svg,
        "element-loading-svg-view-box": viewBox
      };
    });

    const loadingBackground = computed(() => {
      if (!unref(loading)) return;
      return {
        "element-loading-background": "rgba(255, 255, 255, 0.45)"
      };
    });

    const getStyle = computed((): CSSProperties => {
      return Object.assign(
        {
          width: "100%",
          margin: "16px 0",
          display: "flex",
          justifyContent:
            unref(pagination).align === "left"
              ? "flex-start"
              : unref(pagination).align === "center"
              ? "center"
              : "flex-end"
        },
        unref(pagination).style ?? {}
      );
    });

    const handleSizeChange = val => {
      unref(pagination).pageSize = val;
      emit("page-size-change", val);
    };

    const handleCurrentChange = val => {
      unref(pagination).currentPage = val;
      emit("page-current-change", val);
    };

    const renderColumns = (columns: Record<string, any>, index: number) => {
      const {
        cellRenderer,
        slot,
        headerRenderer,
        headerSlot,
        hide,
        children,
        prop,
        ...args
      } = columns;

      if (isFunction(hide) && hide(attrs)) {
        return hide(attrs);
      }

      if (isBoolean(hide) && hide) {
        return hide;
      }

      const defaultSlots = {
        default: (scope) => {
          if (cellRenderer) {
            return (
              <Renderer
                render={cellRenderer}
                params={Object.assign(scope, {
                  index: scope.$index,
                  props,
                  attrs
                })}
              ></Renderer>
            );
          } else if (slot) {
            return slots?.[slot]?.(
              Object.assign(scope, {
                index: scope.$index,
                props,
                attrs
              })
            );
          }
        }
      };

      let scopedSlots = headerRenderer
        ? {
            header: (scope) => {
              return (
                <Renderer
                  render={headerRenderer}
                  params={Object.assign(scope, {
                    index: scope.$index,
                    props,
                    attrs
                  })}
                ></Renderer>
              );
            },
            ...defaultSlots
          }
        : slots?.[headerSlot]
        ? {
            header: (scope) => {
              return slots?.[headerSlot]?.(
                Object.assign(scope, {
                  index: scope.$index,
                  props,
                  attrs
                })
              );
            },
            ...defaultSlots
          }
        : defaultSlots;

      if (children?.length > 0) {
        scopedSlots = children.map(renderColumns);
      }

      return (
        <ElTableColumn
          key={index}
          {...args}
          prop={isFunction(prop) && prop(index) ? prop(index) : prop}
          align={columns?.align ? columns.align : unref(alignWhole)}
          headerAlign={
            columns?.headerAlign ? columns.headerAlign : unref(headerAlign)
          }
          showOverflowTooltip={
            columns?.showOverflowTooltip
              ? columns.showOverflowTooltip
              : unref(showOverflowTooltip)
          }
        >
          {scopedSlots}
        </ElTableColumn>
      );
    };

    const getTableRef = () => instance?.proxy?.$refs[`TableRef${unref(key)}`];

    const getTableDoms = () => (getTableRef() as any).$refs;

    const setAdaptive = async () => {
      await nextTick();
      const tableWrapper = getTableDoms().tableWrapper;
      const offsetBottom = unref(adaptiveConfig).offsetBottom ?? 96;
      tableWrapper.style.height = `${
        window.innerHeight -
        tableWrapper.getBoundingClientRect().top -
        offsetBottom
      }px`;
    };

    const debounceSetAdaptive = debounce(
      setAdaptive,
      unref(adaptiveConfig).timeout ?? 60
    );

    const setHeaderSticky = async (zIndex = 100) => {
      await nextTick();
      const headerStyle = getTableDoms().tableHeaderRef.$el.style;
      headerStyle.position = "sticky";
      headerStyle.top = 0;
      headerStyle.zIndex = zIndex;
    };

    onMounted(() => {
      nextTick(() => {
        if (unref(rowHoverBgColor)) {
          getTableDoms().tableWrapper.style.setProperty(
            "--el-table-row-hover-bg-color",
            unref(rowHoverBgColor),
            "important"
          );
        }

        if (unref(adaptive)) {
          setAdaptive();
          window.addEventListener("resize", debounceSetAdaptive);
          const hasFixHeader = Reflect.has(unref(adaptiveConfig), "fixHeader");
          if (hasFixHeader && !unref(adaptiveConfig).fixHeader) {
            return;
          } else {
            setHeaderSticky(unref(adaptiveConfig).zIndex ?? 100);
          }
        }
      });
    });

    onBeforeUnmount(() => {
      if (unref(adaptive)) {
        window.removeEventListener("resize", debounceSetAdaptive);
      }
    });

    expose({
      /** 获取表格实例 */
      getTableRef,
      /** 获取表格多个`Dom`元素 */
      getTableDoms,
      /** 设置表格自适应高度 */
      setAdaptive,
      /** 设置表头为 `sticky` 布局 */
      setHeaderSticky
    });

    let renderTable = () => {
      return (
        <>
          <ElTable {...props} {...attrs} ref={`TableRef${unref(key)}`}>
            {{
              default: () => unref(columns).map(renderColumns),
              append: () => slots.append && slots.append(),
              empty: () => slots.empty && slots.empty()
            }}
          </ElTable>
          {conditions ? (
            <ElPagination
              {...attrs}
              class="pure-pagination"
              style={unref(getStyle)}
              {...unref(pagination)}
              small={
                props?.paginationSmall
                  ? props?.paginationSmall
                  : unref(pagination).small
                  ? unref(pagination).small
                  : false
              }
              layout={
                unref(pagination).layout ??
                "total, sizes, prev, pager, next, jumper"
              }
              pageSizes={unref(pagination).pageSizes ?? [5, 10, 15, 20]}
              onSizeChange={val => handleSizeChange(val)}
              onCurrentChange={val => handleCurrentChange(val)}
            ></ElPagination>
          ) : null}
        </>
      );
    };

    return () => (
      <div
        class="pure-table"
        style="width:100%"
        v-loading={unref(loading)}
        {...unref(loadingBackground)}
        {...unref(convertLoadingConfig)}
      >
        {renderTable()}
      </div>
    );
  }
});
```
