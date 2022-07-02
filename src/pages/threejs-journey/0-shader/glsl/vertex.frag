// 使用ShaderMaterial类，顶点位置变量position无需声明，顶点着色器可以直接调用
// attribute vec3 position;
// void main() {
//   // 逐顶点处理：顶点位置数据赋值给内置变量gl_Position
//   gl_Position = vec4(position, 1.0);
// }

varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}