// Quest Mãos · 06-maos
// ===== Entrada: SOMENTE hand tracking (MediaPipe, 21 landmarks/mão) =====
rig.add(C);S.add(rig);vid.id='cam';document.body.appendChild(vid);
const RC=new T.Raycaster(),M=new T.Vector2();let lat=0,conf=0,tSend=0,nH=0,pin=false,lastT=0;const walk={f:0,s:0};
function pick(){if(XR_ON)RC.set(xrO,xrD);else RC.setFromCamera(M,C);const h=RC.intersectObjects(wins.filter(w=>!w.min).map(w=>w.mesh))[0],dir=RC.ray.direction.clone();if(!h)return{dir};const W=h.object.userData.W;return{W,dir,pt:h.point,px:h.uv.x*W.cv.width,py:(1-h.uv.y)*W.cv.height}}
const reg=(W,x,y)=>[...W.regs].reverse().find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
function down(){pinch=true;if(AC&&AC.state==='suspended')AC.resume();const p=pick();
if(!p.W){if(foc){const o=foc.W;foc=null;draw(o)}return}
const W=p.W,r=reg(W,p.px,p.py);if(focus!==W)setFocus(W);
if(r){r.f(p.px,p.py);snd(660,p.pt);navigator.vibrate&&navigator.vibrate(8);return}
if(!W.flat&&p.px>W.cv.width-44&&p.py>W.cv.height-44){drag={t:'size',W,x:M.x,s0:W.s};return}
if(!W.flat&&(p.py<W.bar||p.py>W.cv.height-26)){const ch=cylHit(W,RC.ray.origin,p.dir);if(ch)drag={t:'move',W,o:W.theta-ch.th,yo:W.y-ch.y}}}
function dragStep(){if(!drag)return;if(drag.t==='size'){drag.W.s=cl(drag.s0+(M.x-drag.x)*1.2,.5,2.2);rebuild(drag.W)}
else if(drag.t==='scroll'){const W=drag.W,t=W.tabs[W.ti],n=cl(drag.s0+(M.y-drag.y)*600,0,t.max||0);if(Math.abs(n-t.sc)>2){t.sc=n;draw(W)}}
else if(drag.t==='adrag')appDrag();
else{const d=pick().dir,W=drag.W,ch=cylHit(W,RC.ray.origin,d);if(ch){W.theta=ch.th+drag.o;W.y=cl(ch.y+drag.yo,.3,2.8);place(W)}}}
function up(){pinch=false;if(drag&&drag.t==='adrag')appUp();if(drag&&drag.t==='move'){const W=drag.W,st=30*D,n=Math.round(W.theta/st)*st;if(Math.abs(W.theta-n)<6*D){W.theta=n;place(W);snd(880)}}drag=null}
// Filtro One Euro + predição linear
class OE{constructor(){this.v=null;this.d=0}f(x,dt){if(this.v===null){this.v=x;return x}const a=c=>1/(1+1/(2*Math.PI*c*dt));this.d+=a(1)*((x-this.v)/dt-this.d);this.v+=a(1.2+2*Math.abs(this.d))*(x-this.v);return this.v}}
const oX=new OE(),oY=new OE(),oP=new OE(),ctl={fist:false,pin:false,ax:0,ay:0,lx:null,ly:0};
const CON=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
// Mãos "fantasma" (estilo Quest): ossos/juntas translúcidos com blend aditivo + palma suave; brilham ao pinçar
const V3=T.Vector3,dum=new T.Object3D(),UP=new V3(0,1,0),HP=[new V3(),new V3()],dHand=[.5,.5];
const SK=[0,1].map(i=>{const m1=new T.MeshBasicMaterial({color:0xbfe6ff,transparent:true,opacity:.28,depthWrite:false,depthTest:false,blending:T.AdditiveBlending}),m2=new T.MeshBasicMaterial({color:0xbfe6ff,transparent:true,opacity:.14,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,side:2}),g=new T.Group(),
jn=new T.InstancedMesh(new T.SphereGeometry(1,10,8),m1,21),bn=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,8,1,true),m1,CON.length),pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(36),3));const pm=new T.Mesh(pg,m2);
[jn,bn,pm].forEach(o=>{o.frustumCulled=false;o.renderOrder=999;g.add(o)});g.visible=false;C.add(g);return{g,jn,bn,pm,mats:[m1,m2]}});
function skel(i,l,sz){const s=SK[i];dHand[i]+=(cl(.078/sz,.25,1)-dHand[i])*.3;const d=dHand[i],K=1.154*d,P=l.map(m=>new V3((.5-m.x)*K,(.5-m.y)*K*.5625,-d-m.z*K));LASTP[i]=P;HP[i].copy(P[4]).add(P[8]).multiplyScalar(.5);SK[i].g.visible=false}
function ghostDraw(i,P){const s=SK[i];
P.forEach((p,j)=>{dum.position.copy(p);dum.quaternion.identity();dum.scale.setScalar([4,8,12,16,20].includes(j)?.0085:.0065);dum.updateMatrix();s.jn.setMatrixAt(j,dum.matrix)});
CON.forEach((c,j)=>{const a=P[c[0]],b=P[c[1]],dv=b.clone().sub(a),len=dv.length()||1e-4;dum.position.copy(a).add(b).multiplyScalar(.5);dum.quaternion.setFromUnitVectors(UP,dv.divideScalar(len));dum.scale.set(.0045,len,.0045);dum.updateMatrix();s.bn.setMatrixAt(j,dum.matrix)});
s.jn.instanceMatrix.needsUpdate=s.bn.instanceMatrix.needsUpdate=true;const pa=s.pm.geometry.attributes.position;[0,5,9,0,9,13,0,13,17,0,1,5].forEach((k,j)=>pa.setXYZ(j,P[k].x,P[k].y,P[k].z));pa.needsUpdate=true;
HP[i].copy(P[4]).add(P[8]).multiplyScalar(.5);const on=i?ctl.pin:pin;s.mats[0].color.set(on?0xffffff:0xbfe6ff);s.mats[0].opacity=on?.5:.28;s.g.visible=true}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z-b.z)*.5);
// ===== Handtracker "Quest Style": contorno (convex hull, Monotone Chain) da mão sobre a cena; branco, azul ao pinçar (<30 px em 640x480) =====
const H2=document.getElementById('hand2d'),X2=H2.getContext('2d');
function produtoVetorial(o,a,b){return (a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)}
function obterBorda(pontos){pontos.sort((a,b)=>a.x!==b.x?a.x-b.x:a.y-b.y);const lower=[];for(let i=0;i<pontos.length;i++){while(lower.length>=2&&produtoVetorial(lower[lower.length-2],lower[lower.length-1],pontos[i])<=0)lower.pop();lower.push(pontos[i])}
const upper=[];for(let i=pontos.length-1;i>=0;i--){while(upper.length>=2&&produtoVetorial(upper[upper.length-2],upper[upper.length-1],pontos[i])<=0)upper.pop();upper.push(pontos[i])}upper.pop();lower.pop();return lower.concat(upper)}
let hullOn=false;   // ESQUELETO da mão (21 juntas + ossos) num canvas por cima de TUDO (z-index 100); branco, azul ao pinçar
function drawHull(H){if(XR_ON){H2.style.display='none';return}H2.style.display='block';const A=innerWidth,B=innerHeight;if(H2.width!==A||H2.height!==B){H2.width=A;H2.height=B}if(!H.length&&!hullOn)return;hullOn=H.length>0;X2.clearRect(0,0,A,B);X2.lineCap='round';
H.forEach(o=>{const px=o.l.map(m=>({x:(((1-m.x)-.5)*.9+.5)*A,y:((m.y-.5)*.9+.5)*B})),col=Math.hypot((o.l[4].x-o.l[8].x)*640,(o.l[4].y-o.l[8].y)*480)<30?'#00BFFF':'#FFFFFF';
X2.strokeStyle=col;X2.lineWidth=4;X2.beginPath();CON.forEach(c=>{X2.moveTo(px[c[0]].x,px[c[0]].y);X2.lineTo(px[c[1]].x,px[c[1]].y)});X2.stroke();
X2.fillStyle=col;px.forEach((p,j)=>{X2.beginPath();X2.arc(p.x,p.y,[4,8,12,16,20].includes(j)?7:5,0,6.3);X2.fill()})})}
const LASTP=[null,null];let seen0=0,pdv=1,hist=[],pOff=[0,0],pc=0;
function onHands(r){const now=performance.now(),dt=Math.max((now-lastT)/1e3,.008);lastT=now;lat=now-tSend;
const H=(r.multiHandLandmarks||[]).map((l,i)=>({l,sc:r.multiHandedness[i].score})).sort((a,b)=>a.l[0].x-b.l[0].x);nH=H.length;SK.forEach(s=>s.g.visible=false);drawHull(H);if(window.TM){TM.hands2D(H,now);TM.tap2D(H,now)}
// Mão direita = ponteiro. Mira = mistura do nó do indicador (estável) com a ponta; clique = pinça com histerese, 2 frames de confirmação e trava de posição (usa a posição de ~150 ms antes da pinça).
if(H[0]){const l=H[0].l;conf=H[0].sc;const sz=Math.max(dist(l[0],l[9]),dist(l[5],l[17])*1.3,.02);skel(0,l,sz);seen0=now;const pxd=Math.hypot((l[4].x-l[8].x)*640,(l[4].y-l[8].y)*480),nrm=dist(l[4],l[8])/sz;pdv=cl(oP.f(pxd,dt)/80,0,1.5);
const fx=oX.f(cl(((1-(l[5].x*.45+l[8].x*.55))-.5)*1.8,-1,1),dt),fy=oY.f(cl(((l[5].y*.45+l[8].y*.55)-.5)*1.8,-1,1),dt),cx=cl(fx+oX.d*.05,-1,1),cy=-cl(fy+oY.d*.05,-1,1);
const c3=[12,16,20].reduce((a,i)=>a+dist(l[i],l[0]),0)/3/sz;hist.push([now,cx,cy]);while(hist.length&&now-hist[0][0]>400)hist.shift();
if(!pin){M.set(cx,cy);pc=pxd<30&&nrm<.6&&c3>1.05?pc+1:0;if(pc>=2){const q=hist.find(e=>now-e[0]<=160)||hist[0];pOff=[q[1]-cx,q[2]-cy];M.set(q[1],q[2]);pin=true;down()}}
else if(pxd>45){pin=false;pc=0;up()}else M.set(cl(cx+pOff[0],-1,1),cl(cy+pOff[1],-1,1));
dragStep()}else{if(pin&&now-seen0>250){pin=false;up()}if(!pin){pc=0;pdv=1}}
const g=H[1]&&H[1].l;if(g){const s=Math.max(dist(g[0],g[9]),.02);skel(1,g,s);const tips=[8,12,16,20].reduce((a,i)=>a+dist(g[i],g[0]),0)/4/s,p2=dist(g[4],g[8])/s;
ctl.fist=ctl.fist?tips<1.6:tips<1.25;const gp=!ctl.fist&&(ctl.pin?p2<.58:p2<.36);

if(gp&&!ctl.pin){ctl.ax=g[0].x;ctl.ay=g[0].y}ctl.pin=gp;const wk=gp&&!(window.kbdUp&&kbdUp());walk.f=wk?cl((ctl.ay-g[0].y)*5,-1,1):0;walk.s=wk?cl((ctl.ax-g[0].x)*5,-1,1):0;ctl.lx=g[0].x;ctl.ly=g[0].y}
else{ctl.fist=ctl.pin=false;walk.f=walk.s=0;ctl.lx=null}}
const st=m=>{document.getElementById('err').textContent=m};
// Hand tracking 100% local: modelo e wasm em lib/ (carregados por js/00-mediapipe.js, que precisa de http, não de file://)
const tmo=(p,ms,m)=>Promise.race([p,new Promise((_,j)=>setTimeout(()=>j(m),ms))]);
const CDN='https://cdn.jsdelivr.net/npm/@mediapipe/';
function loadJS(src){return new Promise((ok,no)=>{const e=document.createElement('script');e.src=src;e.crossOrigin='anonymous';e.onload=ok;e.onerror=()=>no('falha ao carregar '+src);document.head.appendChild(e)})}
// Handtracker "Quest Style": MediaPipe Hands + camera_utils, modelComplexity 0, confiança 0.7, 640x480. Usa lib/hands/ se existir (offline); senão a CDN.
async function viaLegado(){let base=CDN+'hands/';
st('1/3 Carregando o Handtracker (MediaPipe Hands)…');
try{await loadJS('lib/hands/hands.js');if(typeof Hands==='undefined')throw 0;base='lib/hands/'}catch(e){await loadJS(CDN+'hands/hands.js')}
try{await loadJS('lib/hands/camera_utils.js');if(typeof Camera==='undefined')throw 0}catch(e){await loadJS(CDN+'camera_utils/camera_utils.js')}
const hands=new Hands({locateFile:f=>base+f});hands.setOptions({maxNumHands:2,modelComplexity:0,minDetectionConfidence:.7,minTrackingConfidence:.7});hands.onResults(onHands);
st('2/3 Carregando modelo de mãos… (até 1 min em PC fraco)');await tmo(hands.initialize(),90000,'modelo: tempo esgotado');
st('3/3 Abrindo a câmera… (aceite o aviso do navegador)');
const cam=new Camera(vid,{onFrame:async()=>{tSend=performance.now();await hands.send({image:vid})},width:640,height:480});
try{await tmo(cam.start(),25000,'sem resposta')}catch(e){const er=new Error('Câmera indisponível ('+(e.name||e.message||e)+'). Em VM: Dispositivos > Webcams. Ou use "Entrar sem câmera".');er.cam=1;throw er}}
// Reserva 100% local (tasks-vision em lib/), usada se o Handtracker acima não puder ser baixado
async function viaLocal(){st('Usando o modelo local (lib/)…');
try{vid.srcObject=await tmo(navigator.mediaDevices.getUserMedia({video:{width:{ideal:960},height:{ideal:540},facingMode:'user'}}),25000,'sem resposta');await tmo(vid.play(),8000,'vídeo não iniciou')}catch(e){throw'Câmera indisponível ('+(e.name||e)+').'}
if(!window.criarHL)throw'MediaPipe local não carregou. Precisa de http(s): localhost, WebViewAssetLoader ou Capacitor — não file://.';
const hl=await tmo(window.criarHL(),90000,'tempo esgotado');let lt=-1;
(function feed(){if(vid.readyState>=2&&vid.currentTime!==lt){lt=vid.currentTime;tSend=performance.now();try{const r=hl.detectForVideo(vid,tSend);onHands({multiHandLandmarks:r.landmarks,multiHandedness:r.handednesses.map(h=>({score:h[0].score}))})}catch(e){}}requestAnimationFrame(feed)})()}
async function startHands(){try{
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw'Câmera indisponível (precisa de https ou localhost).';
try{await viaLegado()}catch(e){if(e&&e.cam)throw e.message;await viaLocal()}
st('Pronto');return true}
catch(e){st('Falhou: '+String(e&&e.message||e));return false}}
