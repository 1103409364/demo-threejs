/* empty css              */import{S as f,A as S,P as g,W as x,B as C,b as W,I as b,i as z,j as E,af as F,a,F as H,n as M,D as v}from"./three.module-d5fa3ebf.js";import{O as P}from"./OrbitControls-5742bab2.js";import{S as T}from"./Stats-ef6ecf20.js";import{G as B}from"./lil-gui.esm-fc0b5e43.js";const d=document.querySelector("#app"),t=new f;t.add(new S(5));const o=new g(75,window.innerWidth/window.innerHeight,.1,1e3);o.position.z=4;const s=new x;s.setSize(window.innerWidth,window.innerHeight);d==null||d.appendChild(s.domElement);const I=new P(o,s.domElement);I.addEventListener("change",A);const K=new C,L=new W,R=new b(1,0),U=new z,j=new E,e=new F,m=new a(K,e);m.position.x=5;t.add(m);const l=new a(L,e);l.position.x=3;t.add(l);const h=new a(R,e);h.position.x=0;t.add(h);const u=new a(U,e);u.position.x=-2;t.add(u);const y=new a(j,e);y.position.x=-5;t.add(y);window.addEventListener("resize",D,!1);const q=O();k();c();function A(){q.update(),c()}function c(){s.render(t,o)}function D(){o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),s.setSize(window.innerWidth,window.innerHeight),c()}function O(){const i=new T;return d==null||d.appendChild(i.dom),i}function k(){const i=document.querySelector("#gui");if(!i)return;const w=new B({container:i}),G={side:{FrontSide:H,BackSide:M,DoubleSide:v}},n=w.addFolder("THREE.Material");n.add(e,"transparent").onChange(()=>e.needsUpdate=!0),n.add(e,"opacity",0,1,.01),n.add(e,"depthTest"),n.add(e,"depthWrite"),n.add(e,"alphaTest",0,1,.01).onChange(()=>p()),n.add(e,"visible"),n.add(e,"side",G.side).onChange(()=>p()),n.open();function p(){e.side=e.side,e.needsUpdate=!0}const r=w.addFolder("Camera");r.add(o.position,"x",-10,10,.01),r.add(o.position,"y",-10,10,.01),r.add(o.position,"z",-10,10,.01)}
