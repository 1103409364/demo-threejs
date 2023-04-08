import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  PlaneGeometry,
  FrontSide,
  BackSide,
  DoubleSide,
  PointLight,
  TextureLoader,
  MeshPhongMaterial,
  AddOperation,
  MixOperation,
  MultiplyOperation,
  CubeReflectionMapping,
  CubeTextureLoader,
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
const planeGeometry = new PlaneGeometry(3.6, 1.8);

const material = new MeshPhongMaterial();

//const texture = new TextureLoader().load("img/grid.png")
const texture = new TextureLoader().load(getImg("worldColour.5400x2700", "jpg"));
material.map = texture;
const envTexture = new CubeTextureLoader().load([
  getImg("px_50"),
  getImg("nx_50"),
  getImg("py_50"),
  getImg("ny_50"),
  getImg("pz_50"),
  getImg("nz_50"),
]);
// const envTexture = new CubeTextureLoader().load([
//   getImg("px_eso0932a", "jpg"),
//   getImg("nx_eso0932a", "jpg"),
//   getImg("py_eso0932a", "jpg"),
//   getImg("ny_eso0932a", "jpg"),
//   getImg("pz_eso0932a", "jpg"),
//   getImg("nz_eso0932a", "jpg"),
// ]);
envTexture.mapping = CubeReflectionMapping;
material.envMap = envTexture;

const specularTexture = new TextureLoader().load(getImg("grayscale-test"));
// const specularTexture = new TextureLoader().load(getImg("earthSpecular", "jpg"));
material.specularMap = specularTexture;

const plane = new Mesh(planeGeometry, material);
scene.add(plane);

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
  materialFolder.add(material, "transparent");
  materialFolder.add(material, "opacity", 0, 1, 0.01);
  materialFolder.add(material, "depthTest");
  materialFolder.add(material, "depthWrite");
  materialFolder.add(material, "alphaTest", 0, 1, 0.01).onChange(() => updateMaterial());
  materialFolder.add(material, "visible");
  materialFolder.add(material, "side", options.side).onChange(() => updateMaterial());
  //materialFolder.open()

  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    specular: material.specular.getHex(),
  };

  const meshPhongMaterialFolder = gui.addFolder("THREE.MeshPhongMaterial");

  meshPhongMaterialFolder.addColor(data, "color").onChange(() => {
    material.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });
  meshPhongMaterialFolder.addColor(data, "emissive").onChange(() => {
    material.emissive.setHex(Number(data.emissive.toString().replace("#", "0x")));
  });
  meshPhongMaterialFolder.addColor(data, "specular").onChange(() => {
    material.specular.setHex(Number(data.specular.toString().replace("#", "0x")));
  });
  meshPhongMaterialFolder.add(material, "shininess", 0, 1024);
  meshPhongMaterialFolder.add(material, "wireframe");
  meshPhongMaterialFolder.add(material, "flatShading").onChange(() => updateMaterial());
  meshPhongMaterialFolder.add(material, "combine", options.combine).onChange(() => updateMaterial());
  meshPhongMaterialFolder.add(material, "reflectivity", 0, 1);
  meshPhongMaterialFolder.open();

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
