import "@/style/index.scss";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Clock,
  Mesh,
  Object3D,
  sRGBEncoding,
  ArrowHelper,
  ConeGeometry,
  Light,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Raycaster,
  Vector3,
  Face,
  // CameraHelper,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { Stats } from "stats.ts";

// import { GUI } from "lil-gui"; // dat.GUI 的替代方案
// import { getImg } from "@/utils";

const app = document.querySelector<HTMLDivElement>("#app");

const scene = new Scene();
scene.add(new AxesHelper(5));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.outputEncoding = sRGBEncoding;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
app?.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// const material = new LineBasicMaterial({ color: 0xff0000 })
// const points = new Array()
// points.push( new Vector3( 0, 0, 0 ) )
// points.push( new Vector3( 0, 0, .25 ) )
// const geometry = new BufferGeometry().setFromPoints( points )
// const line = new Line( geometry, material )
// scene.add( line )

const arrowHelper = new ArrowHelper(new Vector3(), new Vector3(), 0.25, 0xffff00);
scene.add(arrowHelper);

const material = new MeshNormalMaterial();

// const boxGeometry = new BoxGeometry(0.2, 0.2, 0.2);
const coneGeometry = new ConeGeometry(0.05, 0.2, 8);

const raycaster = new Raycaster();
const sceneMeshes: Object3D[] = [];

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
    // sceneMeshes.push(gltf.scene)
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

renderer.domElement.addEventListener("dblclick", onDoubleClick, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event: MouseEvent) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };

  // console.log(mouse)

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sceneMeshes, false);

  if (intersects.length > 0) {
    // console.log(sceneMeshes.length + " " + intersects.length)
    // console.log(intersects[0])
    // console.log(intersects[0].object.userData.name + " " + intersects[0].distance + " ")
    // console.log((intersects[0].face as Face).normal)
    // line.position.set(0, 0, 0)
    // line.lookAt((intersects[0].face as Face).normal)
    // line.position.copy(intersects[0].point)

    const n = new Vector3();
    n.copy((intersects[0].face as Face).normal);
    n.transformDirection(intersects[0].object.matrixWorld);

    arrowHelper.setDirection(n);
    arrowHelper.position.copy(intersects[0].point);
  }
}

function onDoubleClick(event: MouseEvent) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sceneMeshes, false);

  if (intersects.length > 0) {
    const n = new Vector3();
    n.copy((intersects[0].face as Face).normal);
    n.transformDirection(intersects[0].object.matrixWorld);

    // const cube = new Mesh(boxGeometry, material)
    const cube = new Mesh(coneGeometry, material);

    cube.lookAt(n);
    cube.rotateX(Math.PI / 2);
    cube.position.copy(intersects[0].point);
    cube.position.addScaledVector(n, 0.1);

    scene.add(cube);
    sceneMeshes.push(cube);
  }
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
