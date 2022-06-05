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
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
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

const controls = new TrackballControls(camera, renderer.domElement);
// camera.lookAt(0.5, 0.5, 0.5);
// controls.target.set(0.5, 0.5, 0.5); // 设置旋转中心
controls.update();

controls.addEventListener("change", () => console.log("Controls Change"));
controls.addEventListener("start", () => console.log("Controls Start Event"));
controls.addEventListener("end", () => console.log("Controls End Event"));
// controls.enabled = false; // 启用或者 关闭
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.keys = ["65", "KeyS", "KeyD"];
// controls.noPan = true; //default false 关闭平移
// controls.noRotate = true; //default false 关闭旋转
// controls.noZoom = true; //default false 关闭缩放
// controls.staticMoving = true; //default false 关闭动态缩放
// controls.dynamicDampingFactor = 0.1; //default 0.2 动态阻尼因子
controls.maxDistance = 4; //default Infinity 允许的最大缩放距离
controls.minDistance = 2; //default 0.1 允许的最小缩放距离

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new Mesh(geometry, material);
scene.add(cube);
window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
addGui();

render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  // trackball controls needs to be updated in the animation loop before it will work
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

export const pageInfo = { title: "Trackball Controls" };
