import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  PlaneGeometry,
  PointLight,
  TextureLoader,
  MeshPhysicalMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new PointLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

// 相机 透视相机 近大远小
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.addEventListener("change", handleControlChange);
controls.enableDamping = true;

const planeGeometry = new PlaneGeometry(3.6, 1.8);

const material = new MeshPhysicalMaterial();

//const texture = new TextureLoader().load("img/grid.png")
const texture = new TextureLoader().load(getImg("worldColour.5400x2700", "jpg"));
material.map = texture;

const bumpTexture = new TextureLoader().load(getImg("earth_bumpmap", "jpg"));
material.bumpMap = bumpTexture; // 凹凸贴图
material.bumpScale = 0.015;

const plane = new Mesh(planeGeometry, material);
scene.add(plane);

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

  gui.add(material, "bumpScale", 0, 1, 0.01);

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "BumpMap" };
