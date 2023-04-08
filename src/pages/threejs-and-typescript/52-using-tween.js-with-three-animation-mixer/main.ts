import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Mesh,
  Raycaster,
  SpotLight,
  Clock,
  AnimationAction,
  AnimationMixer,
  LoopOnce,
  Matrix4,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
  Quaternion,
  ACESFilmicToneMapping,
  sRGBEncoding,
  FrontSide,
  MeshNormalMaterial,
  AmbientLight,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "stats.ts";
import { GUI } from "lil-gui"; // dat.GUI 的替代方案
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "three/examples/jsm/libs/tween.module";
import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");
const progressBar = document.querySelector<HTMLProgressElement>("#progressBar");
const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new AmbientLight(undefined, 0.1); // 环境光
// light.position.set(10, 10, 10);
scene.add(light);

const light1 = new SpotLight(); // 聚光灯
light1.position.set(2.5, 5, 2.5);
light1.angle = Math.PI / 8;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20;
scene.add(light1);

const light2 = new SpotLight();
light2.position.set(-2.5, 5, 2.5);
light2.angle = Math.PI / 8;
light2.penumbra = 0.5;
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20;
scene.add(light2);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.physicallyCorrectLights = true;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.outputEncoding = sRGBEncoding;
renderer.shadowMap.enabled = true; // 阴影贴图
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0, 1.1, 0);

const sceneMeshes: Mesh[] = [];

const planeGeometry = new PlaneGeometry(25, 25);
const texture = new TextureLoader().load(getImg("grid"));
const plane = new Mesh(planeGeometry, new MeshPhongMaterial({ map: texture }));
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);
sceneMeshes.push(plane);

let mixer: AnimationMixer;
let modelReady = false;
let modelMesh: Object3D;
const animationActions: AnimationAction[] = [];
let activeAction: AnimationAction;
let lastAction: AnimationAction;

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/assets/models/Kachujin.glb",
  (gltf) => {
    gltf.scene.traverse((child) => {
      if ((<Mesh>child).isMesh) {
        const m = <Mesh>child;
        m.receiveShadow = true;
        m.castShadow = true;
        m.frustumCulled = false;
        m.geometry.computeVertexNormals();
        let mat;
        if ((mat = (child as Mesh).material as MeshNormalMaterial)) {
          //(<Mesh>child).material = material
          // mat.metalness = 0
          // mat.roughness = 0
          mat.transparent = false;
          mat.side = FrontSide;
        }
        console.log(m.material);
      }
    });

    mixer = new AnimationMixer(gltf.scene);

    const animationAction = mixer.clipAction(gltf.animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];

    scene.add(gltf.scene);
    modelMesh = gltf.scene;

    //add an animation from another file
    gltfLoader.load(
      "/assets/models/Kachujin@kick.glb",
      (gltf) => {
        console.log("loaded kick");
        const animationAction = mixer.clipAction(gltf.animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "kick");

        //add an animation from another file
        gltfLoader.load(
          "/assets/models/Kachujin@walking.glb",
          (gltf) => {
            console.log("loaded walking");
            gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
            const animationAction = mixer.clipAction(gltf.animations[0]);
            animationActions.push(animationAction);
            animationsFolder.add(animations, "walking");
            progressBar && (progressBar.style.display = "none");
            modelReady = true;
          },
          (xhr) => {
            if (xhr.lengthComputable) {
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              progressBar && (progressBar.value = percentComplete);
              progressBar && (progressBar.style.display = "block");
            }
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.log(error);
          },
        );
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          progressBar && (progressBar.value = percentComplete);
          progressBar && (progressBar.style.display = "block");
        }
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      },
    );
  },
  (xhr) => {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      progressBar && (progressBar.value = percentComplete);
      progressBar && (progressBar.style.display = "block");
    }
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

const raycaster = new Raycaster();
const targetQuaternion = new Quaternion(); // 四元数

renderer.domElement.addEventListener("dblclick", onDoubleClick, false);
function onDoubleClick(event: MouseEvent) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };
  raycaster.setFromCamera(new Vector2(mouse.x, mouse.y), camera);
  const intersects = raycaster.intersectObjects(sceneMeshes, false);
  if (intersects.length > 0) {
    const p = intersects[0].point;
    const distance = modelMesh.position.distanceTo(p);
    const rotationMatrix = new Matrix4();
    rotationMatrix.lookAt(p, modelMesh.position, modelMesh.up); // 模型方向
    targetQuaternion.setFromRotationMatrix(rotationMatrix); // 转向相关
    setAction(animationActions[2], true); // 行走
    TWEEN.removeAll();
    new TWEEN.Tween(modelMesh.position)
      .to(
        {
          x: p.x,
          y: p.y,
          z: p.z,
        },
        (1000 / 1.2) * distance,
      ) //walks 1.2 meters a second * the distance
      .onUpdate(() => {
        controls.target.set(modelMesh.position.x, modelMesh.position.y + 1, modelMesh.position.z); // 移动画面
        light1.target = modelMesh; // 光源跟随
        light2.target = modelMesh;
      })
      .start()
      .onComplete(() => setAction(animationActions[1], false)); //攻击
  }
}
const stats = new Stats();
app?.appendChild(stats.dom);

const animations = {
  default() {
    setAction(animationActions[0], true);
  },
  kick() {
    setAction(animationActions[1], true);
  },
  walking() {
    setAction(animationActions[2], true);
  },
};

const setAction = (toAction: AnimationAction, loop: boolean) => {
  if (toAction != activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    //lastAction.stop()
    lastAction.fadeOut(0.1);
    activeAction.reset();
    activeAction.fadeIn(0.1);
    activeAction.play();
    if (!loop) {
      activeAction.clampWhenFinished = true; // 保留动作最后一帧
      activeAction.loop = LoopOnce; // 一次
    }
  }
};

const gui = new GUI();
const animationsFolder = gui.addFolder("Animations");
animationsFolder.open();

const clock = new Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  const delta = clock.getDelta();
  if (modelReady) {
    mixer.update(delta);
    if (!modelMesh.quaternion.equals(targetQuaternion)) {
      modelMesh.quaternion.rotateTowards(targetQuaternion, delta * 10); // 转向
    }
  }
  TWEEN.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
