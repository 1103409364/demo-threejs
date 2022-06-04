import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  TextureLoader,
  MeshPhongMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  MeshToonMaterial,
  TorusGeometry,
  PlaneGeometry,
  // BasicShadowMap,
  // PCFShadowMap,
  PCFSoftShadowMap,
  // VSMShadowMap,
  CameraHelper,
  DirectionalLight,
  // SpotLightHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new DirectionalLight();
light.castShadow = true;
light.shadow.mapSize.width = 512; // 增加阴影贴图面积可以提高阴影质量
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
scene.add(light);

// const helper = new SpotLightHelper(light);
const helper = new CameraHelper(light.shadow.camera);
scene.add(helper);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap; // 阴影贴图类型，一次只能用一种。默认是 PCFSoftShadowMap
// renderer.shadowMap.type = BasicShadowMap; // 质量低
// renderer.shadowMap.type = PCFShadowMap;
// renderer.shadowMap.type = VSMShadowMap; // 平面有横条
app?.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const planeGeometry = new PlaneGeometry(100, 20);
const plane = new Mesh(planeGeometry, new MeshPhongMaterial());
plane.rotateX(-Math.PI / 2);
plane.position.y = -1.75;
plane.receiveShadow = true; // 接收阴影的平面
scene.add(plane);

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

torus[0].castShadow = true;
torus[1].castShadow = true;
torus[2].castShadow = true;
torus[3].castShadow = true;
torus[4].castShadow = true;
// 环面也可以接收阴影
torus[0].receiveShadow = true;
torus[1].receiveShadow = true;
torus[2].receiveShadow = true;
torus[3].receiveShadow = true;
torus[4].receiveShadow = true;

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

  helper.update();
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
    shadowMapSizeWidth: 512,
    shadowMapSizeHeight: 512,
  };
  const lightFolder = gui.addFolder("THREE.Light");
  lightFolder.addColor(data, "color").onChange(() => {
    light.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });
  lightFolder.add(light, "intensity", 0, 1, 0.01);

  const directionalLightFolder = gui.addFolder("THREE.DirectionalLight");
  directionalLightFolder
    .add(light.shadow.camera, "left", -10, -1, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "right", 1, 10, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "top", 1, 10, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "bottom", -10, -1, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "near", 0.1, 100)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "far", 0.1, 100)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096])
    .onChange(() => updateShadowMapSize());
  directionalLightFolder
    .add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096])
    .onChange(() => updateShadowMapSize());
  directionalLightFolder.add(light.position, "x", -50, 50, 0.01);
  directionalLightFolder.add(light.position, "y", -50, 50, 0.01);
  directionalLightFolder.add(light.position, "z", -50, 50, 0.01);
  directionalLightFolder.open();

  function updateShadowMapSize() {
    light.shadow.mapSize.width = data.shadowMapSizeWidth;
    light.shadow.mapSize.height = data.shadowMapSizeHeight;
    (light.shadow.map as any) = null;
  }

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

export const pageInfo = { title: "Directional Light Shadow" };
