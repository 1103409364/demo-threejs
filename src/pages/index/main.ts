import "@/style/index.scss";
const app = document.querySelector<HTMLDivElement>("#app");

app && (app.innerHTML = getPages());

// 自动导入页面，生成导航列表
function getPages() {
  const pages = import.meta.globEager("/src/pages/**/*.ts"); // 只能导入 ts 文件？
  let temp = "<ul>";
  for (const key in pages) {
    const dirName = key.match(/\/src\/pages\/(.+)\/\w+\.ts/)?.[1]; // 匹配出页面名称
    let pageName = "index";
    // index 此时还未导出
    if (dirName !== "index" && pages[key].pageInfo) {
      pageName = pages[key].pageInfo.title;
      temp += `<li><a href="/${dirName}">${pageName}</a></li>`;
    }
  }
  temp += "</ul>";
  return temp;
}
