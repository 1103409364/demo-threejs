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
  DirectionalLight,
  // BasicShadowMap,
  // PCFShadowMap,
  VSMShadowMap,
  // CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new DirectionalLight(0xffffff, 8);
light.castShadow = true;
light.shadow.mapSize.width = 512; // 增加阴影贴图面积可以提高阴影质量
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.position.set(1, 2, 1);
scene.add(light);

// const light1 = new SpotLight(0xffffff, 2);
// light1.position.set(0, 5, 0);
// light1.castShadow = true;
// light1.shadow.mapSize.width = 1000; // 增加阴影贴图面积可以提高阴影质量
// light1.shadow.mapSize.height = 1000;
// light1.shadow.camera.near = 0.5;
// light1.shadow.camera.far = 500;
// scene.add(light1);
// const light2 = new SpotLight();
// light2.position.set(2, 2, 2);
// scene.add(light2);

// const helper = new CameraHelper(light1.shadow.camera);
// scene.add(helper);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1.4, 1.0);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = PCFSoftShadowMap;
// renderer.shadowMap.type = BasicShadowMap; // 质量低
// renderer.shadowMap.type = PCFShadowMap;
renderer.shadowMap.type = VSMShadowMap; // 平面有横条
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

const planeGeometry = new PlaneGeometry(20, 20);
const plane = new Mesh(planeGeometry, new MeshPhongMaterial());
plane.rotateX(-Math.PI / 2);
plane.position.y = 0;
plane.receiveShadow = true; // 接收阴影的平面
scene.add(plane);

let mixer: AnimationMixer;
let modelReady = false;
const animationActions: AnimationAction[] = [];
let activeAction: AnimationAction;
let lastAction: AnimationAction;
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  "/assets/models/vanguard_t_choonyung.glb",
  (gltf) => {
    // gltf.scene.scale.set(0.001, 0.001, 0.001);
    gltf.scene.traverse((node) => {
      if ((<Mesh>node).isMesh) {
        node.castShadow = true; // 是否投射阴影
        node.receiveShadow = true; // 是否接收阴影
      }
    });

    mixer = new AnimationMixer(gltf.scene);

    const animationAction = mixer.clipAction(gltf.animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];

    scene.add(gltf.scene);

    //add an animation from another file
    gltfLoader.load(
      "/assets/models/hip_hop_dancing.glb",
      (gltf) => {
        console.log("loaded hip_hop_dancing");
        const animationAction = mixer.clipAction(gltf.animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "hip_hop_dancing");

        //add an animation from another file
        gltfLoader.load(
          "/assets/models/break_dance_freeze.glb",
          (gltf) => {
            console.log("loaded break_dance_freeze");
            const animationAction = mixer.clipAction(gltf.animations[0]);
            animationActions.push(animationAction);
            animationsFolder.add(animations, "break_dance_freeze");

            //add an animation from another file
            gltfLoader.load(
              "/assets/models/flair.glb",
              (gltf) => {
                console.log("loaded flair");
                gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                const animationAction = mixer.clipAction(gltf.animations[0]);
                animationActions.push(animationAction);
                animationsFolder.add(animations, "flair");

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
  controls.update();
  if (modelReady) mixer.update(clock.getDelta());
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
