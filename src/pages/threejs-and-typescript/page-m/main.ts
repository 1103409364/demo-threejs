import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  PointLight,
  TextureLoader,
  MeshPhongMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  MeshToonMaterial,
  TorusGeometry,
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
camera.position.z = 7;

// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加颜色相同的平面，将导致物体在某个角度不可见。因为环境光光线在所有方向和距离上均等地传播
// controls.addEventListener("change", handleControlChange);
// const planeGeometry = new PlaneGeometry(20, 10)//, 360, 180)
// const plane = new Mesh(planeGeometry, new MeshPhongMaterial())
// plane.rotateX(-Math.PI / 2)
// //plane.position.y = -1.75
// scene.add(plane)

const torusGeometry = [
  new TorusGeometry(),
  new TorusGeometry(),
  new TorusGeometry(),
  new TorusGeometry(),
  new TorusGeometry(),
];

const material = [
  new MeshBasicMaterial(),
  new MeshLambertMaterial(),
  new MeshPhongMaterial(),
  new MeshPhysicalMaterial({}),
  new MeshToonMaterial(),
];

const torus = [
  new Mesh(torusGeometry[0], material[0]),
  new Mesh(torusGeometry[1], material[1]),
  new Mesh(torusGeometry[2], material[2]),
  new Mesh(torusGeometry[3], material[3]),
  new Mesh(torusGeometry[4], material[4]),
];

const texture = new TextureLoader().load(getImg("grid"));
material[0].map = texture;
material[1].map = texture;
material[2].map = texture;
material[3].map = texture;
material[4].map = texture;

torus[0].position.x = -8;
torus[1].position.x = -4;
torus[2].position.x = 0;
torus[3].position.x = 4;
torus[4].position.x = 8;

scene.add(torus[0]);
scene.add(torus[1]);
scene.add(torus[2]);
scene.add(torus[3]);
scene.add(torus[4]);

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
  torus.forEach((t) => {
    t.rotation.y += 0.01;
  });

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

  const data = {
    color: light.color.getHex(),
    mapsEnabled: true,
  };
  const lightFolder = gui.addFolder("Light");
  lightFolder.addColor(data, "color").onChange(() => {
    light.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });
  lightFolder.add(light, "intensity", 0, 1, 0.01);

  const ambientLightFolder = gui.addFolder("AmbientLight");
  ambientLightFolder.open();

  const meshesFolder = gui.addFolder("Meshes");
  meshesFolder.add(data, "mapsEnabled").onChange(() => {
    material.forEach((m) => {
      if (data.mapsEnabled) {
        m.map = texture;
      } else {
        m.map = null;
      }
      m.needsUpdate = true;
    });
  });

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "SpecularMap" };
