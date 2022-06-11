import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
// import Stats from "three/examples/jsm/libs/stats.module";
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

const geometry = new BoxGeometry();
const material = new MeshNormalMaterial();
const cube = new Mesh(geometry, material);
scene.add(cube);

const controls = new TransformControls(camera, renderer.domElement);
controls.attach(cube);
scene.add(controls);

window.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyG":
      controls.setMode("translate");
      break;
    case "KeyR":
      controls.setMode("rotate");
      break;
    case "KeyS":
      controls.setMode("scale");
      break;
  }
});

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
addGui();

render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  //controls.update()
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
