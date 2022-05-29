import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  PlaneGeometry,
  PointLight,
  TextureLoader,
  MeshPhongMaterial,
  BackSide,
  DoubleSide,
  FrontSide,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui";
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
controls.screenSpacePanning = true; //so that panning up and down doesn't zoom in/out
//controls.addEventListener('change', render)

const planeGeometry = new PlaneGeometry(3.6, 1.8, 1440, 720); // 增加几何体分辨率

const material = new MeshPhongMaterial();

const texture = new TextureLoader().load(getImg("worldColour.5400x2700", "jpg"));
material.map = texture;

const displacementMap = new TextureLoader().load(getImg("gebco_bathy.5400x2700_8bit", "jpg"));
material.displacementMap = displacementMap;

const plane: Mesh = new Mesh(planeGeometry, material);
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
  };
  const materialFolder = gui.addFolder("Material");

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

  const meshPhongMaterialFolder = gui.addFolder("THREE.meshPhongMaterialFolder");

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
  meshPhongMaterialFolder.add(material, "reflectivity", 0, 1);
  meshPhongMaterialFolder.add(material, "refractionRatio", 0, 1);
  meshPhongMaterialFolder.add(material, "displacementScale", 0, 1, 0.01);
  meshPhongMaterialFolder.add(material, "displacementBias", -1, 1, 0.01);
  meshPhongMaterialFolder.open();

  function updateMaterial() {
    material.side = Number(material.side);
    material.needsUpdate = true;
  }

  const planeData = {
    width: 3.6,
    height: 1.8,
    widthSegments: 360,
    heightSegments: 180,
  };

  const planePropertiesFolder = gui.addFolder("PlaneGeometry");
  //planePropertiesFolder.add(planeData, 'width', 1, 30).onChange(regeneratePlaneGeometry)
  //planePropertiesFolder.add(planeData, 'height', 1, 30).onChange(regeneratePlaneGeometry)
  planePropertiesFolder.add(planeData, "widthSegments", 1, 360).onChange(regeneratePlaneGeometry);
  planePropertiesFolder.add(planeData, "heightSegments", 1, 180).onChange(regeneratePlaneGeometry);
  planePropertiesFolder.open();

  function regeneratePlaneGeometry() {
    const newGeometry = new PlaneGeometry(
      planeData.width,
      planeData.height,
      planeData.widthSegments,
      planeData.heightSegments,
    );
    plane.geometry.dispose();
    plane.geometry = newGeometry;
  }

  const textureFolder = gui.addFolder("Texture"); // 修改 uv 坐标
  textureFolder.add(texture.repeat, "x", 0.1, 1, 0.1);
  textureFolder.add(texture.repeat, "y", 0.1, 1, 0.1);
  textureFolder.add(texture.center, "x", 0, 1, 0.001);
  textureFolder.add(texture.center, "y", 0, 1, 0.001);

  textureFolder.open();

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

export const pageInfo = { title: "Material Repeat and Center" };
