module.exports = {
  base: '/yuBlog/',
  title: '前端学习笔记',
  description: '分享笔记，技术博客',
  themeConfig: {
    search: false,
    nav: [
      { text: '首页', link: '/' },
      {
        text: '日常开发记录',
        items: [
          {text: '随记', link: '/notes/导出Excel'},
          {text: 'element-plus相关', link: '/element-plus/el-table封装'},
          {text: 'js相关', link: '/js/常用工具函数'},
          {text: 'css相关', link: '/css/css优先级'}
        ]
      },
      {
        text: '常见手写代码',
        link: '/write/常见手写代码'
      }
    ],
    sidebar: {
      '/notes/': [
        ['导出Excel', 'axios请求导出excel'],
        ['promisethen', 'promise.then'],
        ['JS遍历对象的七种方法', 'JS遍历对象的七种方法'],
        ['怎么在老项目中加入eslint规则', '怎么在老项目中加入eslint规则'],
        ['HTTP请求', 'HTTP请求'],
        ['git相关', 'git相关'],
        ['js小技巧', 'js小技巧'],
        ['cache', '强缓存、协商缓存'],
      ],
      '/element-plus/': [
        ['el-table封装', 'Table拓展'],
        ['upload拓展', 'Upload拓展'],
      ],
      '/write/': [
        ['常见手写代码', '常见手写代码'],
        ['延迟链式调用', '延迟链式调用'],
        ['promise', 'Promise A+'],
      ],
      '/js/': [
        ['常用工具函数', '常用工具函数'],
        // ['TS基础', 'TS基础'],
        ['tsconfig速查', 'tsconfig.json配置详情'],
        ['svg批量转化vue组件', 'svg批量转化vue组件'],
      ],
      '/css/': [
        ['css优先级', 'CSS优先级'],
        ['场景应用', '场景应用'],
      ]
    }
  },
}
