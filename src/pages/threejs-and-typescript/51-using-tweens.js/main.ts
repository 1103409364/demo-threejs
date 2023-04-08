import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  sRGBEncoding,
  Mesh,
  Light,
  Raycaster,
  MeshStandardMaterial,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stats } from "stats.ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "three/examples/jsm/libs/tween.module";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new WebGLRenderer();
renderer.useLegacyLights = true; // 物理光照  In r150, physicallyCorrectLights was replaced with useLegacyLights https://threejs.org/docs/#api/en/renderers/WebGLRenderer.physicallyCorrectLights
renderer.shadowMap.enabled = true;
renderer.outputEncoding = sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const sceneMeshes: Mesh[] = [];

const loader = new GLTFLoader();
loader.load(
  "/assets/models/monkey_textured.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if ((child as Mesh).isMesh) {
        const m = child as Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
        (m.material as MeshStandardMaterial).flatShading = true;
        sceneMeshes.push(m);
      }
      if ((child as Light).isLight) {
        const l = child as Light;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    scene.add(gltf.scene);
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

const raycaster = new Raycaster();

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

    //controls.target.set(p.x, p.y, p.z)
    // 移动控件
    new TWEEN.Tween(controls.target)
      .to(
        {
          x: p.x,
          y: p.y,
          z: p.z,
        },
        500,
      )
      //.delay (1000)
      .easing(TWEEN.Easing.Cubic.Out)
      //.onUpdate(() => render())
      .start();
    // 水平方向
    new TWEEN.Tween(sceneMeshes[1].position)
      .to(
        {
          x: p.x,
          // y: p.y + 1,
          z: p.z,
        },
        500,
      )
      .start();
    // 垂直方向
    new TWEEN.Tween(sceneMeshes[1].position)
      .to(
        {
          // x: p.x,
          y: p.y + 3,
          // z: p.z,
        },
        250,
      )
      //.delay (1000)
      .easing(TWEEN.Easing.Cubic.Out)
      //.onUpdate(() => render())
      .start()
      .onComplete(() => {
        new TWEEN.Tween(sceneMeshes[1].position)
          .to(
            {
              // x: p.x,
              y: p.y + 1,
              // z: p.z,
            },
            250,
          )
          //.delay (250)
          .easing(TWEEN.Easing.Bounce.Out)
          //.onUpdate(() => render())
          .start();
      });
  }
}

const stats = new Stats();
app?.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  TWEEN.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
