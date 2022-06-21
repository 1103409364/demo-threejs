import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  AnimationMixer,
  AnimationAction,
  Object3D,
  Clock,
  SpotLight,
  PlaneGeometry,
  Mesh,
  MeshPhongMaterial,
  PCFSoftShadowMap,
  // CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light1 = new SpotLight(0xffffff, 2);
light1.position.set(0, 5, 0);
light1.castShadow = true;
light1.shadow.mapSize.width = 1000; // 增加阴影贴图面积可以提高阴影质量
light1.shadow.mapSize.height = 1000;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;
scene.add(light1);
const light2 = new SpotLight();
light2.position.set(2, 2, 2);
scene.add(light2);

// const helper = new CameraHelper(light1.shadow.camera);
// scene.add(helper);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1.4, 1.0);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
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
const fbxLoader: FBXLoader = new FBXLoader();

fbxLoader.load(
  "/assets/models/vanguard_t_choonyung.fbx",
  (object) => {
    // console.log(animationsFolder); // 这里能访问到 animationsFolder ？
    object.traverse(function (child) {
      if ((<Mesh>child).isMesh) {
        child.castShadow = true; // 是否投射阴影
        child.receiveShadow = true;
      }
    });
    object.scale.set(0.01, 0.01, 0.01);
    mixer = new AnimationMixer(object); // 创建动画混合器

    const animationAction = mixer.clipAction((object as Object3D).animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];
    scene.add(object);

    //add an animation from another file
    fbxLoader.load(
      "/assets/models/vanguard_hip_hop_dancing.fbx",
      (object) => {
        console.log("loaded vanguard_hip_hop_dancing");

        const animationAction = mixer.clipAction((object as Object3D).animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "hip_hop");

        //add an animation from another file
        fbxLoader.load(
          "/assets/models/break_dance_freeze.fbx",
          (object) => {
            console.log("loaded break_dance_freeze");
            const animationAction = mixer.clipAction((object as Object3D).animations[0]);
            animationActions.push(animationAction);
            animationsFolder.add(animations, "break_dance_freeze");

            //add an animation from another file
            fbxLoader.load(
              "/assets/models/flair.fbx",
              (object) => {
                console.log("loaded flair");
                (object as Object3D).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                //console.dir((object as Object3D).animations[0])
                const animationAction = mixer.clipAction((object as Object3D).animations[0]);
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
  hip_hop() {
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
