import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  PlaneGeometry,
  TextureLoader,
  MeshBasicMaterial,
  NearestFilter,
  LinearFilter,
  LinearMipMapLinearFilter,
  LinearMipmapNearestFilter,
  NearestMipMapLinearFilter,
  NearestMipMapNearestFilter,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui";
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene1 = new Scene();
const scene2 = new Scene();

const axesHelper1 = new AxesHelper(5);
scene1.add(axesHelper1);
const axesHelper2 = new AxesHelper(5);
scene2.add(axesHelper2);

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

const planeGeometry1 = new PlaneGeometry();
const planeGeometry2 = new PlaneGeometry();

const texture1 = new TextureLoader().load(getImg("grid"));
const texture2 = texture1.clone();

const material1 = new MeshBasicMaterial({ map: texture1 });
const material2 = new MeshBasicMaterial({ map: texture2 });

texture2.minFilter = NearestFilter;
texture2.magFilter = NearestFilter;

const plane1 = new Mesh(planeGeometry1, material1);
const plane2 = new Mesh(planeGeometry2, material2);

scene1.add(plane1);
scene2.add(plane2);

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
  renderer.setScissorTest(true);
  //  渲染两个场景对比效果 留一个 2单位的空白
  renderer.setScissor(0, 0, window.innerWidth / 2 - 2, window.innerHeight);
  renderer.render(scene1, camera);

  renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2 - 2, window.innerHeight);
  renderer.render(scene2, camera);

  renderer.setScissorTest(false);
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
    minFilters: {
      NearestFilter: NearestFilter,
      NearestMipMapLinearFilter: NearestMipMapLinearFilter,
      NearestMipMapNearestFilter: NearestMipMapNearestFilter,
      "LinearFilter ": LinearFilter,
      "LinearMipMapLinearFilter (Default)": LinearMipMapLinearFilter,
      LinearMipmapNearestFilter: LinearMipmapNearestFilter,
    },
    magFilters: {
      NearestFilter: NearestFilter,
      "LinearFilter (Default)": LinearFilter,
    },
  };

  const textureFolder = gui.addFolder("THREE.Texture");
  textureFolder.add(texture2, "minFilter", options.minFilters).onChange(() => updateMinFilter());
  textureFolder.add(texture2, "magFilter", options.magFilters).onChange(() => updateMagFilter());
  textureFolder.open();

  function updateMinFilter() {
    // for Three r137 and earlier
    // texture2.minFilter = Number(texture2.minFilter)
    // texture2.needsUpdate = true

    // for Three r138 and later
    material2.map = new TextureLoader().load(getImg("grid"));
    material2.map.minFilter = texture2.minFilter;
    material2.map.magFilter = texture2.magFilter;
  }
  function updateMagFilter() {
    // for Three r137 and earlier
    // texture2.magFilter = texture2.magFilter;
    // texture2.needsUpdate = true

    // for Three r138 and later
    material2.map = new TextureLoader().load(getImg("grid"));
    material2.map.minFilter = texture2.minFilter;
    material2.map.magFilter = texture2.magFilter;
  }
}
