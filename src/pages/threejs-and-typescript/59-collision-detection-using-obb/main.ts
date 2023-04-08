import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Clock,
  AmbientLight,
  Box3,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
} from "three";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { OBB } from "three/examples/jsm/math/OBB";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new AmbientLight();
scene.add(light);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 3.0);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const geometry = new BoxGeometry(1, 2, 3);
geometry.computeBoundingBox();
const material = new MeshPhongMaterial();
const mesh = new Mesh(geometry, material);
mesh.position.set(4, 1, 0);
mesh.geometry.userData.obb = new OBB().fromBox3(mesh.geometry.boundingBox as Box3);
mesh.userData.obb = new OBB();
scene.add(mesh);

const mesh2 = new Mesh(geometry, new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
mesh2.position.set(-3, 1, 0);
mesh2.geometry.userData.obb = new OBB().fromBox3(mesh2.geometry.boundingBox as Box3);
mesh2.userData.obb = new OBB();

scene.add(mesh2);

const floor = new Mesh(
  new PlaneGeometry(20, 20, 10, 10),
  new MeshBasicMaterial({ color: 0xaec6cf, wireframe: true }),
);
floor.rotateX(-Math.PI / 2);
scene.add(floor);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
app?.appendChild(stats.dom);

const clock = new Clock();

function animate() {
  requestAnimationFrame(animate);

  mesh.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 4;

  controls.update();

  mesh.userData.obb.copy(mesh.geometry.userData.obb);
  mesh2.userData.obb.copy(mesh2.geometry.userData.obb);
  mesh.userData.obb.applyMatrix4(mesh.matrixWorld);
  mesh2.userData.obb.applyMatrix4(mesh2.matrixWorld);
  if (mesh.userData.obb.intersectsOBB(mesh2.userData.obb)) {
    mesh.material.color.set(0xff0000); // 碰到变红
  } else {
    mesh.material.color.set(0x00ff00);
  }

  mesh.rotateY(0.01);
  mesh2.rotateY(-0.005);

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
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
addGui();
animate();
