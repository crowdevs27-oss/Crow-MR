// Quest Mãos · 02-janelas
// ===== Janelas curvas =====
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function mkGeo(W){const n=28,r=W.r,w=W.w*W.s,h=W.h*W.s,p=[],uv=[],ix=[];
if(W.vflat){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([-w/2,h/2,-r,w/2,h/2,-r,-w/2,-h/2,-r,w/2,-h/2,-r],3));g.setAttribute('uv',new T.Float32BufferAttribute([0,1,1,1,0,0,1,0],2));g.setIndex([0,2,1,1,2,3]);return g}
if(W.flat){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([-w/2,0,-h/2,w/2,0,-h/2,-w/2,0,h/2,w/2,0,h/2],3));g.setAttribute('uv',new T.Float32BufferAttribute([0,1,1,1,0,0,1,0],2));g.setIndex([0,2,1,1,2,3]);return g}
for(let j=0;j<=1;j++)for(let i=0;i<=n;i++){const u=i/n,a=(u-.5)*w/r;p.push(r*Math.sin(a),(.5-j)*h,-r*Math.cos(a));uv.push(u,1-j)}
for(let i=0;i<n;i++)ix.push(i,i+n+1,i+1,i+1,i+n+1,i+n+2);
const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);return g}
function place(W){W.theta=Math.atan2(Math.sin(W.theta),Math.cos(W.theta));W.mesh.rotation.y=-W.theta;W.mesh.position.set(W.px||0,W.y,W.pz||0);W.mesh.updateMatrixWorld()}
// Janelas ficam presas ao MUNDO: pivô = onde foram abertas; andar (6DoF) não as leva junto. Arrastar usa a interseção do raio com o cilindro da janela.
function headYaw(){const q=new T.Quaternion(),p=new T.Vector3(),s=new T.Vector3();C.matrixWorld.decompose(p,q,s);return new T.Euler().setFromQuaternion(q,'YXZ').y}
function cylHit(W,o,d){const ox=o.x-W.px,oz=o.z-W.pz,a=d.x*d.x+d.z*d.z,b=2*(ox*d.x+oz*d.z),c=ox*ox+oz*oz-W.r*W.r,k=b*b-4*a*c;if(a<1e-6||k<0)return null;const q=Math.sqrt(k),t1=(-b-q)/(2*a),t=t1>0?t1:(-b+q)/(2*a);return{th:Math.atan2(ox+t*d.x,-(oz+t*d.z)),y:o.y+t*d.y}}
function rebuild(W){W.mesh.geometry.dispose();W.mesh.geometry=mkGeo(W)}
const CFG={browser:{w:1.7,h:1.1,y:1.75,r:1.8,t:'Navegador',bar:56},kbd:{w:1.3,h:.62,y:1.0,r:1.0,t:'Teclado',bar:34},dock:{w:2.1,h:.2,y:.72,r:1.15,t:'Dock',bar:0},aviso:{w:1.0,h:.4,y:1.55,r:1.2,t:'',bar:0},loja:{w:1.5,h:.95,y:1.65,r:1.6,t:'Loja de apps',bar:48},app:{w:1.6,h:1.05,y:1.65,r:1.8,t:'App',bar:44}};
function openWin(kind,o={}){let W=kind!=='app'&&wins.find(w=>w.kind===kind);if(W){setFocus(W);return W}
if(wins.length>=6&&kind!=='kbd'&&kind!=='aviso'&&kind!=='app'){toast('Máximo de 6 janelas');return}
const f=CFG[kind];W=Object.assign({kind,w:f.w,h:f.h,y:HEAD.y+f.y-1.6,r:f.r,title:f.t,bar:f.bar,theta:-headYaw(),px:HEAD.x,pz:HEAD.z,vflat:kind==='browser',ctop:kind==='browser'?124:0,cpad:kind==='browser'?16:0,s:1,regs:[],hk:null,op:0},o);
W.cv=document.createElement('canvas');W.cv.width=W.cvw||Math.round(W.w*700);W.cv.height=W.cvh||Math.round(W.h*700);W.x=W.cv.getContext('2d');W.tex=new T.CanvasTexture(W.cv);W.tex.generateMipmaps=false;W.tex.minFilter=T.LinearFilter;
W.mesh=new T.Mesh(mkGeo(W),new T.MeshBasicMaterial({map:W.tex,transparent:true,alphaTest:.02,side:2,opacity:0}));W.mesh.userData.W=W;S.add(W.mesh);
if(kind==='browser'){W.custom=1;W.web=1;W.tabs=[newTab('meta://inicio')];W.ti=0;W.addr='meta://inicio';W.notes='';W.g={x:.5,y:.5,s:0}}
if(kind==='kbd'){W.sh=false;W.pk=null}
wins.push(W);place(W);draw(W);setFocus(W);snd(520);return W}
function closeW(W){if(W.fr)W.fr.remove();S.remove(W.mesh);W.mesh.geometry.dispose();wins.splice(wins.indexOf(W),1);if(foc&&foc.W===W)foc=null;focus=wins.filter(w=>w.kind!=='dock').pop()||null;snd(300)}
function setFocus(W){focus=W;wins.forEach(w=>{w.mesh.renderOrder=w===W?5:1;draw(w)})}
function btn(W,k,x,y,w,h,l,f,on,fs=22){const c=W.x;W.regs.push({k,x,y,w,h,f});c.fillStyle=on?'#2f6fe4':(W.hk===k||(W.hs&&W.hs.has(k)))?'rgba(255,255,255,.3)':'rgba(255,255,255,.1)';rr(c,x,y,w,h,12);c.fill();c.fillStyle='#fff';c.font=fs+'px system-ui';c.textAlign='center';c.textBaseline='middle';if(l.slice(0,2)==='@:')ico(c,l.slice(2),x+w/2,y+h/2-(h>90?10:0),Math.min(w,h)*(h>90?.3:.36));else c.fillText(l,x+w/2,y+h/2,w-8)}
function chrome(W){const c=W.x,w=W.cv.width,h=W.cv.height;c.clearRect(0,0,w,h);c.fillStyle='rgba(20,22,30,.93)';rr(c,0,0,w,h,26);c.fill();c.strokeStyle=W===focus?'rgba(120,170,255,.85)':'rgba(255,255,255,.15)';c.lineWidth=3;c.stroke();
if(W.bar&&!W.custom){c.fillStyle='#cde';c.font='bold 22px system-ui';c.textAlign='left';c.textBaseline='middle';if(W.kind!=='kbd'){ico(c,'grip',22,W.bar/2,9,'#9ab');c.fillText(W.title,44,W.bar/2)}else c.fillText(W.title,24,W.bar/2);btn(W,'x',w-64,5,52,W.bar-10,'@:close',()=>closeW(W),0);if(W.kind!=='kbd')btn(W,'mn',w-124,5,52,W.bar-10,'@:min',()=>minimizar(W),0)}
c.fillStyle='rgba(255,255,255,.4)';rr(c,w/2-50,h-14,100,6,3);c.fill();c.font='18px system-ui';c.textAlign='right';c.fillText('◢',w-12,h-14)}
const DR={};function draw(W){W.regs=[];chrome(W);DR[W.kind](W);W.tex.needsUpdate=true}
function wrap(c,t,x,y,mw,lh){let yy=y;t.split('\n').forEach(l=>{let line='';l.split(' ').forEach(wd=>{if(c.measureText(line+wd).width>mw&&line){c.fillText(line,x,yy);yy+=lh;line=''}line+=wd+' '});c.fillText(line,x,yy);yy+=lh})}
// Ícones vetoriais (não dependem de fontes/emoji do aparelho). Em rótulos: "@:nome".
function ico(c,n,x,y,s,col){c.save();c.translate(x,y);c.strokeStyle=c.fillStyle=col||'#fff';c.lineWidth=Math.max(2,s*.16);c.lineCap=c.lineJoin='round';
const P=(...a)=>{c.beginPath();for(let i=0;i<a.length;i+=2)i?c.lineTo(a[i]*s,a[i+1]*s):c.moveTo(a[i]*s,a[i+1]*s);c.stroke()},O=(a,b,r)=>{c.beginPath();c.arc(a*s,b*s,r*s,0,6.3);c.stroke()};
switch(n){case'back':P(.9,0,-.9,0);P(-.3,-.6,-.9,0,-.3,.6);break;case'fwd':P(-.9,0,.9,0);P(.3,-.6,.9,0,.3,.6);break;case'up':P(-.7,.35,0,-.35,.7,.35);break;case'down':P(-.7,-.35,0,.35,.7,-.35);break;
case'close':P(-.6,-.6,.6,.6);P(.6,-.6,-.6,.6);break;case'min':P(-.7,0,.7,0);break;case'plus':P(-.7,0,.7,0);P(0,-.7,0,.7);break;
case'reload':c.beginPath();c.arc(0,0,.7*s,.6,5.5);c.stroke();P(.2,-.95,.6,-.55,.95,-.9);break;case'home':P(-.85,0,0,-.75,.85,0);P(-.6,-.05,-.6,.7,.6,.7,.6,-.05);break;
case'search':O(-.15,-.15,.5);P(.2,.2,.75,.75);break;case'kbd':c.strokeRect(-.9*s,-.55*s,1.8*s,1.1*s);[-.6,-.2,.2,.6].forEach(a=>c.fillRect((a-.07)*s,-.3*s,.14*s,.14*s));c.fillRect(-.5*s,.1*s,1*s,.14*s);break;
case'globe':O(0,0,.8);c.beginPath();c.ellipse(0,0,.35*s,.8*s,0,0,6.3);c.stroke();P(-.8,0,.8,0);break;case'cam':c.strokeRect(-.85*s,-.5*s,1.7*s,1.1*s);O(0,.05,.3);break;
case'compass':O(0,0,.8);c.beginPath();c.moveTo(0,-.55*s);c.lineTo(.2*s,.1*s);c.lineTo(-.2*s,.1*s);c.closePath();c.fill();break;case'target':O(0,0,.8);O(0,0,.4);c.beginPath();c.arc(0,0,.1*s,0,6.3);c.fill();break;
case'cart':P(-.9,-.7,-.6,-.7,-.3,.3,.6,.3,.8,-.35,-.5,-.35);O(-.2,.65,.12);O(.5,.65,.12);break;case'app':[[-.7,-.7],[.1,-.7],[-.7,.1],[.1,.1]].forEach(a=>c.strokeRect(a[0]*s,a[1]*s,.6*s,.6*s));break;
case'win':c.strokeRect(-.8*s,-.5*s,1.1*s,1*s);c.strokeRect(-.3*s,-.8*s,1.1*s,1*s);break;case'ext':P(.1,-.8,.8,-.8,.8,-.1);P(.8,-.8,-.1,.1);P(-.2,-.6,-.8,-.6,-.8,.8,.6,.8,.6,.2);break;
case'shift':P(0,.7,0,-.5);P(-.55,0,0,-.6,.55,0);break;case'bksp':P(.9,-.5,-.3,-.5,-.9,0,-.3,.5,.9,.5,.9,-.5);P(-.1,-.2,.4,.2);P(.4,-.2,-.1,.2);break;case'enter':P(.8,-.6,.8,.1,-.7,.1);P(-.3,-.3,-.7,.1,-.3,.5);break;
case'mic':c.beginPath();c.arc(0,-.3*s,.3*s,Math.PI,0);c.lineTo(.3*s,.1*s);c.arc(0,.1*s,.3*s,0,Math.PI);c.closePath();c.stroke();P(-.55,0,-.55,.2,0,.65,.55,.2,.55,0);P(0,.65,0,.95);break;
case'grip':P(-.6,-.35,.6,-.35);P(-.6,0,.6,0);P(-.6,.35,.6,.35);break;case'aa':c.font='bold '+Math.round(s*1.1)+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('Aa',0,0);break}c.restore()}
