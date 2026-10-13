// Quest Mãos · 09-teclado-mesa — teclado ANCORADO NA MESA (não flutua).
// Fluxo: 1) pede para olhar uma mesa; 2) IA de objetos acha a mesa (MediaPipe ObjectDetector/EfficientDet, classe "dining table"; no WebXR usa os planos "table" do Quest);
// 3) mãos na posição de digitar, paradas ~1,2 s; 4) o teclado nasce na mesa, fixo no mundo. Digitar: pinça (raio) ou, no WebXR, tocar a ponta do dedo na mesa.
const TM={ativo:false,t0:0,mesa:0,box:null,hold:0,od:null,odErr:'',odLoad:false,aviso:null,lines:[],prev:null,pw:null,tl:0};
function iniciarTeclado(){['kbd','aviso'].forEach(k=>{const w=wins.find(x=>x.kind===k);if(w)closeW(w)});TM.ativo=true;TM.t0=performance.now();TM.mesa=0;TM.hold=0;TM.prev=TM.pw=null;TM.lines=['Olhe para uma mesa e posicione as mãos como num teclado.'];TM.aviso=openWin('aviso');carregarOD();snd(520)}
function carregarOD(){if(TM.od||TM.odLoad)return;TM.odLoad=true;if(!window.criarOD){TM.odErr='sem módulo';return}window.criarOD().then(o=>{TM.od=o}).catch(e=>{TM.odErr=String(e&&e.message||e)})}
setInterval(()=>{if(!TM.ativo||!TM.od||XR_ON||vid.readyState<2)return;try{const r=TM.od.detectForVideo(vid,performance.now()),d=(r.detections||[]).find(x=>(x.categories||[]).some(c=>/table/i.test(c.categoryName)));
if(d){const b=d.boundingBox,vw=vid.videoWidth||640,vh=vid.videoHeight||480;TM.box={x:b.originX/vw,y:b.originY/vh,w:b.width/vw,h:b.height/vh};TM.mesa=performance.now()}}catch(e){}},700);
setInterval(()=>{const a=TM.aviso;if(TM.ativo&&performance.now()-TM.t0>9000){colocarAgora();return}if(TM.ativo&&a&&wins.includes(a)){a.lines=TM.lines;a.pct=TM.hold/1.2;draw(a)}},200);
DR.aviso=W=>{const c=W.x,w=W.cv.width,h=W.cv.height;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.font='bold 32px system-ui';c.fillText('Teclado na mesa',w/2,44);c.font='22px system-ui';c.fillStyle='#cde';(W.lines||[]).forEach((t,i)=>c.fillText(t,w/2,96+i*32,w-40));
c.fillStyle='#ffffff22';rr(c,40,h-76,w-80,14,7);c.fill();c.fillStyle='#3b82f6';rr(c,40,h-76,Math.max(14,(w-80)*(W.pct||0)),14,7);c.fill();btn(W,'c',w/2-200,h-52,180,40,'Cancelar',()=>{TM.ativo=false;closeW(W)},0,20);btn(W,'g',w/2+20,h-52,180,40,'Colocar agora',colocarAgora,0,20)};
function msg(two,post,mesa,sem){TM.lines=!two?['Mostre as duas mãos.']:!post?['Posicione as mãos como num teclado:','lado a lado, dedos relaxados e estendidos.']:(!mesa&&!sem)?['Olhe para uma mesa e apoie as mãos sobre ela.',TM.od?'(IA de objetos procurando a mesa…)':TM.odErr?'(IA indisponível — usando só as mãos)':'(carregando IA de objetos…)']:['Segure firme… '+Math.round(Math.min(1,TM.hold/1.2)*100)+'%'];if(sem&&!mesa&&two&&post)TM.lines.push('Mesa não detectada: usando a altura das mãos.')}
function colocarAgora(){const y=headYaw(),f=new V3(-Math.sin(y),0,-Math.cos(y));colocarTeclado(HEAD.clone().addScaledVector(f,.42),HEAD.y-.48)}   // sem mesa/mãos: mesa virtual à frente
function colocarTeclado(c,y){const th=Math.atan2(c.x-HEAD.x,-(c.z-HEAD.z)),a=wins.find(w=>w.kind==='aviso');if(a)closeW(a);TM.ativo=false;
openWin('kbd',{flat:true,w:.78,h:.372,cvw:910,cvh:434,px:c.x,pz:c.z,y:y,theta:th,bar:34});toast('⌨️ Teclado fixado na mesa');snd(880)}
// --- câmera comum (2D): IA acha a mesa; postura das mãos nos landmarks do MediaPipe
TM.hands2D=function(H,now){if(!TM.ativo||XR_ON)return;const two=H.length>=2;let post=false,mov=1,sobre=false;
if(two){const a=H[0].l,b=H[1].l,sz=Math.max(dist(a[0],a[9]),dist(b[0],b[9]),.02),sep=Math.abs(a[0].x-b[0].x),dy=Math.abs(a[0].y-b[0].y),rel=h=>[8,12,16,20].reduce((s,i)=>s+dist(h[i],h[0]),0)/4/Math.max(dist(h[0],h[9]),.02)>1.45;
post=sep>.12&&sep<.8&&dy<.14&&rel(a)&&rel(b)&&dist(a[4],a[8])/sz>.5&&dist(b[4],b[8])/sz>.5;const cur=[a[0].x,a[0].y,b[0].x,b[0].y];if(TM.prev)mov=Math.hypot(cur[0]-TM.prev[0],cur[1]-TM.prev[1])+Math.hypot(cur[2]-TM.prev[2],cur[3]-TM.prev[3]);TM.prev=cur;
const bx=TM.box;sobre=!!bx&&[0,1].some(i=>{const w=H[i].l[0];return w.x>=bx.x-.1&&w.x<=bx.x+bx.w+.1&&w.y>=bx.y-.15&&w.y<=bx.y+bx.h+.1})}else TM.prev=null;
const mesa=now-TM.mesa<2500&&sobre,sem=(!TM.od&&!!TM.odErr&&now-TM.t0>4000)||now-TM.t0>15000,dt=Math.min((now-(TM.tl||now))/1000,.2);TM.tl=now;
TM.hold=post&&mov<.015&&(mesa||sem)?TM.hold+dt:Math.max(0,TM.hold-dt*2);msg(two,post,mesa,sem);
if(TM.hold>=1.2){const a=LASTP[0],b=LASTP[1];if(a&&b)colocarTeclado(C.localToWorld(a[9].clone()).add(C.localToWorld(b[9].clone())).multiplyScalar(.5),(C.localToWorld(a[0].clone()).y+C.localToWorld(b[0].clone()).y)/2-.015)}};
// --- WebXR: planos "table" do Quest (plane-detection) + juntas reais das mãos
function planoMesa(frame,wy){const ps=frame&&frame.detectedPlanes;if(!ps)return null;const rs=R.xr.getReferenceSpace();let best=null;
ps.forEach(pl=>{if((pl.orientation&&pl.orientation!=='horizontal')||pl.semanticLabel==='floor'||pl.semanticLabel==='ceiling')return;const po=frame.getPose(pl.planeSpace,rs);if(!po)return;const y=po.transform.position.y+rig.position.y,sc=(pl.semanticLabel==='table'?0:1)+Math.abs(y-wy);if(!best||sc<best.sc)best={y,sc}});return best}
window.tmXR=function(HW,frame,now){if(!TM.ativo||!XR_ON)return;const a=HW[0],b=HW[1],two=!!(a&&b);let post=false,mov=1,wy=0;
if(two){wy=(a[0].y+b[0].y)/2;const sep=a[0].distanceTo(b[0]),fl=h=>{const v=h[12].clone().sub(h[0]);return v.length()>.1&&Math.abs(v.y)<.06};post=sep>.12&&sep<.7&&Math.abs(a[0].y-b[0].y)<.07&&fl(a)&&fl(b);
mov=TM.pw?a[0].distanceTo(TM.pw[0])+b[0].distanceTo(TM.pw[1]):1;TM.pw=[a[0].clone(),b[0].clone()]}else TM.pw=null;
const pl=two?planoMesa(frame,wy):null,mesa=!!pl&&Math.abs(pl.y-wy)<.15,sem=now-TM.t0>10000,dt=Math.min((now-(TM.tl||now))/1000,.2);TM.tl=now;
TM.hold=post&&mov<.012&&(mesa||sem)?TM.hold+dt:Math.max(0,TM.hold-dt*2);TM.od=TM.od||{xr:1};msg(two,post,mesa,sem);
if(TM.hold>=1.2)colocarTeclado(a[9].clone().add(b[9]).multiplyScalar(.5),mesa?pl.y:wy-.015)};
// toque do dedo na mesa = tecla (WebXR, profundidade real)
const fpress={};
window.tmPoke=function(P,hid){const k=wins.find(w=>w.kind==='kbd');if(!k)return;[4,8,12,16,20].forEach(fi=>{const lp=k.mesh.worldToLocal(P[fi].clone()),w=k.w*k.s,h=k.h*k.s,id=hid+fi;
if(Math.abs(lp.x)<w/2&&Math.abs(lp.z)<h/2){const px=(lp.x/w+.5)*k.cv.width,py=(lp.z/h+.5)*k.cv.height;if(lp.y<.06){const r=reg(k,px,py);if(r&&k.hk!==r.k){k.hk=r.k;draw(k)}if(lp.y<.02&&!fpress[id]){fpress[id]=1;if(r){r.f(px,py);snd(700+fi*20)}}}if(lp.y>.04)fpress[id]=0}else fpress[id]=0})};
// --- digitar com TODOS os dedos (câmera 2D): cada ponta de dedo mira a tecla sob ela; "bater" = o dedo flexiona ou desce rápido (relativo ao pulso)
window.kbdUp=()=>TM.ativo||wins.some(w=>w.kind==='kbd'&&!w.min);
const TAPF=[[4,2],[8,5],[12,9],[16,13],[20,17]],fs2={},V2=new T.Vector2();
TM.tap2D=function(H,now){const k=wins.find(w=>w.kind==='kbd');if(!k||k.min||TM.ativo||XR_ON)return;const hs=new Set();
H.forEach((o,hi)=>{const l=o.l,pal=Math.max(dist(l[0],l[9]),.02);TAPF.forEach((f,fi)=>{const id=hi*5+fi,s=fs2[id]||(fs2[id]={mx:0,rel:null,down:false,t:0,tt:0}),tip=l[f[0]],len=dist(tip,l[f[1]])/pal,rel=(tip.y-l[0].y)/pal;
s.mx=Math.max(len,s.mx*.97+len*.03);const dt=Math.max((now-(s.tt||now))/1000,.015);s.tt=now;const vy=s.rel===null?0:(rel-s.rel)/dt;s.rel=rel;
V2.set(((1-tip.x)-.5)*1.8,-(tip.y-.5)*1.8);RC.setFromCamera(V2,C);const h=RC.intersectObject(k.mesh)[0];let r=null,px=0,py=0;if(h){px=h.uv.x*k.cv.width;py=(1-h.uv.y)*k.cv.height;r=reg(k,px,py);if(r)hs.add(r.k)}
const flex=len<s.mx*.86,drop=vy>1.8;
if(!s.down&&(flex||drop)&&now-s.t>140){s.down=true;s.t=now;if(r&&r.k!=='x'){r.f(px,py);snd(600+fi*40,h.point)}}else if(s.down&&!drop&&len>s.mx*.93&&now-s.t>120)s.down=false})});
const sg=[...hs].sort().join();if(sg!==k.hsg){k.hsg=sg;k.hs=hs;draw(k)}};
