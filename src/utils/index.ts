interface Module {
  default: string;
}
/**
 * 获取img目录下图片的动态路径
 * @param name 图片名称
 * @param format 图片格式 默认png
 * @returns
 */
export const getImg = (name: string, format = "png") => {
  const path = `/src/assets/img/${name}.${format}`;
  const modules = import.meta.glob<Module>("/src/assets/img/*", { eager: true });
  console.log(modules);
  const img = modules[path]?.default;
  if (!img) {
    throw new Error(`Image not found: ${name}`);
  }

  return img;
};
