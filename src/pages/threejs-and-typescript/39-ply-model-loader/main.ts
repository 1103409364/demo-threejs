import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  SpotLight,
  CubeTextureLoader,
  CubeReflectionMapping,
  MeshPhysicalMaterial,
  DoubleSide,
  Mesh,
  sRGBEncoding,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new SpotLight();
light.position.set(20, 20, 20);
scene.add(light);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const renderer = new WebGLRenderer();
renderer.outputEncoding = sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const envTexture = new CubeTextureLoader().load([
  getImg("px_50"),
  getImg("px_50"),
  getImg("nx_50"),
  getImg("py_50"),
  getImg("ny_50"),
  getImg("pz_50"),
  getImg("nz_50"),
]);
envTexture.mapping = CubeReflectionMapping;
const material = new MeshPhysicalMaterial({
  color: 0xb2ffc8,
  envMap: envTexture,
  metalness: 0,
  roughness: 0,
  transparent: true,
  transmission: 1,
  side: DoubleSide,
  clearcoat: 1.0,
  clearcoatRoughness: 0.25,
});

const loader = new PLYLoader();
loader.load(
  "/assets/models/sean4.ply",
  function (geometry) {
    geometry.computeVertexNormals();
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  },
);

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
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
