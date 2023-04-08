/* empty css              */import{ag as O,ah as D,aS as R,aT as G,c as F,av as I,C as M,S as N,A as W,P as H,W as v}from"./three.module-d5fa3ebf.js";import{O as z}from"./OrbitControls-5742bab2.js";import{G as B}from"./GLTFLoader-3c7b0d3d.js";import{S as j}from"./Stats-ef6ecf20.js";import{G as q}from"./lil-gui.esm-fc0b5e43.js";const A=new WeakMap;class V extends O{constructor(e){super(e),this.decoderPath="",this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(e){return this.decoderPath=e,this}setDecoderConfig(e){return this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,r,s,o){const n=new D(this.manager);n.setPath(this.path),n.setResponseType("arraybuffer"),n.setRequestHeader(this.requestHeader),n.setWithCredentials(this.withCredentials),n.load(e,t=>{this.parse(t,r,o)},s,o)}parse(e,r,s){this.decodeDracoFile(e,r,null,null,R).catch(s)}decodeDracoFile(e,r,s,o,n=G){const t={attributeIDs:s||this.defaultAttributeIDs,attributeTypes:o||this.defaultAttributeTypes,useUniqueIDs:!!s,vertexColorSpace:n};return this.decodeGeometry(e,t).then(r)}decodeGeometry(e,r){const s=JSON.stringify(r);if(A.has(e)){const a=A.get(e);if(a.key===s)return a.promise;if(e.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let o;const n=this.workerNextTaskID++,t=e.byteLength,i=this._getWorker(n,t).then(a=>(o=a,new Promise((m,l)=>{o._callbacks[n]={resolve:m,reject:l},o.postMessage({type:"decode",id:n,taskConfig:r,buffer:e},[e])}))).then(a=>this._createGeometry(a.geometry));return i.catch(()=>!0).then(()=>{o&&n&&this._releaseTask(o,n)}),A.set(e,{key:s,promise:i}),i}_createGeometry(e){const r=new F;e.index&&r.setIndex(new I(e.index.array,1));for(let s=0;s<e.attributes.length;s++){const o=e.attributes[s],n=o.name,t=o.array,i=o.itemSize,a=new I(t,i);n==="color"&&this._assignVertexColorSpace(a,o.vertexColorSpace),r.setAttribute(n,a)}return r}_assignVertexColorSpace(e,r){if(r!==R)return;const s=new M;for(let o=0,n=e.count;o<n;o++)s.fromBufferAttribute(e,o).convertSRGBToLinear(),e.setXYZ(o,s.r,s.g,s.b)}_loadLibrary(e,r){const s=new D(this.manager);return s.setPath(this.decoderPath),s.setResponseType(r),s.setWithCredentials(this.withCredentials),new Promise((o,n)=>{s.load(e,o,void 0,n)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;const e=typeof WebAssembly!="object"||this.decoderConfig.type==="js",r=[];return e?r.push(this._loadLibrary("draco_decoder.js","text")):(r.push(this._loadLibrary("draco_wasm_wrapper.js","text")),r.push(this._loadLibrary("draco_decoder.wasm","arraybuffer"))),this.decoderPending=Promise.all(r).then(s=>{const o=s[0];e||(this.decoderConfig.wasmBinary=s[1]);const n=J.toString(),t=["/* draco decoder */",o,"","/* worker */",n.substring(n.indexOf("{")+1,n.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([t]))}),this.decoderPending}_getWorker(e,r){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){const o=new Worker(this.workerSourceURL);o._callbacks={},o._taskCosts={},o._taskLoad=0,o.postMessage({type:"init",decoderConfig:this.decoderConfig}),o.onmessage=function(n){const t=n.data;switch(t.type){case"decode":o._callbacks[t.id].resolve(t);break;case"error":o._callbacks[t.id].reject(t);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+t.type+'"')}},this.workerPool.push(o)}else this.workerPool.sort(function(o,n){return o._taskLoad>n._taskLoad?-1:1});const s=this.workerPool[this.workerPool.length-1];return s._taskCosts[e]=r,s._taskLoad+=r,s})}_releaseTask(e,r){e._taskLoad-=e._taskCosts[r],delete e._callbacks[r],delete e._taskCosts[r]}debug(){console.log("Task load: ",this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}}function J(){let c,e;onmessage=function(t){const i=t.data;switch(i.type){case"init":c=i.decoderConfig,e=new Promise(function(l){c.onModuleLoaded=function(h){l({draco:h})},DracoDecoderModule(c)});break;case"decode":const a=i.buffer,m=i.taskConfig;e.then(l=>{const h=l.draco,d=new h.Decoder;try{const u=r(h,d,new Int8Array(a),m),f=u.attributes.map(w=>w.array.buffer);u.index&&f.push(u.index.array.buffer),self.postMessage({type:"decode",id:i.id,geometry:u},f)}catch(u){console.error(u),self.postMessage({type:"error",id:i.id,error:u.message})}finally{h.destroy(d)}});break}};function r(t,i,a,m){const l=m.attributeIDs,h=m.attributeTypes;let d,u;const f=i.GetEncodedGeometryType(a);if(f===t.TRIANGULAR_MESH)d=new t.Mesh,u=i.DecodeArrayToMesh(a,a.byteLength,d);else if(f===t.POINT_CLOUD)d=new t.PointCloud,u=i.DecodeArrayToPointCloud(a,a.byteLength,d);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!u.ok()||d.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+u.error_msg());const w={index:null,attributes:[]};for(const y in l){const _=self[h[y]];let k,L;if(m.useUniqueIDs)L=l[y],k=i.GetAttributeByUniqueId(d,L);else{if(L=i.GetAttributeId(d,t[l[y]]),L===-1)continue;k=i.GetAttribute(d,L)}const P=o(t,i,d,y,_,k);y==="color"&&(P.vertexColorSpace=m.vertexColorSpace),w.attributes.push(P)}return f===t.TRIANGULAR_MESH&&(w.index=s(t,i,d)),t.destroy(d),w}function s(t,i,a){const l=a.num_faces()*3,h=l*4,d=t._malloc(h);i.GetTrianglesUInt32Array(a,h,d);const u=new Uint32Array(t.HEAPF32.buffer,d,l).slice();return t._free(d),{array:u,itemSize:1}}function o(t,i,a,m,l,h){const d=h.num_components(),f=a.num_points()*d,w=f*l.BYTES_PER_ELEMENT,y=n(t,l),_=t._malloc(w);i.GetAttributeDataArrayForAllPoints(a,h,y,w,_);const k=new l(t.HEAPF32.buffer,_,f).slice();return t._free(_),{name:m,array:k,itemSize:d}}function n(t,i){switch(i){case Float32Array:return t.DT_FLOAT32;case Int8Array:return t.DT_INT8;case Int16Array:return t.DT_INT16;case Int32Array:return t.DT_INT32;case Uint8Array:return t.DT_UINT8;case Uint16Array:return t.DT_UINT16;case Uint32Array:return t.DT_UINT32}}}const b=document.querySelector("#app"),C=new N;C.add(new W(5));const p=new H(75,window.innerWidth/window.innerHeight,.1,1e3);p.position.z=3;const g=new v;g.useLegacyLights=!0;g.shadowMap.enabled=!0;g.setSize(window.innerWidth,window.innerHeight);b==null||b.appendChild(g.domElement);const x=new z(p,g.domElement);x.enableDamping=!0;const U=new B,T=new V;T.setDecoderPath("/node_modules/three/examples/jsm/libs/draco/");T.setDecoderConfig({type:"wasm"});U.setDRACOLoader(T);U.load("/assets/models/monkey_compressed.glb",c=>{c.scene.traverse(e=>{if(e.isMesh){const r=e;r.receiveShadow=!0,r.castShadow=!0}if(e.isLight){const r=e;r.castShadow=!0,r.shadow.bias=-.003,r.shadow.mapSize.width=2048,r.shadow.mapSize.height=2048}}),C.add(c.scene)},c=>{console.log(c.loaded/c.total*100+"% loaded")},c=>{console.log(c)});window.addEventListener("resize",Y,!1);const X=K();Z();S();E();function E(){requestAnimationFrame(E),x.update(),X.update(),S()}function S(){g.render(C,p)}function Y(){p.aspect=window.innerWidth/window.innerHeight,p.updateProjectionMatrix(),g.setSize(window.innerWidth,window.innerHeight),S()}function K(){const c=new j;return b==null||b.appendChild(c.dom),c}function Z(){const c=document.querySelector("#gui");if(!c)return;const r=new q({container:c}).addFolder("Camera");r.add(p.position,"x",-10,10,.01),r.add(p.position,"y",-10,10,.01),r.add(p.position,"z",-10,10,.01)}
