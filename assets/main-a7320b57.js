/* empty css              */import{S as w,A as l,h as u,P as p,W as f,M as h}from"./three.module-d5fa3ebf.js";import{O as g}from"./OrbitControls-5742bab2.js";import{O as S}from"./OBJLoader-84dac0c0.js";import{S as W}from"./Stats-ef6ecf20.js";import{G as z}from"./lil-gui.esm-fc0b5e43.js";const o=document.querySelector("#app"),i=new w;i.add(new l(5));const s=new u;s.position.set(2.5,7.5,15);i.add(s);const n=new p(75,window.innerWidth/window.innerHeight,.1,1e3);n.position.z=3;const t=new f;t.setSize(window.innerWidth,window.innerHeight);o==null||o.appendChild(t.domElement);const c=new g(n,t.domElement);c.enableDamping=!0;const C=new h({color:65280,wireframe:!0}),H=new S;H.load("/assets/models/monkey.obj",e=>{e.traverse(r=>{r.isMesh&&(r.material=C)}),i.add(e)},e=>{console.log(e.loaded/e.total*100+"% loaded")},e=>{console.log(e)});window.addEventListener("resize",M,!1);const L=b();y();d();m();function m(){requestAnimationFrame(m),c.update(),L.update(),d()}function d(){t.render(i,n)}function M(){n.aspect=window.innerWidth/window.innerHeight,n.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),d()}function b(){const e=new W;return o==null||o.appendChild(e.dom),e}function y(){const e=document.querySelector("#gui");if(!e)return;const a=new z({container:e}).addFolder("Camera");a.add(n.position,"x",-10,10,.01),a.add(n.position,"y",-10,10,.01),a.add(n.position,"z",-10,10,.01)}