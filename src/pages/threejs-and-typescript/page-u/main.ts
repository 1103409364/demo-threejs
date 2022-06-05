import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  BoxGeometry,
  MeshBasicMaterial,
  MOUSE,
  TOUCH,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.lookAt(0.5, 0.5, 0.5);
// controls.target.set(0.5, 0.5, 0.5); // 设置旋转中心
controls.update();

controls.addEventListener("change", () => console.log("Controls Change"));
controls.addEventListener("start", () => console.log("Controls Start Event"));
controls.addEventListener("end", () => console.log("Controls End Event"));
controls.autoRotate = true; // 自动旋转
controls.autoRotateSpeed = 10; // 自动旋转速度
// controls.enableDamping = true; // 启用阻尼
// controls.dampingFactor = 0.01; // 阻尼因子 旋转惯性
// controls.enableKeys = true; //older versions
controls.listenToKeyEvents(document.body);
controls.keys = {
  LEFT: "ArrowLeft", //left arrow
  UP: "ArrowUp", // up arrow
  RIGHT: "ArrowRight", // right arrow
  BOTTOM: "ArrowDown", // down arrow
};
controls.mouseButtons = {
  LEFT: MOUSE.ROTATE,
  MIDDLE: MOUSE.DOLLY,
  RIGHT: MOUSE.PAN,
};
controls.touches = {
  ONE: TOUCH.ROTATE,
  TWO: TOUCH.DOLLY_PAN,
};
// controls.screenSpacePanning = true; // 屏幕空间平移
controls.minAzimuthAngle = 1; // 最小方位角 水平方向
controls.maxAzimuthAngle = Math.PI * 2; // 最大方位角
controls.minPolarAngle = 0; // 最小极角 垂直方向 俯仰角
controls.maxPolarAngle = Math.PI * 3; // 最大极角
controls.maxDistance = 4; // 最大距离 缩放
controls.minDistance = 2; // 最小距离

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new Mesh(geometry, material);
scene.add(cube);
window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
// const debug = document.getElementById("debug1");
addGui();

render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 更新摄像机的投影矩阵
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
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

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "Orbit Controls" };
