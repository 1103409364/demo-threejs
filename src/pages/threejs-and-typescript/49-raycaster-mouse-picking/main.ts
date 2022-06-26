import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  SpotLight,
  sRGBEncoding,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Intersection,
  // CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// import { GUI } from "lil-gui"; // dat.GUI 的替代方案
// import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new SpotLight();
light.position.set(12.5, 12.5, 12.5);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15);

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.outputEncoding = sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
app?.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const pickableObjects: Mesh[] = [];
let intersectedObject: Object3D | null;
const originalMaterials: { [id: string]: Material | Material[] } = {};
const highlightedMaterial = new MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});

const loader = new GLTFLoader();
loader.load(
  "/assets/models/simplescene.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if ((child as Mesh).isMesh) {
        const m = child as Mesh;
        //the sphere and plane will not be mouse picked. THe plane will receive shadows while everything else casts shadows.
        switch (m.name) {
          case "Plane":
            m.receiveShadow = true;
            break;
          case "Sphere":
            m.castShadow = true;
            break;
          default:
            m.castShadow = true;
            pickableObjects.push(m);
            //store reference to original materials for later
            originalMaterials[m.name] = (m as Mesh).material;
        }
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
let intersects: Intersection[];

document.addEventListener("mousemove", onDocumentMouseMove, false);
function onDocumentMouseMove(event: MouseEvent) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  );
  intersects = raycaster.intersectObjects(pickableObjects, false);

  if (intersects.length > 0) {
    intersectedObject = intersects[0].object;
  } else {
    intersectedObject = null;
  }
  pickableObjects.forEach((o: THREE.Mesh, i) => {
    if (intersectedObject && intersectedObject.name === o.name) {
      pickableObjects[i].material = highlightedMaterial;
    } else {
      pickableObjects[i].material = originalMaterials[o.name];
    }
  });
}

const stats = new Stats();
document.querySelector("#gui")?.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
