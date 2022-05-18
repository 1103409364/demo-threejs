import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
} from "three";

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
// 相机 透视相机 近大远小
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app && app.appendChild(renderer.domElement);

const cube = createCube();
const line = createLine();
scene.add(cube);
scene.add(line);

camera.position.z = 5;

// 创建一个立方体
function createCube() {
  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial({ color: 0x00ff00 }); // 定义纹理材质
  const cube = new Mesh(geometry, material);
  return cube;
}
// 创建一条线
function createLine() {
  const material = new LineBasicMaterial({ color: 0x00ff00 }); // 定义纹理材质
  const points = [];
  points.push(new Vector3(-10, 0, 0));
  points.push(new Vector3(0, 10, 0));
  points.push(new Vector3(10, 0, 0));

  const geometry = new BufferGeometry().setFromPoints(points); // 定义几何体
  const line = new Line(geometry, material);
  return line;
}
// 渲染
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

export const pageInfo = { title: "创建一个场景（Creating a scene）" };
