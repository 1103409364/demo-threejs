import "@/style/index.scss";
import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, PointLight, Mesh, Light } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

// const light = new PointLight();
// light.position.set(2.5, 7.5, 15);
// scene.add(light);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new WebGLRenderer();
renderer.physicallyCorrectLights = true; // 自然光
renderer.shadowMap.enabled = true; // 启用阴影

renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
loader.load(
  "/assets/models/monkey.glb",
  (gltf) => {
    gltf.scene.traverse((child) => {
      if ((<Mesh>child).isMesh) {
        const m = child;
        m.receiveShadow = true; // 接受阴影
        m.castShadow = true;
      }
      if ((<Light>child).isLight) {
        const l = <Light>child;
        l.castShadow = true;
        // l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    scene.add(gltf.scene);
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
