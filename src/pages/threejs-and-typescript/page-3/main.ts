import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  SphereBufferGeometry,
  PointLight,
  MeshPhongMaterial,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
scene.add(new AxesHelper(5));

// 相机 透视相机 近大远小
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 4;

// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(8, 0, 0);

const light1 = new PointLight();
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new PointLight();
light2.position.set(-10, 10, 10);
scene.add(light2);

const object1 = new Mesh(new SphereBufferGeometry(), new MeshPhongMaterial({ color: 0xff0000 })); // 红球
object1.position.set(4, 0, 0);
scene.add(object1);
object1.add(new AxesHelper(5));

const object2 = new Mesh(new SphereBufferGeometry(), new MeshPhongMaterial({ color: 0x00ff00 })); // 绿球
object2.position.set(4, 0, 0);
object1.add(object2);
object2.add(new AxesHelper(5));

const object3 = new Mesh(new SphereBufferGeometry(), new MeshPhongMaterial({ color: 0x0000ff })); // 蓝球
object3.position.set(4, 0, 0);
object2.add(object3);
object3.add(new AxesHelper(5));

// controls.addEventListener("change", render);

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
const debug = document.getElementById("debug1");
addGui();

// render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // stats.update();
  render();
  const object1WorldPosition = new Vector3();
  object1.getWorldPosition(object1WorldPosition);
  const object2WorldPosition = new Vector3();
  object2.getWorldPosition(object2WorldPosition);
  const object3WorldPosition = new Vector3();
  object3.getWorldPosition(object3WorldPosition);
  debug &&
    (debug.innerText =
      "Red\n" +
      "Local Pos X : " +
      object1.position.x.toFixed(2) +
      "\n" +
      "World Pos X : " +
      object1WorldPosition.x.toFixed(2) +
      "\n" +
      "\nGreen\n" +
      "Local Pos X : " +
      object2.position.x.toFixed(2) +
      "\n" +
      "World Pos X : " +
      object2WorldPosition.x.toFixed(2) +
      "\n" +
      "\nBlue\n" +
      "Local Pos X : " +
      object3.position.x.toFixed(2) +
      "\n" +
      "World Pos X : " +
      object3WorldPosition.x.toFixed(2) +
      "\n");
}
function render() {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
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
  const object1Folder = gui.addFolder("Object1");
  object1Folder.add(object1.position, "x", 0, 10, 0.01).name("X Position");
  object1Folder.add(object1.rotation, "x", 0, Math.PI * 2, 0.01).name("X Rotation");
  object1Folder.add(object1.scale, "x", 0, 2, 0.01).name("X Scale");
  object1Folder.open();
  const object2Folder = gui.addFolder("Object2");
  object2Folder.add(object2.position, "x", 0, 10, 0.01).name("X Position");
  object2Folder.add(object2.rotation, "x", 0, Math.PI * 2, 0.01).name("X Rotation");
  object2Folder.add(object2.scale, "x", 0, 2, 0.01).name("X Scale");
  object2Folder.open();
  const object3Folder = gui.addFolder("Object3");
  object3Folder.add(object3.position, "x", 0, 10, 0.01).name("X Position");
  object3Folder.add(object3.rotation, "x", 0, Math.PI * 2, 0.01).name("X Rotation");
  object3Folder.add(object3.scale, "x", 0, 2, 0.01).name("X Scale");
  object3Folder.open();

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "Object3D Hierarchy" };
