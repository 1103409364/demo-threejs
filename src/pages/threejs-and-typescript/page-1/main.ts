import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  Color,
  AxesHelper,
  SphereGeometry,
  IcosahedronGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");
// 场景
const scene = new Scene();
scene.background = new Color(0x000000);
// 相机 透视相机 近大远小
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;
// 创建渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.addEventListener("change", render);

const cube = createCube();
cube.position.x = 3;
const sphere = createSphere();
sphere.position.x = -3;
const icosahedron = createIcosahedron();
const line = createLine();
scene.add(cube);
scene.add(sphere);
scene.add(icosahedron);
scene.add(line);

window.addEventListener("resize", onWindowResize, false);

const stats = addStats();
const debug = document.getElementById("debug1");

addGui();
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
  debug && (debug.innerText = "cube Matrix\n" + cube.matrix.elements.toString().replace(/,/g, "\n"));
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
  const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }); // 定义纹理材质 wireframe 线框
  const cube = new Mesh(geometry, material);
  return cube;
}
function createSphere() {
  const geometry = new SphereGeometry();
  const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const sphere = new Mesh(geometry, material);
  return sphere;
}
function createIcosahedron() {
  const icosahedronGeometry = new IcosahedronGeometry();
  const icosahedronMaterial = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  return new Mesh(icosahedronGeometry, icosahedronMaterial);
}
// 创建一条线
function createLine() {
  const material = new LineBasicMaterial({ color: 0x00ff00 }); // 定义纹理材质
  const points = [];
  // 1个单位是多少像素？
  points.push(new Vector3(-2, 0, 0));
  points.push(new Vector3(0, 2, 0));
  points.push(new Vector3(2, 0, 0));
  points.push(new Vector3(0, -2, 0));
  points.push(new Vector3(-2, 0, 0));

  const geometry = new BufferGeometry().setFromPoints(points); // 定义几何体
  const line = new Line(geometry, material);
  return line;
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
  const cubeFolder = gui.addFolder("Cube"); // 分类
  const cubeRotationFolder = cubeFolder.addFolder("Rotation");
  cubeRotationFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
  cubeRotationFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
  cubeRotationFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);
  const cubePositionFolder = cubeFolder.addFolder("Position");
  cubePositionFolder.add(cube.position, "x", -5, 5, 0.01);
  cubePositionFolder.add(cube.position, "y", -5, 5, 0.01);
  cubePositionFolder.add(cube.position, "z", -5, 5, 0.01);
  const cubeScaleFolder = cubeFolder.addFolder("Scale");
  cubeScaleFolder.add(cube.scale, "x", 0, 5, 0.01);
  cubeScaleFolder.add(cube.scale, "y", 0, 5, 0.01);
  cubeScaleFolder.add(cube.scale, "z", 0, 5, 0.01);
  const cubeData = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
  };
  const cubePropertiesFolder = cubeFolder.addFolder("Properties");
  cubePropertiesFolder.add(cubeData, "width", 1, 30).onChange(regenerateBoxGeometry);
  //.onFinishChange(() => console.dir(cube.geometry));
  cubePropertiesFolder.add(cubeData, "height", 1, 30).onChange(regenerateBoxGeometry);
  cubePropertiesFolder.add(cubeData, "depth", 1, 30).onChange(regenerateBoxGeometry);
  cubePropertiesFolder.add(cubeData, "widthSegments", 1, 30).onChange(regenerateBoxGeometry);
  cubePropertiesFolder.add(cubeData, "heightSegments", 1, 30).onChange(regenerateBoxGeometry);
  cubePropertiesFolder.add(cubeData, "depthSegments", 1, 30).onChange(regenerateBoxGeometry);
  function regenerateBoxGeometry() {
    const newGeometry = new BoxGeometry(
      cubeData.width,
      cubeData.height,
      cubeData.depth,
      cubeData.widthSegments,
      cubeData.heightSegments,
      cubeData.depthSegments,
    );

    cube.geometry.dispose();
    cube.geometry = newGeometry;
  }
  cubeFolder.add(cube, "visible"); // 显示隐藏
  cubeFolder.close(); // 默认展开

  const sphereFolder = gui.addFolder("Sphere"); // 分类
  sphereFolder.add(sphere.position, "x", -5, 5, 0.01);
  sphereFolder.add(sphere.position, "y", -5, 5, 0.01);
  sphereFolder.add(sphere.position, "z", -5, 5, 0.01);
  const sphereData = {
    radius: 1,
    widthSegments: 8,
    heightSegments: 6,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI,
  };
  const spherePropertiesFolder = sphereFolder.addFolder("Properties");
  spherePropertiesFolder.add(sphereData, "radius", -5, 5).onChange(regenerateSphereGeometry);
  spherePropertiesFolder.add(sphereData, "widthSegments", 1, 30).onChange(regenerateSphereGeometry);
  spherePropertiesFolder.add(sphereData, "heightSegments", 1, 30).onChange(regenerateSphereGeometry);
  spherePropertiesFolder.add(sphereData, "phiStart", 0, Math.PI * 2).onChange(regenerateSphereGeometry);
  spherePropertiesFolder.add(sphereData, "phiLength", 0, Math.PI * 2).onChange(regenerateSphereGeometry);
  spherePropertiesFolder
    .add(sphereData, "thetaStart", 0, Math.PI * 2)
    .onChange(regenerateSphereGeometry);
  spherePropertiesFolder
    .add(sphereData, "thetaLength", 0, Math.PI * 2)
    .onChange(regenerateSphereGeometry);

  function regenerateSphereGeometry() {
    const newGeometry = new SphereGeometry(
      sphereData.radius,
      sphereData.widthSegments,
      sphereData.heightSegments,
      sphereData.phiStart,
      sphereData.phiLength,
      sphereData.thetaStart,
      sphereData.thetaLength,
    );
    sphere.geometry.dispose();
    sphere.geometry = newGeometry;
  }
  sphereFolder.add(sphere, "visible"); // 显示隐藏
  sphereFolder.close();

  const icosahedronData = {
    radius: 1,
    detail: 0,
  };
  const icosahedronFolder = gui.addFolder("Icosahedron"); // 分类
  icosahedronFolder.add(icosahedron.position, "x", -5, 5, 0.01);
  icosahedronFolder.add(icosahedron.position, "y", -5, 5, 0.01);
  icosahedronFolder.add(icosahedron.position, "z", -5, 5, 0.01);
  const icosahedronPropertiesFolder = icosahedronFolder.addFolder("Properties");
  icosahedronPropertiesFolder
    .add(icosahedronData, "radius", -5, 5)
    .onChange(regenerateIcosahedronGeometry);
  icosahedronPropertiesFolder
    .add(icosahedronData, "detail", 0, 10)
    .step(1)
    .onChange(regenerateIcosahedronGeometry);
  function regenerateIcosahedronGeometry() {
    const newGeometry = new IcosahedronGeometry(icosahedronData.radius, icosahedronData.detail);
    icosahedron.geometry.dispose();
    icosahedron.geometry = newGeometry;
  }

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}

function addAxesHelper() {
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);
}

export const pageInfo = { title: "创建一个场景（Creating a scene）" };
