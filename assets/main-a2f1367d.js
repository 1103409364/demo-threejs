/* empty css              */import{S as B,A as E,P as F,W as j,a9 as v,V as i,a as r,i as l,af as d,D as m,B as A,L as I,c as g,d as M}from"./three.module-d5fa3ebf.js";import{O}from"./OrbitControls-5742bab2.js";import{S as R}from"./Stats-ef6ecf20.js";const o=document.querySelector("#app"),e=new B;e.add(new E(5));const s=new F(75,window.innerWidth/window.innerHeight,.1,1e3);s.position.z=2;const w=new j;w.setSize(window.innerWidth,window.innerHeight);o==null||o.appendChild(w.domElement);const z=new v,a=[],V=new i;let y=[],p;const t=new O(s,w.domElement);t.addEventListener("change",function(){S.position.copy(t.target),W.position.copy(t.target),x.position.copy(t.target),z.set(t.target,V.subVectors(s.position,t.target).normalize()),y=z.intersectObjects(a,!1),y.length>0?(p=y[0].object,p.material.opacity=.1):p&&(p.material.opacity=1)});const u=new r(new l(10,10),new d({side:m,transparent:!0}));u.rotateX(-Math.PI/2);u.position.y=-1;e.add(u);a.push(u);const h=new r(new l(2,2),new d({side:m,transparent:!0}));h.position.x=3;h.rotateY(-Math.PI/2);e.add(h);a.push(h);const P=new r(new l(2,2),new d({side:m,transparent:!0}));P.position.z=-2;e.add(P);a.push(P);const L=new r(new A,new d({transparent:!0}));L.position.set(-3,0,0);e.add(L);a.push(L);const f=new r(new l(10,10),new d({side:m,transparent:!0}));f.rotateX(Math.PI/2);f.position.y=3;e.add(f);a.push(f);const b=new I({color:255}),n=[];n[0]=new i(-.1,0,0);n[1]=new i(.1,0,0);let c=new g().setFromPoints(n);const S=new M(c,b);e.add(S);n[0]=new i(0,-.1,0);n[1]=new i(0,.1,0);c=new g().setFromPoints(n);const W=new M(c,b);e.add(W);n[0]=new i(0,0,-.1);n[1]=new i(0,0,.1);c=new g().setFromPoints(n);const x=new M(c,b);e.add(x);window.addEventListener("resize",q,!1);function q(){s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),w.setSize(window.innerWidth,window.innerHeight),H()}const C=new R;o==null||o.appendChild(C.dom);function G(){requestAnimationFrame(G),t.update(),H(),C.update()}function H(){w.render(e,s)}G();