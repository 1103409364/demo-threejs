import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Mesh,
  Clock,
  SphereGeometry,
  TextureLoader,
  MeshPhongMaterial,
  BoxGeometry,
  CylinderGeometry,
  Matrix4,
  SpotLight,
} from "three";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { CSG } from "@/utils/CSGMesh";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light1 = new SpotLight();
light1.position.set(2.5, 5, 5);
light1.angle = Math.PI / 4;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20;
scene.add(light1);

const light2 = new SpotLight();
light2.position.set(-2.5, 5, 5);
light2.angle = Math.PI / 4;
light2.penumbra = 0.5;
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20;
scene.add(light2);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0.5;
camera.position.y = 2;
camera.position.z = 2.5;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const material = new MeshPhongMaterial({
  map: new TextureLoader().load(getImg("grid")),
});

{
  //create a cube and sphere and intersect them
  const cubeMesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshPhongMaterial({ color: 0xff0000 }));
  const sphereMesh = new Mesh(
    new SphereGeometry(1.45, 8, 8),
    new MeshPhongMaterial({ color: 0x0000ff }),
  );
  const cylinderMesh1 = new Mesh(
    new CylinderGeometry(0.85, 0.85, 2, 8, 1, false),
    new MeshPhongMaterial({ color: 0x00ff00 }),
  );
  const cylinderMesh2 = new Mesh(
    new CylinderGeometry(0.85, 0.85, 2, 8, 1, false),
    new MeshPhongMaterial({ color: 0x00ff00 }),
  );
  const cylinderMesh3 = new Mesh(
    new CylinderGeometry(0.85, 0.85, 2, 8, 1, false),
    new MeshPhongMaterial({ color: 0x00ff00 }),
  );

  cubeMesh.position.set(-5, 0, -6);
  scene.add(cubeMesh);
  sphereMesh.position.set(-2, 0, -6);
  scene.add(sphereMesh);

  const cubeCSG = CSG.fromMesh(cubeMesh);
  const sphereCSG = CSG.fromMesh(sphereMesh);

  const cubeSphereIntersectCSG = cubeCSG.intersect(sphereCSG); // 相交
  const cubeSphereIntersectMesh = CSG.toMesh(cubeSphereIntersectCSG, new Matrix4());

  cubeSphereIntersectMesh.material = new MeshPhongMaterial({
    color: 0xff00ff,
  });
  cubeSphereIntersectMesh.position.set(-2.5, 0, -3);
  scene.add(cubeSphereIntersectMesh);

  //create 3 cylinders at different rotations and union them
  cylinderMesh1.position.set(1, 0, -6);
  scene.add(cylinderMesh1);
  cylinderMesh2.position.set(3, 0, -6);
  cylinderMesh2.geometry.rotateX(Math.PI / 2);
  scene.add(cylinderMesh2);
  cylinderMesh3.position.set(5, 0, -6);
  cylinderMesh3.geometry.rotateZ(Math.PI / 2);
  scene.add(cylinderMesh3);

  const cylinderCSG1 = CSG.fromMesh(cylinderMesh1);
  const cylinderCSG2 = CSG.fromMesh(cylinderMesh2);
  const cylinderCSG3 = CSG.fromMesh(cylinderMesh3);

  const cylindersUnionCSG = cylinderCSG1.union(cylinderCSG2.union(cylinderCSG3)); // 联合
  const cylindersUnionMesh = CSG.toMesh(cylindersUnionCSG, new Matrix4());

  cylindersUnionMesh.material = new MeshPhongMaterial({
    color: 0xffa500,
  });
  cylindersUnionMesh.position.set(2.5, 0, -3);
  scene.add(cylindersUnionMesh);

  //subtract the cylindersUnionCSG from the cubeSphereIntersectCSG
  const finalCSG = cubeSphereIntersectCSG.subtract(cylindersUnionCSG); // 减去
  const finalMesh = CSG.toMesh(finalCSG, new Matrix4());
  finalMesh.material = material;
  scene.add(finalMesh);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
app?.appendChild(stats.dom);

const clock = new Clock();
let delta;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

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

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}
addGui();
animate();
