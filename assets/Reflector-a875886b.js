import{a as k,P as z,C as R,a8 as B,V as c,aa as P,aU as W,b0 as H,b1 as I,b2 as L,b3 as N,b4 as q,b5 as G}from"./three.module-d5fa3ebf.js";class w extends k{constructor(S,n={}){super(S),this.isReflector=!0,this.type="Reflector",this.camera=new z;const i=this,U=n.color!==void 0?new R(n.color):new R(8355711),T=n.textureWidth||512,_=n.textureHeight||512,F=n.clipBias||0,h=n.shader||w.ReflectorShader,j=n.multisample!==void 0?n.multisample:4,s=new B,r=new c,l=new c,M=new c,u=new P,x=new c(0,0,-1),o=new W,d=new c,v=new c,p=new W,m=new P,t=this.camera,g=new H(T,_,{samples:j,type:I}),b=new L({uniforms:N.clone(h.uniforms),fragmentShader:h.fragmentShader,vertexShader:h.vertexShader});b.uniforms.tDiffuse.value=g.texture,b.uniforms.color.value=U,b.uniforms.textureMatrix.value=m,this.material=b,this.onBeforeRender=function(e,C,f){if(l.setFromMatrixPosition(i.matrixWorld),M.setFromMatrixPosition(f.matrixWorld),u.extractRotation(i.matrixWorld),r.set(0,0,1),r.applyMatrix4(u),d.subVectors(l,M),d.dot(r)>0)return;d.reflect(r).negate(),d.add(l),u.extractRotation(f.matrixWorld),x.set(0,0,-1),x.applyMatrix4(u),x.add(M),v.subVectors(l,x),v.reflect(r).negate(),v.add(l),t.position.copy(d),t.up.set(0,1,0),t.up.applyMatrix4(u),t.up.reflect(r),t.lookAt(v),t.far=f.far,t.updateMatrixWorld(),t.projectionMatrix.copy(f.projectionMatrix),m.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),m.multiply(t.projectionMatrix),m.multiply(t.matrixWorldInverse),m.multiply(i.matrixWorld),s.setFromNormalAndCoplanarPoint(r,l),s.applyMatrix4(t.matrixWorldInverse),o.set(s.normal.x,s.normal.y,s.normal.z,s.constant);const a=t.projectionMatrix;p.x=(Math.sign(o.x)+a.elements[8])/a.elements[0],p.y=(Math.sign(o.y)+a.elements[9])/a.elements[5],p.z=-1,p.w=(1+a.elements[10])/a.elements[14],o.multiplyScalar(2/o.dot(p)),a.elements[2]=o.x,a.elements[6]=o.y,a.elements[10]=o.z+1-F,a.elements[14]=o.w,i.visible=!1;const O=e.getRenderTarget(),D=e.xr.enabled,E=e.shadowMap.autoUpdate,V=e.outputEncoding,A=e.toneMapping;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.outputEncoding=q,e.toneMapping=G,e.setRenderTarget(g),e.state.buffers.depth.setMask(!0),e.autoClear===!1&&e.clear(),e.render(C,t),e.xr.enabled=D,e.shadowMap.autoUpdate=E,e.outputEncoding=V,e.toneMapping=A,e.setRenderTarget(O);const y=f.viewport;y!==void 0&&e.state.viewport(y),i.visible=!0},this.getRenderTarget=function(){return g},this.dispose=function(){g.dispose(),i.material.dispose()}}}w.ReflectorShader={uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <encodings_fragment>

		}`};export{w as R};
