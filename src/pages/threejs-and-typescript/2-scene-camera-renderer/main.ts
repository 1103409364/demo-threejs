import "@/style/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const c1 = document.querySelector<HTMLCanvasElement>("#c1");
const c2 = document.querySelector<HTMLCanvasElement>("#c2");
const c3 = document.querySelector<HTMLCanvasElement>("#c3");
const c4 = document.querySelector<HTMLCanvasElement>("#c4");
// 场景
const scene = new THREE.Scene();
// 相机 透视相机 近大远小
const camera1 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
// 相机2 正交相机
const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 5);
const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 5);
const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 5);
camera1.position.z = 2;
camera2.position.y = 2;
camera2.lookAt(new THREE.Vector3(0, 0, 0));
camera3.position.z = 2;
camera4.position.x = 2;
camera4.lookAt(new THREE.Vector3(0, 0, 0));

// 创建渲染器
const renderer1 = c1 && new THREE.WebGLRenderer({ canvas: c1 });
const renderer2 = c2 && new THREE.WebGLRenderer({ canvas: c2 });
const renderer3 = c3 && new THREE.WebGLRenderer({ canvas: c3 });
const renderer4 = c4 && new THREE.WebGLRenderer({ canvas: c4 });
renderer1?.setSize(200, 200);
renderer2?.setSize(200, 200);
renderer3?.setSize(200, 200);
renderer4?.setSize(200, 200);
// app?.appendChild(renderer1.domElement);

const controls1 = c1 && new OrbitControls(camera1, c1);
controls1?.addEventListener("change", render1);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// window.addEventListener("resize", onWindowResize, false);
// function onWindowResize() {
//   camera1.aspect = window.innerWidth / window.innerHeight;
//   camera1.updateProjectionMatrix();
//   renderer1.setSize(window.innerWidth, window.innerHeight);
//   render();
// }

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls1?.update();

  render();
}

function render() {
  renderer2?.render(scene, camera2);
  renderer3?.render(scene, camera3);
  renderer4?.render(scene, camera4);
}
function render1() {
  renderer1?.render(scene, camera1);
}
animate();
render1();
