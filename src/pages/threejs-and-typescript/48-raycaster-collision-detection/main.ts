import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Mesh,
  MeshNormalMaterial,
  Raycaster,
  Vector3,
  Intersection,
  BoxBufferGeometry,
  BufferGeometry,
  DoubleSide,
  Line,
  LineBasicMaterial,
  PlaneBufferGeometry,
  Material,
  // CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";

// import { GUI } from "lil-gui"; // dat.GUI 的替代方案
// import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const raycaster = new Raycaster();
const sceneMeshes: Mesh[] = [];
const dir = new Vector3();
let intersects: Intersection[] = []; // 相交的
let intersected: Mesh<BufferGeometry, Material | Material[]>;
const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.enableDamping = true;

orbitControls.addEventListener("change", function () {
  xLine.position.copy(orbitControls.target);
  yLine.position.copy(orbitControls.target);
  zLine.position.copy(orbitControls.target);

  raycaster.set(orbitControls.target, dir.subVectors(camera.position, orbitControls.target).normalize());
  intersects = raycaster.intersectObjects(sceneMeshes, false);
  if (intersects.length > 0) {
    // 相交移动相机
    // if (intersects[0].distance < orbitControls.target.distanceTo(camera.position)) {
    // camera.position.copy(intersects[0].point);
    // }
    // 相交的材质半透明
    intersected = <Mesh>intersects[0].object;
    (<MeshNormalMaterial>intersected.material).opacity = 0.1;
  } else {
    if (intersected) {
      (<MeshNormalMaterial>intersected.material).opacity = 1;
    }
  }
});

const floor = new Mesh(
  new PlaneBufferGeometry(10, 10),
  new MeshNormalMaterial({ side: DoubleSide, transparent: true }),
);
floor.rotateX(-Math.PI / 2);
floor.position.y = -1;
scene.add(floor);
sceneMeshes.push(floor);

const wall1 = new Mesh(
  new PlaneBufferGeometry(2, 2),
  new MeshNormalMaterial({ side: DoubleSide, transparent: true }),
);
wall1.position.x = 3;
wall1.rotateY(-Math.PI / 2);
scene.add(wall1);
sceneMeshes.push(wall1);

const wall2 = new Mesh(
  new PlaneBufferGeometry(2, 2),
  new MeshNormalMaterial({ side: DoubleSide, transparent: true }),
);
wall2.position.z = -2;
scene.add(wall2);
sceneMeshes.push(wall2);

const cube: Mesh = new Mesh(new BoxBufferGeometry(), new MeshNormalMaterial({ transparent: true }));
cube.position.set(-3, 0, 0);
scene.add(cube);
sceneMeshes.push(cube);

const ceiling = new Mesh(
  new PlaneBufferGeometry(10, 10),
  new MeshNormalMaterial({ side: DoubleSide, transparent: true }),
);
ceiling.rotateX(Math.PI / 2);
ceiling.position.y = 3;
scene.add(ceiling);
sceneMeshes.push(ceiling);

//crosshair
const lineMaterial = new LineBasicMaterial({
  color: 0x0000ff,
});
const points: Vector3[] = [];
points[0] = new Vector3(-0.1, 0, 0);
points[1] = new Vector3(0.1, 0, 0);
let lineGeometry = new BufferGeometry().setFromPoints(points);
const xLine = new Line(lineGeometry, lineMaterial);
scene.add(xLine);
points[0] = new Vector3(0, -0.1, 0);
points[1] = new Vector3(0, 0.1, 0);
lineGeometry = new BufferGeometry().setFromPoints(points);
const yLine = new Line(lineGeometry, lineMaterial);
scene.add(yLine);
points[0] = new Vector3(0, 0, -0.1);
points[1] = new Vector3(0, 0, 0.1);
lineGeometry = new BufferGeometry().setFromPoints(points);
const zLine = new Line(lineGeometry, lineMaterial);
scene.add(zLine);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.querySelector("#gui")?.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
