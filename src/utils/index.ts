/**
 * 获取img目录下图片的动态路径
 * @param name 图片名称
 * @param format 图片格式 默认png
 * @returns
 */
export const getImg = (name: string, format = "png") => {
  const path = `/src/assets/img/${name}.${format}`;
  const modules = import.meta.globEager("/src/assets/img/*");
  return modules[path].default;
};
