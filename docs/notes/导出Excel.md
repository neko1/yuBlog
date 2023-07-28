# axios请求导出excel

导出Excel表，在以往开发过程中，通常都是后端提供一个下载链接直接下载，或者提供分页接口，
前端获取数据通过xlsx.js进行导出。最近后台说出于对安全性的考虑，使用了post返回一个blob
的方式进行导出。

下面上代码

**重点：responseType: 'blob'**

``` js
const axiosReq = (url, params) => {
  axios
    .post(url, params, {
      responseType: "blob",
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      const blob = new Blob([res.data], {
        type: "application/zip;"
      });
      const downloadElement = document.createElement("a");
      const href = window.URL.createObjectURL(blob);
      const filename = res.headers["content-disposition"]
        .split(";")[1]
        .split("=")[1]; // filename;
      downloadElement.href = href;
      downloadElement.download = filename; // 命名下载名称
      downloadElement.click();
      window.URL.revokeObjectURL(href); // 下载完成进行释放
    })
    .catch(e => {
      ElMessage.error(e.message);
    });
};
```
