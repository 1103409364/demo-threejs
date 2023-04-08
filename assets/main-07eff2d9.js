/* empty css              */import{S as l,P as u,W as v,B as p,b2 as f,g as h,a,b as g,M as b,A as x}from"./three.module-d5fa3ebf.js";import{O as S}from"./OrbitControls-5742bab2.js";import{S as y}from"./Stats-ef6ecf20.js";var M=`uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
void main(void) {
  vec2 position = -1.0 + 2.0 * vUv;
  float red = abs(sin(position.x * position.y + time / 5.0));
  float green = abs(sin(position.x * position.y + time / 4.0));
  float blue = abs(sin(position.x * position.y + time / 3.0));
  gl_FragColor = vec4(red, green, blue, 1.0);
}`,H=`varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}`;const n=document.querySelector("#app"),o=new l,t=new u(75,window.innerWidth/window.innerHeight,.1,1e3);t.position.z=4;const i=new v;i.setSize(window.innerWidth,window.innerHeight);n==null||n.appendChild(i.domElement);const W=new S(t,i.domElement),d=z();d.position.x=2;o.add(d);const C=A();o.add(C);window.addEventListener("resize",P,!1);const s=U();_();c();function c(){requestAnimationFrame(c),W.update(),m()}function m(){s.begin(),i.render(o,t),s.end()}function P(){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight),m()}function z(){const e=new p,r=new f({uniforms:{time:{value:2},resolution:{value:new h}},vertexShader:H,fragmentShader:M});return new a(e,r)}function A(){const e=new g,r=new b({color:65280,wireframe:!0});return new a(e,r)}function U(){const e=new y;return n==null||n.appendChild(e.dom),e}function _(){const e=new x(5);o.add(e)}
