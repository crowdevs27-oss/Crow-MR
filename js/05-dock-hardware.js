// Quest Mãos · 05-dock-hardware
// ===== Dock =====
DR.dock=W=>{const c=W.x,w=W.cv.width;const it=[['@:globe','Navegador',()=>openWin('browser')],['@:kbd','Teclado',()=>iniciarTeclado()],['@:cart','Loja',()=>openWin('loja')],['@:cam','Passthrough',pass],['@:compass','Giroscópio',enGyro],['@:target','Recentrar',recenter],['@:plus','Curva +',()=>curve(1)],['@:min','Curva −',()=>curve(-1)]];
wins.filter(w=>w.min).forEach(w=>it.push([w.kind==='app'?'@:app':'@:win',w.title.slice(0,11),()=>restaurar(w)]));
it.forEach((b,i)=>{btn(W,'d'+i,14+i*128,12,120,104,b[0],b[2],0,38);c.font='15px system-ui';c.fillStyle='#cde';c.textAlign='center';c.fillText(b[1],14+i*128+60,100)});
c.fillStyle='#fff';c.font='bold 30px system-ui';c.fillText(new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),w-100,50);c.font='16px system-ui';c.fillText('🔋 87% · Wi‑Fi',w-100,86)};
function curve(d){const W=focus&&focus.kind!=='dock'?focus:wins.find(w=>w.kind==='browser');if(!W)return;W.r=cl(W.r*(d>0?1.15:.87),.8,4);rebuild(W);snd(440)}
// ===== Hardware =====
const e1=new T.Euler(),q1=new T.Quaternion(-Math.SQRT1_2,0,0,Math.SQRT1_2),dq=new T.Quaternion();let gy=0;
function devQ(){e1.set(gyro[1]*D,gyro[0]*D,-gyro[2]*D,'YXZ');dq.setFromEuler(e1);dq.multiply(q1);dq.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),-((screen.orientation&&screen.orientation.angle)||0)*D));gy=new T.Euler().setFromQuaternion(dq,'YXZ').y}
async function enGyro(){try{if(typeof DeviceOrientationEvent!=='undefined'&&DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!=='granted')return toast('Giroscópio negado');
addEventListener('deviceorientation',e=>{if(e.alpha!=null){gyro=[e.alpha,e.beta,e.gamma];gOn=true}});toast('Giroscópio ativo (mova o aparelho)')}catch(e){toast('Giroscópio indisponível')}}
function recenter(){if(gOn&&gyro){yawOff=gy;yaw=0}else{yaw=0;pitch=0}toast('Vista recentralizada')}
const vid=document.createElement('video');vid.playsInline=true;vid.muted=true;
function pass(){if(!vid.srcObject)return toast('Câmera ainda não ativa');if(pass_){S.background=null;sky.visible=true;pass_=false;return}const t=new T.VideoTexture(vid);t.wrapS=T.RepeatWrapping;t.repeat.x=-1;t.offset.x=1;S.background=t;sky.visible=false;pass_=true}
