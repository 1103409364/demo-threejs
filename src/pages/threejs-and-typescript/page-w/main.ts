import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  BoxGeometry,
  MeshBasicMaterial,
  Color,
  PlaneGeometry,
  Box3,
} from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1;
camera.position.z = 2;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const menuPanel = document.getElementById("menuPanel");
const startButton = document.getElementById("startButton");
// 第一人称视角控制
const controls = new PointerLockControls(camera, renderer.domElement);
startButton?.addEventListener("click", controls.lock.bind(controls), false);

controls.addEventListener("change", () => console.log("Controls Change"));
controls.addEventListener("lock", () => menuPanel && (menuPanel.style.display = "none"));
controls.addEventListener("unlock", () => menuPanel && (menuPanel.style.display = "block"));

const planeGeometry = new PlaneGeometry(100, 100, 50, 50);
const material = new MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const plane = new Mesh(planeGeometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

const cubes: Mesh[] = [];
for (let i = 0; i < 100; i++) {
  const geo = new BoxGeometry(Math.random() * 4, Math.random() * 16, Math.random() * 4);
  const mat = new MeshBasicMaterial({ wireframe: true });
  switch (i % 3) {
    case 0:
      mat.color = new Color(0xff0000);
      break;
    case 1:
      mat.color = new Color(0xffff00);
      break;
    case 2:
      mat.color = new Color(0x0000ff);
      break;
  }
  const cube = new Mesh(geo, mat);
  cubes.push(cube);
}
cubes.forEach((c) => {
  c.position.x = Math.random() * 100 - 50;
  c.position.z = Math.random() * 100 - 50;
  c.geometry.computeBoundingBox();
  c.position.y = ((c.geometry.boundingBox as Box3).max.y - (c.geometry.boundingBox as Box3).min.y) / 2;
  scene.add(c);
});
// w a s d 控制方向
const onKeyDown = function (event: KeyboardEvent) {
  switch (event.code) {
    case "KeyW":
      controls.moveForward(1.25);
      break;
    case "KeyA":
      controls.moveRight(-1.25);
      break;
    case "KeyS":
      controls.moveForward(-1.25);
      break;
    case "KeyD":
      controls.moveRight(1.25);
      break;
  }
};
document.addEventListener("keydown", onKeyDown, false);

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
addGui();

render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  // trackball controls needs to be updated in the animation loop before it will work
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
