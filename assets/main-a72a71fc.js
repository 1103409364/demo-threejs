/* empty css              */import{S as b,A as M,h as v,P as G,W,i as S,r as E,p as f,a as z,F as R,n as T,D as L}from"./three.module-d5fa3ebf.js";import{O as j}from"./OrbitControls-5742bab2.js";import{S as q}from"./Stats-ef6ecf20.js";import{G as A}from"./lil-gui.esm-fc0b5e43.js";import{g as C}from"./index-539a094b.js";const i=document.querySelector("#app"),l=new b;l.add(new M(5));const x=new v(16777215,2);x.position.set(10,10,10);l.add(x);const t=new G(75,window.innerWidth/window.innerHeight,.1,1e3);t.position.z=4;const s=new W;s.setSize(window.innerWidth,window.innerHeight);i==null||i.appendChild(s.domElement);const y=new j(t,s.domElement);y.screenSpacePanning=!0;const D=new S(3.6,1.8,360,180),e=new E,N=new f().load(C("worldColour.5400x2700","jpg"));e.map=N;const U=new f().load(C("gebco_bathy.5400x2700_8bit","jpg"));e.displacementMap=U;const g=new z(D,e);l.add(g);window.addEventListener("resize",I,!1);const B=O();_();w();H();function H(){requestAnimationFrame(H),y.update(),B.update(),w()}function w(){s.render(l,t)}function I(){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),s.setSize(window.innerWidth,window.innerHeight),w()}function O(){const r=new q;return i==null||i.appendChild(r.dom),r}function _(){const r=document.querySelector("#gui");if(!r)return;const c=new A({container:r}),F={side:{FrontSide:R,BackSide:T,DoubleSide:L}},a=c.addFolder("THREE.Material");a.add(e,"transparent").onChange(()=>e.needsUpdate=!0),a.add(e,"opacity",0,1,.01),a.add(e,"depthTest"),a.add(e,"depthWrite"),a.add(e,"alphaTest",0,1,.01).onChange(()=>m()),a.add(e,"visible"),a.add(e,"side",F.side).onChange(()=>m());const o={color:e.color.getHex(),emissive:e.emissive.getHex(),specular:e.specular.getHex()},n=c.addFolder("THREE.meshPhongMaterialFolder");n.addColor(o,"color").onChange(()=>{e.color.setHex(Number(o.color.toString().replace("#","0x")))}),n.addColor(o,"emissive").onChange(()=>{e.emissive.setHex(Number(o.emissive.toString().replace("#","0x")))}),n.addColor(o,"specular").onChange(()=>{e.specular.setHex(Number(o.specular.toString().replace("#","0x")))}),n.add(e,"shininess",0,1024),n.add(e,"wireframe"),n.add(e,"flatShading").onChange(()=>m()),n.add(e,"reflectivity",0,1),n.add(e,"refractionRatio",0,1),n.add(e,"displacementScale",0,1,.01),n.add(e,"displacementBias",-1,1,.01),n.open();function m(){e.side=e.side,e.needsUpdate=!0}const d={width:3.6,height:1.8,widthSegments:360,heightSegments:180},p=c.addFolder("PlaneGeometry");p.add(d,"widthSegments",1,360).onChange(u),p.add(d,"heightSegments",1,180).onChange(u),p.open();function u(){const P=new S(d.width,d.height,d.widthSegments,d.heightSegments);g.geometry.dispose(),g.geometry=P}const h=c.addFolder("Camera");h.add(t.position,"x",-10,10,.01),h.add(t.position,"y",-10,10,.01),h.add(t.position,"z",-10,10,.01)}
