import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Mesh,
  Raycaster,
  BoxGeometry,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const floor = new Mesh(
  new PlaneBufferGeometry(20, 20, 10, 10),
  new MeshBasicMaterial({ color: 0xaec6cf, wireframe: true }),
);
floor.rotateX(-Math.PI / 2);
scene.add(floor);

const geometry: BoxGeometry = new BoxGeometry();

//the cube used for .lerp
const cube1: Mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
cube1.position.y = 0.5;
scene.add(cube1);

//the cube used for .lerpVectors
const cube2: Mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
cube2.position.y = 0.5;
scene.add(cube2);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const raycaster = new Raycaster();

const v1 = new Vector3(0, 0.5, 0);
const v2 = new Vector3(0, 0.5, 0);

renderer.domElement.addEventListener("dblclick", onDoubleClick, false);
function onDoubleClick(event: MouseEvent) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(floor, false);

  if (intersects.length > 0) {
    v1.copy(intersects[0].point);
    v1.y += 0.5; //raise it so it appears to sit on grid
    //console.log(v1)
  }
}

const stats = new Stats();
app?.appendChild(stats.dom);

const data = { lerpAlpha: 0.1, lerpVectorsAlpha: 1.0 };

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube1.position.lerp(v1, data.lerpAlpha);
  cube2.position.lerpVectors(v1, v2, data.lerpVectorsAlpha);
  controls.target.copy(cube1.position);
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

// 调试控件
function addGui() {
  const container = document.querySelector<HTMLDivElement>("#gui");
  if (!container) return;
  const gui = new GUI({ container: container });

  const lerpFolder = gui.addFolder(".lerp");
  lerpFolder.add(data, "lerpAlpha", 0.01, 1.0, 0.01);
  lerpFolder.open();
  const lerpVectorsFolder = gui.addFolder(".lerpVectors");
  lerpVectorsFolder.add(data, "lerpVectorsAlpha", 0, 1.0, 0.01);
  lerpVectorsFolder.open();

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}
addGui();
animate();
