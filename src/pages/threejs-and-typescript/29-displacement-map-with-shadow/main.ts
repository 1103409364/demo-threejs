import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  TextureLoader,
  PlaneGeometry,
  CameraHelper,
  DirectionalLight,
  PCFShadowMap,
  MeshStandardMaterial,
  BackSide,
  DoubleSide,
  FrontSide,
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

const light = new DirectionalLight(0xffffff, 10);
light.position.set(-4.4, 3.3, 2.2);
light.castShadow = true;
light.shadow.bias = -0.003;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.left = -5;
light.shadow.camera.right = 5;
light.shadow.camera.top = -2;
light.shadow.camera.bottom = 2;
light.shadow.camera.near = 1;
light.shadow.camera.far = 10;
scene.add(light);

// const helper = new SpotLightHelper(light);
const helper = new CameraHelper(light.shadow.camera);
scene.add(helper);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 1);

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const planeGeometry = new PlaneGeometry(3.6, 1.8, 360, 180);

const material = new MeshStandardMaterial();
material.metalness = 0;
material.roughness = 0;

const texture = new TextureLoader().load(getImg("worldColour.5400x2700", "jpg"));
material.map = texture;

const displacementMap = new TextureLoader().load(getImg("gebco_bathy.5400x2700_8bit", "jpg")); // 置换贴图
material.displacementMap = displacementMap;
material.displacementScale = 0.3;

const plane = new Mesh(planeGeometry, material);
plane.rotation.x = -Math.PI / 2;
plane.castShadow = true;
plane.receiveShadow = true;

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

  helper.update();
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
  materialFolder.add(material, "transparent").onChange(() => (material.needsUpdate = true));
  materialFolder.add(material, "opacity", 0, 1, 0.01);
  materialFolder.add(material, "depthTest");
  materialFolder.add(material, "depthWrite");
  materialFolder.add(material, "alphaTest", 0, 1, 0.01).onChange(() => updateMaterial());
  materialFolder.add(material, "visible");
  materialFolder.add(material, "side", options.side).onChange(() => updateMaterial());
  //materialFolder.open()
  const data = {
    color: material.color.getHex(),
    shadowMapSizeWidth: 2048,
    shadowMapSizeHeight: 2048,
  };

  const meshStandardMaterialFolder = gui.addFolder("MeshStandardMaterial");

  meshStandardMaterialFolder.addColor(data, "color").onChange(() => {
    material.color.setHex(Number(data.color.toString().replace("#", "0x")));
  });
  meshStandardMaterialFolder.add(material, "wireframe");
  meshStandardMaterialFolder.add(material, "flatShading").onChange(() => updateMaterial());
  meshStandardMaterialFolder.add(material, "displacementScale", -1, 1, 0.01);
  meshStandardMaterialFolder.add(material, "displacementBias", -1, 1, 0.01);

  meshStandardMaterialFolder.add(material, "roughness", 0, 1);
  meshStandardMaterialFolder.add(material, "metalness", 0, 1);
  //meshStandardMaterialFolder.open()

  const planeData = {
    width: 3.6,
    height: 1.8,
    widthSegments: 180,
    heightSegments: 90,
  };
  const planePropertiesFolder = gui.addFolder("PlaneGeometry");
  //planePropertiesFolder.add(planeData, 'width', 1, 30).onChange(regeneratePlaneGeometry)
  //planePropertiesFolder.add(planeData, 'height', 1, 30).onChange(regeneratePlaneGeometry)
  planePropertiesFolder.add(planeData, "widthSegments", 1, 360).onChange(regeneratePlaneGeometry);
  planePropertiesFolder.add(planeData, "heightSegments", 1, 180).onChange(regeneratePlaneGeometry);
  //planePropertiesFolder.open()

  const directionalLightFolder = gui.addFolder("DirectionalLight");
  directionalLightFolder
    .add(light.shadow.camera, "left", -5, -1, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "right", 1, 5, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "top", 1, 5, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  directionalLightFolder
    .add(light.shadow.camera, "bottom", -5, -1, 0.1)
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
  directionalLightFolder.add(light.position, "x", -5, 5, 0.01);
  directionalLightFolder.add(light.position, "y", -5, 5, 0.01);
  directionalLightFolder.add(light.position, "z", -5, 5, 0.01);
  directionalLightFolder.open();

  function updateShadowMapSize() {
    light.shadow.mapSize.width = data.shadowMapSizeWidth;
    light.shadow.mapSize.height = data.shadowMapSizeHeight;
    (light.shadow.map as any) = null;
  }

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
  function updateMaterial() {
    material.side = Number(material.side);
    material.needsUpdate = true;
  }

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}
