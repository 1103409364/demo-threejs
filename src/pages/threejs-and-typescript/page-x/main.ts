import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PointLight,
} from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

console.log("window load");

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new PointLight();
light.position.set(10, 10, 10);
scene.add(light);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
//const material: MeshPhongMaterial = new MeshPhongMaterial({ color: 0xff0000, transparent: true })
//const cube: Mesh = new Mesh(geometry, material)
//scene.add(cube)

const material = [
  new MeshPhongMaterial({ color: 0xff0000, transparent: true }),
  new MeshPhongMaterial({ color: 0x00ff00, transparent: true }),
  new MeshPhongMaterial({ color: 0x0000ff, transparent: true }),
];

const cubes = [
  new Mesh(geometry, material[0]),
  new Mesh(geometry, material[1]),
  new Mesh(geometry, material[2]),
];
cubes[0].position.x = -2;
cubes[1].position.x = 0;
cubes[2].position.x = 2;
cubes.forEach((c) => scene.add(c));

const controls = new DragControls(cubes, camera, renderer.domElement);
controls.addEventListener("dragstart", function (event) {
  event.object.material.opacity = 0.33;
});
controls.addEventListener("dragend", function (event) {
  event.object.material.opacity = 1;
});

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
addGui();

render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  cubes[0].rotation.x += 0.01;
  cubes[0].rotation.y += 0.011;
  cubes[1].rotation.x += 0.012;
  cubes[1].rotation.y += 0.013;
  cubes[2].rotation.x += 0.014;
  cubes[2].rotation.y += 0.015;
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

export const pageInfo = { title: "DragControls" };
