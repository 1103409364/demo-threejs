/* empty css              */import{S as F,A as g,P as G,W as R,i as S,H as v,R as M,N as c,M as x,a as H,w as E,x as N,y as h,z as T,G as P}from"./three.module-d5fa3ebf.js";import{O as b}from"./OrbitControls-5742bab2.js";import{S as q}from"./Stats-ef6ecf20.js";import{G as A}from"./lil-gui.esm-fc0b5e43.js";const o=document.querySelector("#app"),p=new F,w=new F,D=new g(5);p.add(D);const O=new g(5);w.add(O);const d=new G(75,window.innerWidth/window.innerHeight,.1,1e3);d.position.z=4;const t=new R;t.setSize(window.innerWidth,window.innerHeight);o==null||o.appendChild(t.domElement);const L=new b(d,t.domElement);L.screenSpacePanning=!0;const j=new S,k=new S,a=(e,l)=>{const r=document.createElement("canvas"),i=r.getContext("2d");return r.width=e,r.height=e,i.fillStyle="#888888",i.fillRect(0,0,e,e),i.fillStyle=l,i.fillRect(0,0,e/2,e/2),i.fillRect(e/2,e/2,e/2,e/2),r},u=document.createElement("canvas");u.width=128;u.height=128;const n=new v(u);n.mipmaps[0]=a(128,"#ff0000");n.mipmaps[1]=a(64,"#00ff00");n.mipmaps[2]=a(32,"#0000ff");n.mipmaps[3]=a(16,"#880000");n.mipmaps[4]=a(8,"#008800");n.mipmaps[5]=a(4,"#000088");n.mipmaps[6]=a(2,"#008888");n.mipmaps[7]=a(1,"#880088");n.repeat.set(5,5);n.wrapS=M;n.wrapT=M;const s=n.clone();s.minFilter=c;s.magFilter=c;const B=new x({map:n}),m=new x({map:s}),I=new H(j,B),U=new H(k,m);p.add(I);w.add(U);window.addEventListener("resize",K,!1);const J=Q();V();f();W();function W(){requestAnimationFrame(W),L.update(),J.update(),f()}function f(){t.setScissorTest(!0),t.setScissor(0,0,window.innerWidth/2-2,window.innerHeight),t.render(p,d),t.setScissor(window.innerWidth/2,0,window.innerWidth/2-2,window.innerHeight),t.render(w,d),t.setScissorTest(!1)}function K(){d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),f()}function Q(){const e=new q;return o==null||o.appendChild(e.dom),e}function V(){const e=document.querySelector("#gui");if(!e)return;const l=new A({container:e}),r={minFilters:{NearestFilter:c,NearestMipMapLinearFilter:E,NearestMipMapNearestFilter:N,"LinearFilter ":h,"LinearMipMapLinearFilter (Default)":T,LinearMipmapNearestFilter:P},magFilters:{NearestFilter:c,"LinearFilter (Default)":h}},i=l.addFolder("THREE.Texture");i.add(s,"minFilter",r.minFilters).onChange(()=>C()),i.add(s,"magFilter",r.magFilters).onChange(()=>y()),i.open();function C(){m.map=s.clone()}function y(){m.map=s.clone()}}
