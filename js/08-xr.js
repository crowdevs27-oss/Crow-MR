// Quest Mãos · 08-xr — WebXR 6DoF: cabeça = pose do headset (posição + rotação reais); mãos = XRHand (fantasma); controles = raio. Andar: pinça da mão esquerda ou analógico.
const HW=[null,null];let XR_ON=false;const HEAD=new V3(),xrO=new V3(),xrD=new V3(),xrLv=new V3(),yawQ=new T.Quaternion(),qq=new T.Quaternion(),p3=new V3(),s3=new V3(),sh=new V3(),xrOff=new V3(),xrHist=[],lw={on:false,s:new V3()};let xrP=false,xrCS=false;
R.xr.enabled=true;
const XH=[0,1].map(i=>{const h=R.xr.getHand(i);rig.add(h);h.userData={hn:''};h.addEventListener('connected',e=>{h.userData.hn=e.data.handedness});h.addEventListener('disconnected',()=>{h.userData.hn=''});return h});
const XC=[0,1].map(i=>{const c=R.xr.getController(i);rig.add(c);c.userData={gp:null,sel:false,hn:'',hand:false};c.addEventListener('connected',e=>{const u=c.userData;u.gp=e.data.gamepad||null;u.hn=e.data.handedness;u.hand=!!e.data.hand});c.addEventListener('disconnected',()=>{c.userData.gp=null;c.userData.hn=''});c.addEventListener('selectstart',()=>{c.userData.sel=true});c.addEventListener('selectend',()=>{c.userData.sel=false});return c});
const XN=['wrist','thumb-metacarpal','thumb-phalanx-proximal','thumb-phalanx-distal','thumb-tip'];['index-finger','middle-finger','ring-finger','pinky-finger'].forEach(f=>XN.push(f+'-phalanx-proximal',f+'-phalanx-intermediate',f+'-phalanx-distal',f+'-tip'));
function setM(){const l=xrD.clone().applyQuaternion(qq.clone().invert());M.set(cl(l.x/-l.z,-2,2),cl(l.y/-l.z,-2,2))}   // ray -> "NDC" p/ arrastar/rolar
function xrStep(dt,frame){C.matrixWorld.decompose(p3,qq,s3);HEAD.copy(p3);yawQ.setFromAxisAngle(Y,eu.setFromQuaternion(qq,'YXZ').y);
HW[0]=HW[1]=null;SK.forEach(k=>k.g.visible=false);walk.f=walk.s=0;pin=false;ctl.pin=false;let got=false;const now=performance.now();
XH.forEach(h=>{const j=h.joints;if(!j||!j['wrist']||!j['wrist'].visible)return;const P=XN.map(n=>j[n]&&j[n].visible?j[n].position.clone().applyMatrix4(rig.matrixWorld):null);if(P.some(q=>!q))return;
const left=h.userData.hn==='left',d=P[4].distanceTo(P[8]),pp=P[4].clone().add(P[8]).multiplyScalar(.5);
if(!left){got=true;sh.set(.17,-.22,0).applyQuaternion(yawQ).add(HEAD);xrD.copy(pp).sub(sh).normalize();xrO.copy(sh);xrLv.copy(pp);xrHist.push([now,xrD.clone()]);while(xrHist.length&&now-xrHist[0][0]>400)xrHist.shift();
 if(!xrP&&d<.02){const q=(xrHist.find(a=>now-a[0]<=150)||xrHist[0])[1];xrOff.copy(q).sub(xrD);xrD.copy(q);xrP=true;pin=true;setM();down()}
 else if(xrP&&d>.038){xrP=false;up()}else if(xrP){xrD.add(xrOff).normalize();pin=true;setM();dragStep()}else setM()}
else{if(d<.025){if(!lw.on){lw.on=true;lw.s.copy(pp)}const v=pp.clone().sub(lw.s).applyQuaternion(yawQ.clone().invert());walk.f=cl(-v.z*6,-1,1);walk.s=cl(v.x*6,-1,1);ctl.pin=true}else lw.on=false}
ghostDraw(left?1:0,P.map(q=>C.worldToLocal(q)));HW[left?0:1]=P;if(window.tmPoke)tmPoke(P,left?10:20)});
if(window.tmXR)tmXR(HW,frame,now);if(!got)XC.forEach(c=>{const u=c.userData;if(u.hand||!u.hn)return;
 if(u.hn!=='left'){got=true;xrO.copy(c.position).applyMatrix4(rig.matrixWorld);xrD.set(0,0,-1).applyQuaternion(c.quaternion);xrLv.copy(xrO);setM();
  if(u.sel&&!xrCS){xrCS=true;pin=true;down()}else if(u.sel){pin=true;dragStep()}else if(xrCS){xrCS=false;up()}}
 else if(u.gp&&u.gp.axes){const a=u.gp.axes;walk.s=cl(a[2]||0,-1,1);walk.f=cl(-(a[3]||0),-1,1)}});
if(!got){if(xrP){xrP=false;up()}xrO.copy(HEAD);xrD.set(0,0,-1).applyQuaternion(qq);xrLv.copy(HEAD).addScaledVector(xrD,.3);setM()}}
async function entrarXR(mode){try{const s=await navigator.xr.requestSession(mode,{optionalFeatures:['local-floor','bounded-floor','hand-tracking','plane-detection']});R.xr.setReferenceSpaceType('local-floor');await R.xr.setSession(s);
XR_ON=true;start=true;document.getElementById('wel').style.display='none';if(!wins.length){openWin('dock');openWin('browser')}
rig.position.set(0,s.enabledFeatures&&s.enabledFeatures.indexOf('local-floor')>=0?0:1.6,0);if(mode==='immersive-ar'){sky.visible=false;gridH.visible=false}
s.addEventListener('end',()=>{XR_ON=false;rig.position.set(0,0,0);C.position.set(0,1.6,0);sky.visible=true;gridH.visible=true;walk.f=walk.s=0;SK.forEach(k=>k.g.visible=false);R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight)})}
catch(e){document.getElementById('err').textContent='WebXR: '+(e.message||e)}}
if(navigator.xr)[['xrvr','immersive-vr'],['xrar','immersive-ar']].forEach(a=>navigator.xr.isSessionSupported(a[1]).then(ok=>{const b=document.getElementById(a[0]);if(ok&&b){b.style.display='inline-block';b.onclick=()=>entrarXR(a[1])}}).catch(()=>{}));
