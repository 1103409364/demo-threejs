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
  MeshBasicMaterial,
  FrontSide,
  BackSide,
  DoubleSide,
  CubeRefractionMapping,
  TextureLoader,
  CubeTextureLoader,
  MultiplyOperation,
  MixOperation,
  AddOperation,
  CubeReflectionMapping,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { getImg } from "../../utils";

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
scene.add(new AxesHelper(5));

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

const material = new MeshBasicMaterial(); //{ color: 0x00ff00, wireframe: true })

const texture = new TextureLoader().load(getImg("grid")); // 图片放在当前路径无法打包
material.map = texture; // 材质
const envTexture = new CubeTextureLoader().load([
  getImg("px_50"),
  getImg("nx_50"),
  getImg("py_50"),
  getImg("ny_50"),
  getImg("pz_50"),
  getImg("nz_50"),
]); // 六个面
envTexture.mapping = CubeReflectionMapping; // 立方体【反射】映射
// envTexture.mapping = CubeRefractionMapping; // 立方体【折射】映射
material.envMap = envTexture; // 环境

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
      FrontSide,
      BackSide,
      DoubleSide,
    },
    combine: {
      MultiplyOperation,
      MixOperation,
      AddOperation,
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
  };

  const meshBasicMaterialFolder = gui.addFolder("THREE.MeshBasicMaterial");
  meshBasicMaterialFolder.addColor(data, "color").onChange(() => {
    material.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });
  meshBasicMaterialFolder.add(material, "wireframe");
  //meshBasicMaterialFolder.add(material, 'wireframeLinewidth', 0, 10)
  meshBasicMaterialFolder.add(material, "combine", options.combine).onChange(() => updateMaterial()); // 表面纹理材质和环境材质的混合方式：相乘、相加、mix 参考 https://threejs.org/docs/#api/en/materials/MeshBasicMaterial
  meshBasicMaterialFolder.add(material, "reflectivity", 0, 1); // 反射率
  meshBasicMaterialFolder.add(material, "refractionRatio", 0, 1); // 反射半径
  meshBasicMaterialFolder.open();

  function updateMaterial() {
    material.side = Number(material.side);
    material.combine = Number(material.combine);
    material.needsUpdate = true;
  }

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "MeshBasicMaterial" };
