const app = document.querySelector<HTMLDivElement>("#app");
app && (app.innerHTML = "page-1 111");
// 无法在 "--isolatedModules" 下编译“main.ts”，因为它被视为全局脚本文件。请添加导入、导出或空的 "export {}" 语句来使它成为模块。ts(1208)
export const pageInfo = { title: "page-2" };
