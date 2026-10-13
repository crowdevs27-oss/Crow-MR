// Quest Mãos · 07-loop
// ===== Loop =====
let gaze=false;const gz={k:null,t:0};const vel=new T.Vector3(),tv=new T.Vector3(),fw=new T.Vector3(),rt=new T.Vector3(),org=new T.Vector3();let last=performance.now(),fps=60,fr=0,start=false;
function loop(t,frame){const dt=Math.min((t-last)/1e3,.1);last=t;fps+=(1/Math.max(dt,.001)-fps)*.05;fr++;if(fr%90===0&&!XR_ON){const pr=R.getPixelRatio();if(fps<24&&pr>.75)R.setPixelRatio(Math.max(.75,pr-.15));else if(fps>56&&pr<PRMAX)R.setPixelRatio(Math.min(PRMAX,pr+.1))}
if(XR_ON){xrStep(dt,frame)}else if(gOn&&gyro){devQ();C.quaternion.setFromAxisAngle(Y,yaw-yawOff).multiply(dq)}else C.quaternion.setFromEuler(eu.set(pitch,yaw,0,'YXZ'));
if(XR_ON)fw.set(0,0,-1).applyQuaternion(yawQ);else C.getWorldDirection(fw);fw.y=0;fw.normalize();rt.crossVectors(fw,Y);
tv.set(0,0,0).addScaledVector(fw,walk.f*1.6).addScaledVector(rt,walk.s*1.6);vel.lerp(tv,Math.min(1,dt*6));(XR_ON?rig:C).position.addScaledVector(vel,dt);rig.updateMatrixWorld(true);HEAD.setFromMatrixPosition(C.matrixWorld);
if(gaze)M.set(0,0);
if(start){const p=pick();let key=null;if(p.W){const r=reg(p.W,p.px,p.py);key=r?r.k:null}
if(gaze){const kk=key&&p.W.kind+key;if(kk&&kk===gz.k){if(t-gz.t>1100){gz.t=t+800;down();up()}}else{gz.k=kk||null;gz.t=t}}
if(hovW&&hovW!==p.W&&hovW.hk!==null){hovW.hk=null;draw(hovW)}hovW=p.W||null;if(p.W&&p.W.hk!==key){p.W.hk=key;draw(p.W)}
XR_ON?org.copy(xrLv):(performance.now()-seen0<200?org.copy(HP[0]):org.set(.22,-.25,-.15)).applyMatrix4(C.matrixWorld);const end=p.pt||org.clone().addScaledVector(p.dir,4);
laser.geometry.setFromPoints([org,end]);cur.position.copy(C.worldToLocal(end.clone()));cur.material.color.set(key?0x66ff99:0xffffff);cur.scale.setScalar((gaze?1.4-cl((t-gz.t)/1100,0,1)*.9:(pinch?.5:.6+cl(pdv,0,1)*.9))*Math.max(.6,cur.position.length()*.5));laser.material.color.set(pinch?0xffffff:0x66ccff)}
gm.opacity=cl((Math.max(Math.abs(HEAD.x),Math.abs(HEAD.z))-1)/.5,0,.8);guard.visible=gm.opacity>.01;
wins.forEach(w=>{const to=w===focus||w.flat?1:.82;w.op+=(to-w.op)*Math.min(1,dt*8);w.mesh.material.opacity=w.op});
if(AC&&AC.listener.positionX){AC.listener.positionX.value=HEAD.x;AC.listener.positionY.value=HEAD.y;AC.listener.positionZ.value=HEAD.z}
if(fr%10===0)document.getElementById('hud').textContent=`FPS ${fps.toFixed(0)} · mãos ${nH}\nconfiança ${(conf*100).toFixed(0)}% · latência ${lat.toFixed(0)}ms\npos ${HEAD.x.toFixed(2)} ${HEAD.y.toFixed(2)} ${HEAD.z.toFixed(2)}`;
if(window.appsTick)appsTick();R.render(S,C)}
R.setAnimationLoop(loop);
setInterval(()=>{const W=wins.find(w=>w.kind==='browser');if(W&&W.tabs[W.ti].url==='meta://jogo'&&!drag){W.g.x=.1+Math.random()*.8;W.g.y=Math.random();draw(W)}},1200);
setInterval(()=>{const d=wins.find(w=>w.kind==='dock');if(d)draw(d)},20000);
document.getElementById('nocam').onclick=()=>{gaze=true;enGyro();document.getElementById('wel').style.display='none';start=true;openWin('dock');openWin('browser')};
document.getElementById('enter').onclick=async()=>{snd(440);document.getElementById('err').textContent='Carregando modelo de mãos…';if('ontouchstart' in window)enGyro();
if(await startHands()){document.getElementById('wel').style.display='none';start=true;openWin('dock');openWin('browser')}};
