/* empty css              */import{S as W,A as v,h as b,P as C,W as F,a3 as H,i as I,p as E,a as O,r as R,aZ as q,a_ as x}from"./three.module-d5fa3ebf.js";import{O as D}from"./OrbitControls-5742bab2.js";import{G as T}from"./GLTFLoader-3c7b0d3d.js";import{S as j}from"./Stats-ef6ecf20.js";import{G as U}from"./lil-gui.esm-fc0b5e43.js";import{g as X}from"./index-539a094b.js";const h=document.querySelector("#app"),l=new W;l.add(new v(5));const g=new b;g.position.set(2.5,2.5,2.5);g.castShadow=!0;l.add(g);const u=new b;u.position.set(-2.5,2.5,2.5);u.castShadow=!0;l.add(u);const r=new C(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(.8,1.4,1);const i=new F;i.setSize(window.innerWidth,window.innerHeight);i.shadowMap.enabled=!0;i.shadowMap.type=H;h==null||h.appendChild(i.domElement);const f=new D(r,i.domElement);f.enableDamping=!0;f.target.set(0,1,0);const Z=new I(25,25),B=new E().load(X("grid")),_=new O(Z,new R({map:B}));_.rotateX(-Math.PI/2);_.receiveShadow=!0;l.add(_);let d,S=!1;const n=[];let t,A;const m=new T;m.load("/assets/models/vanguard_t_choonyung.glb",e=>{e.scene.traverse(o=>{o.isMesh&&(o.castShadow=!0)}),d=new q(e.scene);const P=d.clipAction(e.animations[0]);n.push(P),c.add(p,"default"),t=n[0],l.add(e.scene),m.load("/assets/models/hip_hop_dancing.glb",o=>{console.log("loaded hip_hop_dancing");const k=d.clipAction(o.animations[0]);n.push(k),c.add(p,"hip_hop_dancing"),m.load("/assets/models/break_dance_freeze.glb",s=>{console.log("loaded break_dance_freeze");const G=d.clipAction(s.animations[0]);n.push(G),c.add(p,"break_dance_freeze"),m.load("/assets/models/flair.glb",a=>{console.log("loaded flair"),a.animations[0].tracks.shift();const L=d.clipAction(a.animations[0]);n.push(L),c.add(p,"flair"),S=!0},a=>{console.log(a.loaded/a.total*100+"% loaded")},a=>{console.log(a)})},s=>{console.log(s.loaded/s.total*100+"% loaded")},s=>{console.log(s)})},o=>{console.log(o.loaded/o.total*100+"% loaded")},o=>{console.log(o)})},e=>{console.log(e.loaded/e.total*100+"% loaded")},e=>{console.log(e)});window.addEventListener("resize",J,!1);function J(){r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight),z()}const M=new j;document.body.appendChild(M.dom);const p={default(){w(n[0])},hip_hop_dancing(){w(n[1])},break_dance_freeze(){w(n[2])},flair(){w(n[3])}},w=e=>{e!=t&&(A=t,t=e,A.fadeOut(1),t.reset(),t.fadeIn(1),t.play())},K=new U,c=K.addFolder("Animations");c.open();const N=new x;function y(){requestAnimationFrame(y),f.update(),S&&d.update(N.getDelta()),z(),M.update()}function z(){i.render(l,r)}y();