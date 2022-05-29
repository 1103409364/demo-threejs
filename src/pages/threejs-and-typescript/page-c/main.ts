import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  BoxGeometry,
  SphereGeometry,
  IcosahedronGeometry,
  PlaneGeometry,
  TorusKnotGeometry,
  FrontSide,
  BackSide,
  DoubleSide,
  PointLight,
  TextureLoader,
  NearestFilter,
  MeshToonMaterial,
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
const boxGeometry = new BoxGeometry();
const sphereGeometry = new SphereGeometry();
const icosahedronGeometry = new IcosahedronGeometry(1, 0);
const planeGeometry = new PlaneGeometry();
const torusKnotGeometry = new TorusKnotGeometry();

const threeTone = new TextureLoader().load(getImg("threeTone", "jpg"));
threeTone.minFilter = NearestFilter;
threeTone.magFilter = NearestFilter;

const fourTone = new TextureLoader().load(getImg("fourTone", "jpg"));
fourTone.minFilter = NearestFilter;
fourTone.magFilter = NearestFilter;

const fiveTone = new TextureLoader().load(getImg("fiveTone", "jpg"));
fiveTone.minFilter = NearestFilter;
fiveTone.magFilter = NearestFilter;

const material: MeshToonMaterial = new MeshToonMaterial();

const cube = new Mesh(boxGeometry, material);
cube.position.x = 5;
scene.add(cube);

const sphere = new Mesh(sphereGeometry, material);
sphere.position.x = 3;
scene.add(sphere);

const icosahedron = new Mesh(icosahedronGeometry, material);
icosahedron.position.x = 0;
scene.add(icosahedron);

const plane = new Mesh(planeGeometry, material);
plane.position.x = -2;
scene.add(plane);

const torusKnot = new Mesh(torusKnotGeometry, material);
torusKnot.position.x = -5;
scene.add(torusKnot);

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
  rotation(cube);
  rotation(icosahedron);
  rotation(plane);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function rotation(mesh: Mesh) {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
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

  const options = {
    side: {
      FrontSide: FrontSide,
      BackSide: BackSide,
      DoubleSide: DoubleSide,
    },
    gradientMap: {
      Default: null,
      threeTone: "threeTone",
      fourTone: "fourTone",
      fiveTone: "fiveTone",
    },
  };

  const data = {
    lightColor: light.color.getHex(),
    color: material.color.getHex(),
    gradientMap: "threeTone",
  };

  material.gradientMap = threeTone;

  const lightFolder = gui.addFolder("THREE.Light");
  lightFolder.addColor(data, "lightColor").onChange(() => {
    light.color.setHex(Number(data.lightColor.toString().replace("#", "0x")));
  });
  lightFolder.add(light, "intensity", 0, 4);

  const materialFolder = gui.addFolder("THREE.Material");
  materialFolder.add(material, "transparent").onChange(() => (material.needsUpdate = true));
  materialFolder.add(material, "opacity", 0, 1, 0.01);
  materialFolder.add(material, "depthTest");
  materialFolder.add(material, "depthWrite");
  materialFolder.add(material, "alphaTest", 0, 1, 0.01).onChange(() => updateMaterial());
  materialFolder.add(material, "visible");
  materialFolder.add(material, "side", options.side).onChange(() => updateMaterial());
  //materialFolder.open()

  const meshToonMaterialFolder = gui.addFolder("THREE.MeshToonMaterial");
  meshToonMaterialFolder.addColor(data, "color").onChange(() => {
    material.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });

  //shininess, specular and flatShading no longer supported in MeshToonMaterial

  meshToonMaterialFolder.add(data, "gradientMap", options.gradientMap).onChange(() => updateMaterial());
  meshToonMaterialFolder.open();

  function updateMaterial() {
    material.side = Number(material.side);
    material.gradientMap = eval(data.gradientMap as string);
    material.needsUpdate = true;
  }

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "MeshToonMaterial" };
