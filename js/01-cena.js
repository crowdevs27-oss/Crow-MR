// Quest Mãos · 01-cena
// Limitações: iframes externos não podem ser desenhados em canvas curvo (cross-origin) -> páginas internas + abrir em nova aba.
const T=THREE,D=Math.PI/180,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let R;try{R=new T.WebGLRenderer({antialias:!/Android|iPhone|iPad/i.test(navigator.userAgent),alpha:true,powerPreference:'high-performance'})}catch(e){document.body.insertAdjacentHTML('beforeend','<div class="ov"><div class="card"><h2>WebGL indisponível</h2><p>Ative a aceleração 3D da VM ou use um navegador com WebGL.</p></div></div>');throw e}
const PRMAX=Math.min(devicePixelRatio,/Android|iPhone|iPad/i.test(navigator.userAgent)?1.25:2);R.setPixelRatio(PRMAX);document.body.appendChild(R.domElement);
const S=new T.Scene(),rig=new T.Group(),C=new T.PerspectiveCamera(90,1,.05,100);C.position.set(0,1.6,0);
function resize(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}addEventListener('resize',resize);resize();
let yaw=0,pitch=-.1,gyro=null,gOn=false,yawOff=0,hand=false,pass_=false,foc=null,focus=null,drag=null,hovW=null,pinch=false;
const Y=new T.Vector3(0,1,0),eu=new T.Euler(),wins=[],KEY={};
// Skybox + piso + guardian
const sky=(()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#05060f');g.addColorStop(.5,'#1a1f4a');g.addColorStop(1,'#2b1d44');x.fillStyle=g;x.fillRect(0,0,1024,512);for(let i=0;i<500;i++){x.fillStyle=`rgba(255,255,255,${Math.random()})`;x.fillRect(Math.random()*1024,Math.random()*300,1.5,1.5)}
const m=new T.Mesh(new T.SphereGeometry(50,32,16),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.BackSide}));S.add(m);return m})();
const gridH=new T.GridHelper(40,80,0x4466aa,0x223355);S.add(gridH);
const gm=new T.MeshBasicMaterial({color:0x3aa0ff,wireframe:true,transparent:true,opacity:0});const guard=new T.Mesh(new T.BoxGeometry(3,2.4,3,12,10,12),gm);guard.position.y=1.2;S.add(guard);
// Laser e cursor
const laser=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3(0,0,-1)]),new T.LineBasicMaterial({color:0x66ccff}));S.add(laser);
const cur=new T.Mesh(new T.RingGeometry(.012,.02,24),new T.MeshBasicMaterial({color:0xffffff,side:2,depthTest:false}));cur.renderOrder=99;C.add(cur);
// Áudio espacial
let AC;function snd(f,p){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),pn=AC.createPanner();pn.panningModel='HRTF';if(p){pn.positionX.value=p.x;pn.positionY.value=p.y;pn.positionZ.value=p.z}o.frequency.value=f;g.gain.setValueAtTime(.08,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.09);o.connect(g).connect(pn).connect(AC.destination);o.start();o.stop(AC.currentTime+.1)}catch(e){}}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.style.opacity=1;clearTimeout(t._t);t._t=setTimeout(()=>t.style.opacity=0,2200)}
