/* empty css              */import{S as y,A as H,X as E,a2 as F,P as W,W as b,a3 as v,i as G,a as h,r as z,K as p,M as L,U as j,k as T,q,p as R}from"./three.module-d5fa3ebf.js";import{O as A}from"./OrbitControls-5742bab2.js";import{S as I}from"./Stats-ef6ecf20.js";import{G as U}from"./lil-gui.esm-fc0b5e43.js";import{g as D}from"./index-539a094b.js";const w=document.querySelector("#app"),n=new y;n.add(new H(5));const e=new E;e.castShadow=!0;e.shadow.mapSize.width=512;e.shadow.mapSize.height=512;e.shadow.camera.near=.5;e.shadow.camera.far=100;n.add(e);const C=new F(e.shadow.camera);n.add(C);const r=new W(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.z=7;const s=new b;s.setSize(window.innerWidth,window.innerHeight);s.shadowMap.enabled=!0;s.shadowMap.type=v;w==null||w.appendChild(s.domElement);new A(r,s.domElement);const O=new G(100,20),u=new h(O,new z);u.rotateX(-Math.PI/2);u.position.y=-1.75;u.receiveShadow=!0;n.add(u);const m=[new p,new p,new p,new p,new p],t=[new L,new j,new z,new T({}),new q],a=[new h(m[0],t[0]),new h(m[1],t[1]),new h(m[2],t[2]),new h(m[3],t[3]),new h(m[4],t[4])],c=new R().load(D("grid"));t[0].map=c;t[1].map=c;t[2].map=c;t[3].map=c;t[4].map=c;a[0].position.x=-8;a[1].position.x=-4;a[2].position.x=0;a[3].position.x=4;a[4].position.x=8;a[0].castShadow=!0;a[1].castShadow=!0;a[2].castShadow=!0;a[3].castShadow=!0;a[4].castShadow=!0;a[0].receiveShadow=!0;a[1].receiveShadow=!0;a[2].receiveShadow=!0;a[3].receiveShadow=!0;a[4].receiveShadow=!0;n.add(a[0]);n.add(a[1]);n.add(a[2]);n.add(a[3]);n.add(a[4]);window.addEventListener("resize",k,!1);const X=B();K();M();P();function P(){requestAnimationFrame(P),C.update(),X.update(),a.forEach(i=>{i.rotation.y+=.01}),M()}function M(){s.render(n,r)}function k(){r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),s.setSize(window.innerWidth,window.innerHeight),M()}function B(){const i=new I;return w==null||w.appendChild(i.dom),i}function K(){const i=document.querySelector("#gui");if(!i)return;const l=new U({container:i}),d={color:e.color.getHex(),mapsEnabled:!0,shadowMapSizeWidth:512,shadowMapSizeHeight:512},f=l.addFolder("THREE.Light");f.addColor(d,"color").onChange(()=>{e.color.setHex(Number(d.color.toString().replace("#","0x")))}),f.add(e,"intensity",0,1,.01);const o=l.addFolder("THREE.DirectionalLight");o.add(e.shadow.camera,"left",-10,-1,.1).onChange(()=>e.shadow.camera.updateProjectionMatrix()),o.add(e.shadow.camera,"right",1,10,.1).onChange(()=>e.shadow.camera.updateProjectionMatrix()),o.add(e.shadow.camera,"top",1,10,.1).onChange(()=>e.shadow.camera.updateProjectionMatrix()),o.add(e.shadow.camera,"bottom",-10,-1,.1).onChange(()=>e.shadow.camera.updateProjectionMatrix()),o.add(e.shadow.camera,"near",.1,100).onChange(()=>e.shadow.camera.updateProjectionMatrix()),o.add(e.shadow.camera,"far",.1,100).onChange(()=>e.shadow.camera.updateProjectionMatrix()),o.add(d,"shadowMapSizeWidth",[256,512,1024,2048,4096]).onChange(()=>x()),o.add(d,"shadowMapSizeHeight",[256,512,1024,2048,4096]).onChange(()=>x()),o.add(e.position,"x",-50,50,.01),o.add(e.position,"y",-50,50,.01),o.add(e.position,"z",-50,50,.01),o.open();function x(){e.shadow.mapSize.width=d.shadowMapSizeWidth,e.shadow.mapSize.height=d.shadowMapSizeHeight,e.shadow.map=null}l.addFolder("Meshes").add(d,"mapsEnabled").onChange(()=>{t.forEach(g=>{d.mapsEnabled?g.map=c:g.map=null,g.needsUpdate=!0})});const S=l.addFolder("Camera");S.add(r.position,"x",-10,10,.01),S.add(r.position,"y",-10,10,.01),S.add(r.position,"z",-10,10,.01)}
