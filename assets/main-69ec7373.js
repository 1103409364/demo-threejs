/* empty css              */import{S as u,A as h,h as g,P as f,W as S,i as x,k as y,p as c,a as P}from"./three.module-d5fa3ebf.js";import{O as W}from"./OrbitControls-5742bab2.js";import{S as z}from"./Stats-ef6ecf20.js";import{G as C}from"./lil-gui.esm-fc0b5e43.js";import{g as l}from"./index-539a094b.js";const n=document.querySelector("#app"),r=new u;r.add(new h(5));const s=new g(16777215,2);s.position.set(10,10,10);r.add(s);const e=new f(75,window.innerWidth/window.innerHeight,.1,1e3);e.position.z=4;const a=new S;a.setSize(window.innerWidth,window.innerHeight);n==null||n.appendChild(a.domElement);const w=new W(e,a.domElement);w.enableDamping=!0;const G=new x(3.6,1.8),t=new y,H=new c().load(l("worldColour.5400x2700","jpg"));t.map=H;const L=new c().load(l("earth_normalmap_8192x4096","jpg"));t.normalMap=L;t.normalScale.set(2,2);const M=new P(G,t);r.add(M);window.addEventListener("resize",j,!1);const b=q();A();m();p();function p(){requestAnimationFrame(p),w.update(),b.update(),m()}function m(){a.render(r,e)}function j(){e.aspect=window.innerWidth/window.innerHeight,e.updateProjectionMatrix(),a.setSize(window.innerWidth,window.innerHeight),m()}function q(){const o=new z;return n==null||n.appendChild(o.dom),o}function A(){const o=document.querySelector("#gui");if(!o)return;const i=new C({container:o});i.add(t.normalScale,"x",0,10,.01),i.add(t.normalScale,"y",0,10,.01),i.add(s.position,"x",-20,20).name("Light Pos X");const d=i.addFolder("Camera");d.add(e.position,"x",-10,10,.01),d.add(e.position,"y",-10,10,.01),d.add(e.position,"z",-10,10,.01)}
