/* empty css              */import{S as Scene,A as AxesHelper,h as PointLight,P as PerspectiveCamera,W as WebGLRenderer,B as BoxGeometry,b as SphereGeometry,I as IcosahedronGeometry,i as PlaneGeometry,j as TorusKnotGeometry,p as TextureLoader,N as NearestFilter,q as MeshToonMaterial,a as Mesh,F as FrontSide,n as BackSide,D as DoubleSide}from"./three.module-d5fa3ebf.js";import{O as OrbitControls}from"./OrbitControls-5742bab2.js";import{S as Stats}from"./Stats-ef6ecf20.js";import{G as GUI}from"./lil-gui.esm-fc0b5e43.js";import{g as getImg}from"./index-539a094b.js";const app=document.querySelector("#app"),scene=new Scene;scene.add(new AxesHelper(5));const light=new PointLight(16777215,2);light.position.set(10,10,10);scene.add(light);const camera=new PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);camera.position.z=4;const renderer=new WebGLRenderer;renderer.setSize(window.innerWidth,window.innerHeight);app==null||app.appendChild(renderer.domElement);const controls=new OrbitControls(camera,renderer.domElement),boxGeometry=new BoxGeometry,sphereGeometry=new SphereGeometry,icosahedronGeometry=new IcosahedronGeometry(1,0),planeGeometry=new PlaneGeometry,torusKnotGeometry=new TorusKnotGeometry,threeTone=new TextureLoader().load(getImg("threeTone","jpg"));threeTone.minFilter=NearestFilter;threeTone.magFilter=NearestFilter;const fourTone=new TextureLoader().load(getImg("fourTone","jpg"));fourTone.minFilter=NearestFilter;fourTone.magFilter=NearestFilter;const fiveTone=new TextureLoader().load(getImg("fiveTone","jpg"));fiveTone.minFilter=NearestFilter;fiveTone.magFilter=NearestFilter;const material=new MeshToonMaterial,cube=new Mesh(boxGeometry,material);cube.position.x=5;scene.add(cube);const sphere=new Mesh(sphereGeometry,material);sphere.position.x=3;scene.add(sphere);const icosahedron=new Mesh(icosahedronGeometry,material);icosahedron.position.x=0;scene.add(icosahedron);const plane=new Mesh(planeGeometry,material);plane.position.x=-2;scene.add(plane);const torusKnot=new Mesh(torusKnotGeometry,material);torusKnot.position.x=-5;scene.add(torusKnot);window.addEventListener("resize",onWindowResize,!1);const stats=addStats();addGui();render();animate();function animate(){requestAnimationFrame(animate),controls.update(),stats.update(),rotation(cube),rotation(icosahedron),rotation(plane),render()}function render(){renderer.render(scene,camera)}function rotation(e){e.rotation.x+=.01,e.rotation.y+=.01}function onWindowResize(){camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight),render()}function addStats(){const e=new Stats;return app==null||app.appendChild(e.dom),e}function addGui(){const container=document.querySelector("#gui");if(!container)return;const gui=new GUI({container}),options={side:{FrontSide,BackSide,DoubleSide},gradientMap:{Default:null,threeTone:"threeTone",fourTone:"fourTone",fiveTone:"fiveTone"}},data={lightColor:light.color.getHex(),color:material.color.getHex(),gradientMap:"threeTone"};material.gradientMap=threeTone;const lightFolder=gui.addFolder("THREE.Light");lightFolder.addColor(data,"lightColor").onChange(()=>{light.color.setHex(Number(data.lightColor.toString().replace("#","0x")))}),lightFolder.add(light,"intensity",0,4);const materialFolder=gui.addFolder("THREE.Material");materialFolder.add(material,"transparent").onChange(()=>material.needsUpdate=!0),materialFolder.add(material,"opacity",0,1,.01),materialFolder.add(material,"depthTest"),materialFolder.add(material,"depthWrite"),materialFolder.add(material,"alphaTest",0,1,.01).onChange(()=>updateMaterial()),materialFolder.add(material,"visible"),materialFolder.add(material,"side",options.side).onChange(()=>updateMaterial());const meshToonMaterialFolder=gui.addFolder("THREE.MeshToonMaterial");meshToonMaterialFolder.addColor(data,"color").onChange(()=>{material.color.setHex(Number(data.color.toString().replace("#","0x")))}),meshToonMaterialFolder.add(data,"gradientMap",options.gradientMap).onChange(()=>updateMaterial()),meshToonMaterialFolder.open();function updateMaterial(){material.side=material.side,material.gradientMap=eval(data.gradientMap),material.needsUpdate=!0}const cameraFolder=gui.addFolder("Camera");cameraFolder.add(camera.position,"x",-10,10,.01),cameraFolder.add(camera.position,"y",-10,10,.01),cameraFolder.add(camera.position,"z",-10,10,.01)}