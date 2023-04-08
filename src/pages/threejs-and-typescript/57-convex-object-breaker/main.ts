import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Mesh,
  Clock,
  Object3D,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from "three";
import { getImg } from "@/utils";
import * as CANNON from "cannon-es";
// import CannonDebugRenderer from "@/utils/cannonDebugRenderer";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import CannonUtils from "@/utils/cannonUtils";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { ConvexObjectBreaker } from "three/examples/jsm/misc/ConvexObjectBreaker";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light1 = new DirectionalLight();
light1.position.set(20, 20, 20);
scene.add(light1);

const light2 = new DirectionalLight();
light2.position.set(-20, 20, 20);
scene.add(light2);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 4);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const menuPanel = document.getElementById("menuPanel") as HTMLDivElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;
startButton.addEventListener(
  "click",
  function () {
    controls.lock();
  },
  false,
);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.addEventListener("lock", () => (menuPanel.style.display = "none"));
controls.addEventListener("unlock", () => (menuPanel.style.display = "block"));

camera.position.y = 1;
camera.position.z = 2;

const onKeyDown = function (event: KeyboardEvent) {
  switch (event.key) {
    case "w":
      controls.moveForward(0.25);
      break;
    case "a":
      controls.moveRight(-0.25);
      break;
    case "s":
      controls.moveForward(-0.25);
      break;
    case "d":
      controls.moveRight(0.25);
      break;
  }
};
document.addEventListener("keydown", onKeyDown, false);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
//;(world.solver as CANNON.GSSolver).iterations = 20
//world.allowSleep = true

const material = new MeshStandardMaterial({
  //color: 0xa2ffb8,
  color: 0xffffff,
  //reflectivity: 0.15,
  metalness: 1.0,
  roughness: 0.25,
  transparent: true,
  opacity: 0.75,
  //transmission: 1.0,
  side: DoubleSide,
  //clearcoat: 1.0,
  //clearcoatRoughness: 0.35,
});

const pmremGenerator = new PMREMGenerator(renderer);
const envTexture = new TextureLoader().load(getImg("pano-equirectangular", "jpg"), () => {
  material.envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
});

const meshes: { [id: string]: Mesh } = {};
const bodies: { [id: string]: CANNON.Body } = {};
let meshId = 0;

const groundMirror = new Reflector(new PlaneGeometry(1024, 1024), {
  color: new Color(0x222222),
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
});
groundMirror.position.y = -0.05;
groundMirror.rotateX(-Math.PI / 2);
scene.add(groundMirror);

const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

const convexObjectBreaker = new ConvexObjectBreaker();

for (let i = 0; i < 20; i++) {
  const size = {
    x: Math.random() * 4 + 2,
    y: Math.random() * 10 + 5,
    z: Math.random() * 4 + 2,
  };
  const geo: BoxGeometry = new BoxGeometry(size.x, size.y, size.z);
  const cube = new Mesh(geo, material);

  cube.position.x = Math.random() * 50 - 25;
  cube.position.y = size.y / 2 + 0.1;
  cube.position.z = Math.random() * 50 - 25;

  scene.add(cube);
  meshes[meshId] = cube;
  convexObjectBreaker.prepareBreakableObject(meshes[meshId], 1, new Vector3(), new Vector3(), true);

  const cubeShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
  const cubeBody = new CANNON.Body({ mass: 1 });
  (cubeBody as any).userData = { splitCount: 0, id: meshId };
  cubeBody.addShape(cubeShape);
  cubeBody.position.x = cube.position.x;
  cubeBody.position.y = cube.position.y;
  cubeBody.position.z = cube.position.z;

  world.addBody(cubeBody);
  bodies[meshId] = cubeBody;

  meshId++;
}

const bullets: { [id: string]: Mesh } = {};
const bulletBodies: { [id: string]: CANNON.Body } = {};
let bulletId = 0;

const bulletMaterial = new MeshPhysicalMaterial({
  map: new TextureLoader().load(getImg("marble")),
  clearcoat: 1.0,
  clearcoatRoughness: 0,
  clearcoatMap: null,
  clearcoatRoughnessMap: null,
  metalness: 0.4,
  roughness: 0.3,
  color: "white",
});
document.addEventListener("click", onClick, false);
function onClick() {
  if (controls.isLocked) {
    const bullet = new Mesh(new SphereGeometry(1, 16, 16), bulletMaterial);
    bullet.position.copy(camera.position);
    scene.add(bullet);
    bullets[bulletId] = bullet;

    const bulletShape = new CANNON.Sphere(1);
    const bulletBody = new CANNON.Body({ mass: 1 });
    bulletBody.addShape(bulletShape);
    bulletBody.position.x = camera.position.x;
    bulletBody.position.y = camera.position.y;
    bulletBody.position.z = camera.position.z;

    world.addBody(bulletBody);
    bulletBodies[bulletId] = bulletBody;

    bulletBody.addEventListener("collide", (e: any) => {
      if (e.body.userData) {
        if (e.body.userData.splitCount < 2) {
          splitObject(e.body.userData, e.contact);
        }
      }
    });
    const v = new Vector3(0, 0, -1);
    v.applyQuaternion(camera.quaternion);
    v.multiplyScalar(50);
    bulletBody.velocity.set(v.x, v.y, v.z);
    bulletBody.angularVelocity.set(
      Math.random() * 10 + 1,
      Math.random() * 10 + 1,
      Math.random() * 10 + 1,
    );

    bulletId++;

    //remove old bullets
    while (Object.keys(bullets).length > 5) {
      scene.remove(bullets[bulletId - 6]);
      delete bullets[bulletId - 6];
      world.removeBody(bulletBodies[bulletId - 6]);
      delete bulletBodies[bulletId - 6];
    }
  }
}

function splitObject(userData: { id: any; splitCount: number }, contact: CANNON.ContactEquation) {
  const contactId = userData.id;
  if (meshes[contactId]) {
    const poi = bodies[contactId].pointToLocalFrame(
      (contact.bj.position as CANNON.Vec3).vadd(contact.rj),
    );
    const n = new Vector3(contact.ni.x, contact.ni.y, contact.ni.z).negate();
    const shards = convexObjectBreaker.subdivideByImpact(
      meshes[contactId],
      new Vector3(poi.x, poi.y, poi.z),
      n,
      1,
      0,
    );

    scene.remove(meshes[contactId]);
    delete meshes[contactId];
    world.removeBody(bodies[contactId]);
    delete bodies[contactId];

    shards.forEach((d: Object3D) => {
      const nextId = meshId++;

      scene.add(d);
      meshes[nextId] = d as Mesh;
      (d as Mesh).geometry.scale(0.99, 0.99, 0.99);
      const shape = gemoetryToShape((d as Mesh).geometry);

      const body = new CANNON.Body({ mass: 1 });
      body.addShape(shape);
      (body as any).userData = {
        splitCount: userData.splitCount + 1,
        id: nextId,
      };
      body.position.x = d.position.x;
      body.position.y = d.position.y;
      body.position.z = d.position.z;
      body.quaternion.x = d.quaternion.x;
      body.quaternion.y = d.quaternion.y;
      body.quaternion.z = d.quaternion.z;
      body.quaternion.w = d.quaternion.w;
      world.addBody(body);
      bodies[nextId] = body;
    });
  }
}

function gemoetryToShape(geometry: BufferGeometry) {
  const position = (geometry.attributes.position as THREE.InterleavedBufferAttribute).array;
  const points: Vector3[] = [];
  for (let i = 0; i < position.length; i += 3) {
    points.push(new Vector3(position[i], position[i + 1], position[i + 2]));
  }
  const convexHull = new ConvexGeometry(points);
  const shape = CannonUtils.CreateConvexPolyhedron(convexHull);
  return shape;
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

// const options = {
//   side: {
//     FrontSide: FrontSide,
//     BackSide: BackSide,
//     DoubleSide: DoubleSide,
//   },
// };

const clock = new Clock();
let delta;

// const cannonDebugRenderer = new CannonDebugRenderer(scene, world);

function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta();
  if (delta > 0.1) delta = 0.1;
  world.step(delta);

  Object.keys(meshes).forEach((m) => {
    meshes[m].position.set(bodies[m].position.x, bodies[m].position.y, bodies[m].position.z);
    meshes[m].quaternion.set(
      bodies[m].quaternion.x,
      bodies[m].quaternion.y,
      bodies[m].quaternion.z,
      bodies[m].quaternion.w,
    );
  });

  Object.keys(bullets).forEach((b) => {
    bullets[b].position.set(
      bulletBodies[b].position.x,
      bulletBodies[b].position.y,
      bulletBodies[b].position.z,
    );
    bullets[b].quaternion.set(
      bulletBodies[b].quaternion.x,
      bulletBodies[b].quaternion.y,
      bulletBodies[b].quaternion.z,
      bulletBodies[b].quaternion.w,
    );
  });

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
