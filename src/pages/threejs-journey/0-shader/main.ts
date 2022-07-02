import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  AxesHelper,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "stats.ts";
import fragment from "./glsl/fragment.frag";
import vertex from "./glsl/vertex.frag";

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
// 相机 透视相机 近大远小
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;
// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const cube = createCube();
cube.position.x = 2;
scene.add(cube);

const sphere = createSphere();
scene.add(sphere);

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();

addAxesHelper();
// render();
animate();

// 循环渲染
function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();
  // stats.update();
  render();
}
function render() {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 更新摄像机的投影矩阵
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// 创建一个立方体
function createCube() {
  const geometry = new BoxGeometry(); // 立方体有一些默认参数，长 宽 高 x,y,z轴的分段数
  // const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: false }); // 定义纹理材质 wireframe 线框
  const material = new ShaderMaterial({
    uniforms: {
      time: {
        // type: "f",
        value: 2.0,
      },
      resolution: {
        // type: "v2",
        value: new Vector2(),
      },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  const cube = new Mesh(geometry, material);
  return cube;
}

function createSphere() {
  const geometry = new SphereGeometry();
  const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const sphere = new Mesh(geometry, material);
  return sphere;
}

// 状态监控
function addStats() {
  const stats = new Stats();
  app?.appendChild(stats.dom);
  return stats;
}

function addAxesHelper() {
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);
}
