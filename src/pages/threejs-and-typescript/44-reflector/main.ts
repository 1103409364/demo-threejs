import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  AnimationMixer,
  AnimationAction,
  Clock,
  // SpotLight,
  PlaneGeometry,
  Mesh,
  MeshPhongMaterial,
  // PCFSoftShadowMap,
  // BasicShadowMap,
  // PCFShadowMap,
  VSMShadowMap,
  PointLight,
  TextureLoader,
  BoxHelper,
  BoxGeometry,
  MeshBasicMaterial,
  Group,
  PlaneBufferGeometry,
  Color,
  // CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { Reflector } from "three/examples/jsm/objects/Reflector";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";

import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light1 = new PointLight();
light1.position.set(2.5, 2.5, 2.5);
light1.castShadow = true;
scene.add(light1);

const light2 = new PointLight();
light2.position.set(-2.5, 2.5, 2.5);
light2.castShadow = true;
scene.add(light2);

// const helper = new CameraHelper(light1.shadow.camera);
// scene.add(helper);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
app?.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.target.set(0, 1, 0);

const sceneMeshes: Mesh[] = [];
let boxHelper: BoxHelper;

const dragControls = new DragControls(sceneMeshes, camera, renderer.domElement);
dragControls.addEventListener("hoveron", function () {
  boxHelper.visible = true;
  orbitControls.enabled = false;
});
dragControls.addEventListener("hoveroff", function () {
  boxHelper.visible = false;
  orbitControls.enabled = true;
});
dragControls.addEventListener("drag", function (event) {
  event.object.position.y = 0;
});
dragControls.addEventListener("dragstart", function () {
  boxHelper.visible = true;
  orbitControls.enabled = false;
});
dragControls.addEventListener("dragend", function () {
  boxHelper.visible = false;
  orbitControls.enabled = true;
});

const planeGeometry = new PlaneGeometry(25, 25);
const texture = new TextureLoader().load(getImg("grid"));
const plane: Mesh = new Mesh(planeGeometry, new MeshPhongMaterial({ map: texture }));
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

let mixer: AnimationMixer;
let modelReady = false;
const animationActions: AnimationAction[] = [];
let activeAction: AnimationAction;
let lastAction: AnimationAction;
const gltfLoader = new GLTFLoader();
let modelGroup: Group;
let modelDragBox: Mesh;

gltfLoader.load(
  "/assets/models/vanguard_t_choonyung.glb",
  (gltf) => {
    // gltf.scene.scale.set(0.001, 0.001, 0.001);
    gltf.scene.traverse((node) => {
      if (node instanceof Group) {
        modelGroup = node;
      }
      if ((<Mesh>node).isMesh) {
        node.castShadow = true; // 是否投射阴影
        // node.receiveShadow = true; // 是否接收阴影 开启产生黑条纹
        node.frustumCulled = false;
        // (node as Mesh).geometry.computeVertexNormals();
      }
    });

    mixer = new AnimationMixer(gltf.scene);

    const animationAction = mixer.clipAction(gltf.animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];

    mixer = new AnimationMixer(gltf.scene);
    // mixer.clipAction(gltf.animations[0]).play(); // 动作幅度变小

    modelDragBox = new Mesh(
      new BoxGeometry(0.5, 1.3, 0.5),
      new MeshBasicMaterial({ transparent: true, opacity: 0 }),
    );
    modelDragBox.geometry.translate(0, 0.65, 0);
    scene.add(modelDragBox);
    sceneMeshes.push(modelDragBox);

    boxHelper = new BoxHelper(modelDragBox, 0xffff00);
    boxHelper.visible = false;
    scene.add(boxHelper);

    scene.add(gltf.scene);

    //add an animation from another file
    gltfLoader.load(
      "/assets/models/hip_hop_dancing.glb",
      (gltf) => {
        console.log("loaded hip_hop_dancing");
        const animationAction = mixer.clipAction(gltf.animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "hip_hop_dancing");
        modelReady = true;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      },
    );
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  },
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const mirrorBack1: Reflector = new Reflector(new PlaneBufferGeometry(2, 2), {
  color: new Color(0x7f7f7f),
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
});

mirrorBack1.position.y = 1;
mirrorBack1.position.z = -1;
scene.add(mirrorBack1);

const mirrorBack2: Reflector = new Reflector(new PlaneBufferGeometry(2, 2), {
  color: new Color(0x7f7f7f),
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
});

mirrorBack2.position.y = 1;
mirrorBack2.position.z = -2;
scene.add(mirrorBack2);

const mirrorFront1: Reflector = new Reflector(new PlaneBufferGeometry(2, 2), {
  color: new Color(0x7f7f7f),
  //clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
});
mirrorFront1.position.y = 1;
mirrorFront1.position.z = 1;
mirrorFront1.rotateY(Math.PI);
scene.add(mirrorFront1);

const mirrorFront2: Reflector = new Reflector(new PlaneBufferGeometry(2, 2), {
  color: new Color(0x7f7f7f),
  //clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
});
mirrorFront2.position.y = 1;
mirrorFront2.position.z = 2;
mirrorFront2.rotateY(Math.PI);
scene.add(mirrorFront2);

const stats = new Stats();
document.body.appendChild(stats.dom);

const animations = {
  default() {
    setAction(animationActions[0]);
  },
  hip_hop_dancing() {
    setAction(animationActions[1]);
  },
  break_dance_freeze() {
    setAction(animationActions[2]);
  },
  flair() {
    setAction(animationActions[3]);
  },
};

const setAction = (toAction: AnimationAction) => {
  if (toAction != activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    //lastAction.stop()
    lastAction.fadeOut(1);
    activeAction.reset();
    activeAction.fadeIn(1);
    activeAction.play();
  }
};

const gui = new GUI();
const animationsFolder = gui.addFolder("Animations");
animationsFolder.open();

const clock = new Clock();

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  if (modelReady) {
    mixer.update(clock.getDelta());
    modelGroup.position.copy(modelDragBox.position);
    boxHelper.update();
  }
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
