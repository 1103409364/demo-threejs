import "@/style/index.scss";
const app = document.querySelector<HTMLDivElement>("#app");

app && (app.innerHTML = getPages());

// 自动导入页面，生成导航列表
function getPages() {
  const pages = import.meta.glob("/src/pages/**/*.ts"); // 只能导入 ts 文件？
  const paths = Object.keys(pages).map((item) => item.match(/\/src\/pages\/(.+)\/\w+\.ts/)?.[1]);
  paths.sort((prev, next) => {
    const prevNum = prev?.split("/")?.[1]?.split("-")?.shift() || 0;
    const nextNum = next?.split("/")?.[1]?.split("-")?.shift() || 0;
    return +prevNum - +nextNum;
  });

  let temp = "<ul>";
  paths.forEach((item) => {
    const title = item?.split("/")[0];
    const subTitle = item?.split("/")[1];
    subTitle && (temp += `<li>${title}: <a href="/${item}">${subTitle}</a></li>`);
  });
  temp += "</ul>";
  return temp;
}
