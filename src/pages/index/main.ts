import "@/style/index.scss";
const app = document.querySelector<HTMLDivElement>("#app");

app && (app.innerHTML = getPages());

// 自动导入页面，生成导航列表
function getPages() {
  const pages = import.meta.glob("/src/pages/**/*.ts"); // 只能导入 ts 文件？
  let temp = "<ul>";
  for (const key in pages) {
    const dirName = key.match(/\/src\/pages\/(.+)\/\w+\.ts/)?.[1]; // 匹配出页面名称
    !dirName?.includes("index") && (temp += `<li><a href="/${dirName}">${dirName}</a></li>`);
  }
  temp += "</ul>";
  return temp;
}
