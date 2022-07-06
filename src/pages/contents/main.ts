import "@/style/index.scss";

// 自动导入页面，生成导航列表
function getPages() {
  const pages = import.meta.glob("/src/pages/**/*.ts"); // 只能导入 ts 文件？
  const paths = Object.keys(pages).map((item) => item.match(/\/src\/pages\/(.+)\/\w+\.ts/)?.[1]);

  paths.sort((prev, next) => {
    const prevNum = prev?.split("/")?.[1]?.split("-")?.shift() || 0;
    const nextNum = next?.split("/")?.[1]?.split("-")?.shift() || 0;
    return +prevNum - +nextNum;
  });

  return paths.reduce((cur: Record<string, PageItem[]>, next) => {
    const title = next?.split("/")[0] ?? "";
    const subTitle = next?.split("/")[1] ?? "";

    if (subTitle) {
      !cur[title] && (cur[title] = []);
      cur[title].push({
        title,
        subTitle,
        path: `${next}`,
      });
    }

    return cur;
  }, {});
}

function render(pageGroup: Record<string, PageItem[]>) {
  let temp = "<div class= 'page-wrap'>";
  for (const title in pageGroup) {
    temp += `<dl class="group ${title}"><span class="list-title">${title}</span>`;
    pageGroup[title].forEach(
      (p: PageItem) => (temp += `<dt><a href="/${p.path}">${p.subTitle}</a></dt>`),
    );
    temp += "</dl>";
  }
  temp += "</div>";
  const app = document.querySelector<HTMLDivElement>("#app");
  app && (app.innerHTML = temp);
}

render(getPages());
