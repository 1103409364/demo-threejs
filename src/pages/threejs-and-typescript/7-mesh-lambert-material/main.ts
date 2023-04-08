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
  MeshLambertMaterial,
  MultiplyOperation,
  MixOperation,
  AddOperation,
  PointLight,
  TextureLoader,
  CubeTextureLoader,
  CubeRefractionMapping,
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

const material = new MeshLambertMaterial();

const texture = new TextureLoader().load(getImg("grid")); // 表面纹理
material.map = texture;
const envTexture = new CubeTextureLoader().load([
  getImg("px_50"),
  getImg("nx_50"),
  getImg("py_50"),
  getImg("ny_50"),
  getImg("pz_50"),
  getImg("nz_50"),
]); // 六个面 环境纹理

//envTexture.mapping = CubeReflectionMapping
envTexture.mapping = CubeRefractionMapping;
material.envMap = envTexture;

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
  render();
}
// // 开启 f12 后帧数显示异常
// function handleControlChange() {
//   stats.update();
//   render();
// }
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
  const options = {
    side: {
      FrontSide: FrontSide,
      BackSide: BackSide,
      DoubleSide: DoubleSide,
    },
    combine: {
      MultiplyOperation: MultiplyOperation,
      MixOperation: MixOperation,
      AddOperation: AddOperation,
    },
  };

  const materialFolder = gui.addFolder("THREE.Material");
  materialFolder.add(material, "transparent").onChange(() => (material.needsUpdate = true));
  materialFolder.add(material, "opacity", 0, 1, 0.01);
  materialFolder.add(material, "depthTest");
  materialFolder.add(material, "depthWrite");
  materialFolder.add(material, "alphaTest", 0, 1, 0.01).onChange(() => updateMaterial());
  materialFolder.add(material, "visible");
  materialFolder.add(material, "side", options.side).onChange(() => updateMaterial());
  materialFolder.open();

  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(), // 发光颜色
  };

  const meshLambertMaterialFolder = gui.addFolder("THREE.MeshLambertMaterial");

  meshLambertMaterialFolder.addColor(data, "color").onChange(() => {
    material.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });
  meshLambertMaterialFolder.addColor(data, "emissive").onChange(() => {
    material.emissive.setHex(Number(data.emissive.toString().replace("#", "0x")));
  });
  meshLambertMaterialFolder.add(material, "wireframe");
  meshLambertMaterialFolder.add(material, "wireframeLinewidth", 0, 10);
  //meshLambertMaterialFolder.add(material, 'flatShading').onChange(() => updateMaterial())
  meshLambertMaterialFolder.add(material, "combine", options.combine).onChange(() => updateMaterial());
  meshLambertMaterialFolder.add(material, "reflectivity", 0, 1);
  meshLambertMaterialFolder.add(material, "refractionRatio", 0, 1);
  meshLambertMaterialFolder.open();

  function updateMaterial() {
    material.side = material.side;
    material.combine = material.combine;
    material.needsUpdate = true;
  }

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}
