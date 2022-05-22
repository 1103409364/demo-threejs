import "@/style/index.scss";
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
  Color,
} from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
scene.background = new Color(0x000000);
// 相机 透视相机 近大远小
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;
// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.addEventListener("change", render);

const cube = createCube();
const line = createLine();
scene.add(cube);
scene.add(line);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 更新摄像机的投影矩阵
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// 创建一个立方体
function createCube() {
  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }); // 定义纹理材质 wireframe 线框
  const cube = new Mesh(geometry, material);
  return cube;
}
// 创建一条线
function createLine() {
  const material = new LineBasicMaterial({ color: 0x00ff00 }); // 定义纹理材质
  const points = [];
  // 1个单位是多少像素？
  points.push(new Vector3(-2, 0, 0));
  points.push(new Vector3(0, 2, 0));
  points.push(new Vector3(2, 0, 0));
  points.push(new Vector3(0, -2, 0));
  points.push(new Vector3(-2, 0, 0));

  const geometry = new BufferGeometry().setFromPoints(points); // 定义几何体
  const line = new Line(geometry, material);
  return line;
}
// 状态监控
function addStats() {
  const stats = new Stats();
  app?.appendChild(stats.dom);
  return stats;
}
// 调试控件
function addGui() {
  const container = document.querySelector<HTMLDivElement>("#gui");
  if (!container) return;
  const gui = new GUI({ container: container });
  const cubeFolder = gui.addFolder("Cube"); // 分类
  cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
  cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
  cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);
  // cubeFolder.close(); // 默认展开
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

const stats = addStats();
addGui();

function render() {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
}
render();
// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();
  // stats.update();
  render();
}
animate();

export const pageInfo = { title: "创建一个场景（Creating a scene）" };
