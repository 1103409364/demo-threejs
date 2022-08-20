import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Mesh,
  MeshNormalMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  SpotLight,
  Clock,
  Object3D,
  PCFSoftShadowMap,
} from "three";
import * as CANNON from "cannon-es";
import CannonDebugRenderer from "@/utils/cannonDebugRenderer";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

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
camera.position.set(0, 4, 4);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.y = 2;

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const normalMaterial = new MeshNormalMaterial();
const phongMaterial = new MeshPhongMaterial();

const monkeyMeshes: Object3D[] = [];
const monkeyBodies: CANNON.Body[] = [];
let monkeyLoaded = false;

const objLoader = new OBJLoader();
objLoader.load(
  "/assets/models/monkey.obj",
  (object) => {
    const monkeyMesh = object.children[0] as Mesh;
    monkeyMesh.material = normalMaterial;

    // const positions = monkeyMesh.geometry.attributes.position.array
    // const points: Vector3[] = []
    // for (let i = 0; i < positions.length; i += 3) {
    //     points.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]))
    // }
    // const convexHull = new ConvexGeometry(points)

    for (let i = 0; i < 200; i++) {
      const monkeyMeshClone = monkeyMesh.clone();
      monkeyMeshClone.position.x = Math.floor(Math.random() * 10) - 5;
      monkeyMeshClone.position.z = Math.floor(Math.random() * 10) - 5;
      monkeyMeshClone.position.y = 5 + i;
      scene.add(monkeyMeshClone);
      monkeyMeshes.push(monkeyMeshClone);

      // const monkeyShape = CannonUtils.CreateTrimesh((monkeyMesh as Mesh).geometry)
      // const monkeyShape = CannonUtils.CreateConvexPolyhedron(new IcosahedronGeometry(1))
      // const monkeyShape = CannonUtils.CreateConvexPolyhedron((monkeyMesh as Mesh).geometry)
      // const monkeyShape = CannonUtils.CreateConvexPolyhedron(convexHull)

      const monkeyBody = new CANNON.Body({ mass: 1 });
      // monkeyBody.addShape(monkeyShape)
      // monkeyBody.addShape(new CANNON.Sphere(1))// head,
      monkeyBody.addShape(new CANNON.Sphere(0.8), new CANNON.Vec3(0, 0.2, 0)); // head,
      monkeyBody.addShape(new CANNON.Sphere(0.05), new CANNON.Vec3(0, -0.97, 0.46)); // chin,
      monkeyBody.addShape(new CANNON.Sphere(0.05), new CANNON.Vec3(-1.36, 0.29, -0.5)); //left ear
      monkeyBody.addShape(new CANNON.Sphere(0.05), new CANNON.Vec3(1.36, 0.29, -0.5)); //right ear
      monkeyBody.position.x = monkeyMeshClone.position.x;
      monkeyBody.position.y = monkeyMeshClone.position.y;
      monkeyBody.position.z = monkeyMeshClone.position.z;
      world.addBody(monkeyBody);
      monkeyBodies.push(monkeyBody);
    }

    monkeyLoaded = true;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("An error happened", error);
  },
);

const planeGeometry = new PlaneGeometry(25, 25);
const planeMesh = new Mesh(planeGeometry, phongMaterial);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

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

const cannonDebugRenderer = new CannonDebugRenderer(scene, world);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  delta = Math.min(clock.getDelta(), 0.1);
  world.step(delta);

  cannonDebugRenderer.update();

  // Copy coordinates from Cannon to js
  if (monkeyLoaded) {
    monkeyMeshes.forEach((m, i) => {
      m.position.set(monkeyBodies[i].position.x, monkeyBodies[i].position.y, monkeyBodies[i].position.z);
      m.quaternion.set(
        monkeyBodies[i].quaternion.x,
        monkeyBodies[i].quaternion.y,
        monkeyBodies[i].quaternion.z,
        monkeyBodies[i].quaternion.w,
      );
    });
  }

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
  const physicsFolder = gui.addFolder("Physics");
  physicsFolder.add(world.gravity, "x", -10.0, 10.0, 0.1);
  physicsFolder.add(world.gravity, "y", -10.0, 10.0, 0.1);
  physicsFolder.add(world.gravity, "z", -10.0, 10.0, 0.1);
  physicsFolder.open();

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10, 0.01);
  cameraFolder.add(camera.position, "y", -10, 10, 0.01);
  cameraFolder.add(camera.position, "z", -10, 10, 0.01);
}
addGui();
animate();
