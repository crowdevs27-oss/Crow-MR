// Quest Mãos · 10-loja — Loja de apps + janelas de app (HTML em iframe sobreposto, preso ao mundo; só modo 2D).
// Os apps NÃO vêm instalados: "Baixar" busca o HTML na CDN e guarda no aparelho (IndexedDB); "Abrir" roda esse arquivo.
const CAT=[{id:'myide',nome:'MyIDE',dev:'Crow Bevs',cat:'Produtividade',desc:'IDE com várias linguagens, editor Monaco, arquivos e execução.',icone:'assets/apps/myide/icon.png',url:'https://files.catbox.moe/3jfn2i.html',w:1.9,h:1.2}];
const ABAS=['Produtividade','Jogos','Ferramentas','Instalados'],ST={},ICN={};let INST=new Set();try{INST=new Set(JSON.parse(localStorage.getItem('qm_inst')||'[]'))}catch(e){}
const saveInst=()=>{try{localStorage.setItem('qm_inst',JSON.stringify([...INST]))}catch(e){}};
const idbx=(m,k,v)=>new Promise((ok,no)=>{const r=indexedDB.open('qm_apps',1);r.onupgradeneeded=()=>r.result.createObjectStore('h');r.onerror=()=>no(r.error);r.onsuccess=()=>{const s=r.result.transaction('h',m==='get'?'readonly':'readwrite').objectStore('h'),q=m==='get'?s.get(k):m==='set'?s.put(v,k):s.delete(k);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)}});
function icone(a){if(!ICN[a.id]){const im=new Image();im.onload=redrawLoja;im.src=a.icone;ICN[a.id]=im}return ICN[a.id]}
function redrawLoja(){wins.filter(w=>w.kind==='loja').forEach(draw)}
DR.loja=W=>{const c=W.x,w=W.cv.width;W.tab=W.tab||'Produtividade';
ABAS.forEach((t,i)=>btn(W,'tb'+i,20+i*230,56,220,44,t,()=>{W.tab=t;draw(W)},t===W.tab,20));
const L=CAT.filter(a=>W.tab==='Instalados'?INST.has(a.id):a.cat===W.tab);c.textAlign='left';c.textBaseline='middle';
if(!L.length){c.fillStyle='#889';c.font='24px system-ui';c.fillText(W.tab==='Instalados'?'Você ainda não baixou nenhum app.':'Nenhum app nesta aba ainda.',40,200)}
L.forEach((a,i)=>{const y=120+i*150,s=ST[a.id],fail=s&&/^Falhou/.test(s);c.fillStyle='rgba(255,255,255,.07)';rr(c,20,y,w-40,132,18);c.fill();const im=icone(a);if(im.complete&&im.naturalWidth){c.save();rr(c,36,y+16,100,100,20);c.clip();c.drawImage(im,36,y+16,100,100);c.restore()}
c.fillStyle='#fff';c.font='bold 30px system-ui';c.fillText(a.nome,156,y+34);c.fillStyle='#9ab';c.font='18px system-ui';c.fillText(a.dev+' · '+a.cat+(INST.has(a.id)?' · Instalado':''),156,y+66);c.fillStyle='#cde';c.font='19px system-ui';c.fillText(a.desc,156,y+98,w-520);
if(INST.has(a.id)){btn(W,'ab'+a.id,w-330,y+36,150,60,'Abrir',()=>abrirApp(a.id),1,24);btn(W,'rm'+a.id,w-170,y+36,130,60,'Remover',()=>remover(a.id),0,20)}
else btn(W,'dl'+a.id,w-250,y+36,210,60,s&&!fail?s:'Baixar',()=>{if(!s||fail)baixar(a.id)},0,24);
if(fail){c.fillStyle='#f88';c.font='16px system-ui';c.textAlign='right';c.fillText(s,w-40,y+120,w-200);c.textAlign='left'}})};
async function baixar(id){const a=CAT.find(x=>x.id===id);ST[id]='Baixando…';redrawLoja();
try{let h;try{h=await fx(a.url,25000)}catch(e){h=await fx('https://api.allorigins.win/raw?url='+encodeURIComponent(a.url),25000)}
if(!h||h.length<500||!/<html|<!doctype/i.test(h))throw new Error('arquivo inválido');await idbx('set','app:'+id,h);INST.add(id);saveInst();ST[id]='';toast(a.nome+' baixado ✓');snd(880)}
catch(e){ST[id]='Falhou: '+(e&&e.message||'sem conexão')}redrawLoja()}
function remover(id){idbx('del','app:'+id).catch(()=>{});INST.delete(id);saveInst();wins.filter(w=>w.appId===id).forEach(closeW);redrawLoja()}
async function abrirApp(id){const a=CAT.find(x=>x.id===id);if(XR_ON)return toast('Apps HTML só funcionam no modo 2D (não dentro do headset)');const ex=wins.find(w=>w.kind==='app'&&w.appId===id);if(ex){setFocus(ex);return}
let h;try{h=await idbx('get','app:'+id)}catch(e){}if(!h){INST.delete(id);saveInst();redrawLoja();return toast('Arquivo do app não encontrado. Baixe de novo.')}
const W=openWin('app',{vflat:true,title:a.nome,appId:id,w:a.w,h:a.h});if(!W)return;
const f=document.createElement('iframe');f.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads');f.style.cssText='position:fixed;left:0;top:0;border:0;background:#0f1218;transform-origin:0 0;z-index:2;pointer-events:none;display:none;width:'+W.cv.width+'px;height:'+(W.cv.height-W.bar-26)+'px';f.srcdoc=h;document.body.appendChild(f);W.fr=f}
DR.app=W=>{W.regs.push({k:'app',x:0,y:W.bar,w:W.cv.width,h:W.cv.height-W.bar-26,f:(px,py)=>{drag={t:'adrag',W,u:px/W.cv.width,v:(py-W.bar)/(W.cv.height-W.bar-26),m0:M.y,last:M.y,moved:false}}})};
// homografia: retângulo (0,0)-(w,h) -> quadrilátero projetado na tela (TL,TR,BR,BL)
function homog(w,h,q){const x0=q[0][0],y0=q[0][1],x1=q[1][0],y1=q[1][1],x2=q[2][0],y2=q[2][1],x3=q[3][0],y3=q[3][1],dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3,den=dx1*dy2-dx2*dy1,g=(dx3*dy2-dx2*dy3)/den,k=(dx1*dy3-dx3*dy1)/den;
return 'matrix3d('+[(x1-x0+g*x1)/w,(y1-y0+g*y1)/w,0,g/w,(x3-x0+k*x3)/h,(y3-y0+k*y3)/h,0,k/h,0,0,1,0,x0,y0,0,1].join(',')+')'}
const AV=new T.Vector3();
function appsTick(){wins.forEach(W=>{if(W.kind!=='app'||!W.fr)return;const f=W.fr;if(XR_ON||W.min||W.frOn===false){f.style.display='none';return}
const w=W.w*W.s,h=W.h*W.s,ch=W.cv.height,v0=(W.ctop||W.bar)/ch,v1=(ch-26)/ch,u0=(W.cpad||0)/W.cv.width,u1=1-u0,P=[];let ok=true;
for(const q of [[u0,v0],[u1,v0],[u1,v1],[u0,v1]]){AV.set((q[0]-.5)*w,(.5-q[1])*h,-W.r);W.mesh.localToWorld(AV);if(C.worldToLocal(AV.clone()).z>-.05){ok=false;break}AV.project(C);P.push([(AV.x+1)/2*innerWidth,(1-AV.y)/2*innerHeight])}
if(!ok){f.style.display='none';return}const dd=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),ow=Math.max(820,Math.min(2200,(dd(P[0],P[1])+dd(P[3],P[2]))/2)),oh=Math.max(520,Math.min(1500,(dd(P[0],P[3])+dd(P[1],P[2]))/2)),iw=parseFloat(f.style.width),ih=parseFloat(f.style.height),tn=performance.now();
if((Math.abs(ow-iw)>iw*.07||Math.abs(oh-ih)>ih*.07)&&tn-(f._t||0)>350){f.style.width=Math.round(ow)+'px';f.style.height=Math.round(oh)+'px';f._t=tn}   // iframe com o tamanho real na tela = texto nítido
f.style.display='block';f.style.opacity=W===focus?1:.9;f.style.transform=homog(parseFloat(f.style.width),parseFloat(f.style.height),P)})}
// entrada: toque (pinça sem arrastar), rolagem (pinça + arrastar) e teclas do teclado na mesa
function appTap(W,u,v){if(W.web)return webPost(W,{t:'tap',u,v});const w=W.fr&&W.fr.contentWindow;if(!w)return;const x=u*W.fr.offsetWidth,y=v*W.fr.offsetHeight;const d=w.document,el=d.elementFromPoint(x,y);if(!el)return;const o={bubbles:true,cancelable:true,clientX:x,clientY:y,view:w,button:0,buttons:1,composed:true};
const fire=n=>el.dispatchEvent(new(n[0]==='p'?w.PointerEvent:w.MouseEvent)(n,o));['pointerdown','mousedown'].forEach(fire);w.focus();o.buttons=0;['pointerup','mouseup','click'].forEach(fire);
setTimeout(()=>{const a=d.activeElement;if(a&&(/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)||a.isContentEditable)){foc={W,f:'dom',el:a};if(!wins.some(k=>k.kind==='kbd')&&!TM.ativo)iniciarTeclado()}else if(foc&&foc.f==='dom')foc=null},80)}
function appScroll(W,u,v,dy){if(W.web)return webPost(W,{t:'scroll',u,v,dy});const x=u*W.fr.offsetWidth,y=v*W.fr.offsetHeight,w=W.fr.contentWindow,d=w.document;let el=d.elementFromPoint(x,y);if(!el)return;if(el.dispatchEvent(new w.WheelEvent('wheel',{deltaY:dy,clientX:x,clientY:y,bubbles:true,cancelable:true}))===false)return;
while(el&&el!==d.documentElement){const s=w.getComputedStyle(el);if(/(auto|scroll)/.test(s.overflowY)&&el.scrollHeight>el.clientHeight+2){el.scrollTop+=dy;return}el=el.parentElement}(d.scrollingElement||d.body).scrollTop+=dy}
function appDrag(){const d=drag;if(!d.moved&&Math.abs(M.y-d.m0)>.05)d.moved=true;if(d.moved){appScroll(d.W,d.u,d.v,(M.y-d.last)*900);d.last=M.y}}
function appUp(){const d=drag;if(!d.moved)appTap(d.W,d.u,d.v)}
function appKey(f,k){if(f.f==='web')return webPost(f.W,{t:'key',k});const w=f.W.fr&&f.W.fr.contentWindow;if(!w)return;const d=w.document,el=f.el&&d.contains(f.el)?f.el:d.activeElement;if(!el)return;w.focus();el.focus&&el.focus();const kc=k==='Enter'?13:k==='Backspace'?8:0,
ev=n=>el.dispatchEvent(new w.KeyboardEvent(n,{key:k,code:k==='Enter'||k==='Backspace'?k:'',keyCode:kc,which:kc,bubbles:true,cancelable:true,composed:true}));
if(ev('keydown')){if(k==='Backspace'){if(!d.execCommand('delete')&&el.setRangeText){try{const a=el.selectionStart,e=el.selectionEnd;if(a!==e)el.setRangeText('',a,e,'end');else if(a>0)el.setRangeText('',a-1,a,'end');el.dispatchEvent(new w.Event('input',{bubbles:true}))}catch(x){}}}
else if(!(k==='Enter'&&el.tagName==='INPUT')){const t=k==='Enter'?'\n':k;if(!d.execCommand('insertText',false,t)&&el.setRangeText){try{el.setRangeText(t,el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new w.InputEvent('input',{bubbles:true,data:t,inputType:'insertText'}))}catch(x){el.value+=t}}}}ev('keyup')}
// minimizar / restaurar (janelas minimizadas viram botões no dock)
function minimizar(W){W.min=true;W.mesh.visible=false;if(W.fr)W.fr.style.display='none';if(foc&&foc.W===W)foc=null;const d=wins.find(w=>w.kind==='dock');if(d)draw(d);snd(300)}
function restaurar(W){W.min=false;W.mesh.visible=true;setFocus(W);const d=wins.find(w=>w.kind==='dock');if(d)draw(d);snd(520)}
function webPost(W,m){try{W.fr.contentWindow.postMessage(Object.assign({qm:1},m),'*')}catch(e){}}
addEventListener('message',e=>{const W=wins.find(w=>w.fr&&w.web&&w.fr.contentWindow===e.source),d=e.data;if(!W||!d||!d.qm)return;
if(d.t==='go')go(W,d.url);else if(d.t==='focus'){foc={W,f:'web'};if(!wins.some(k=>k.kind==='kbd')&&!TM.ativo)iniciarTeclado()}else if(d.t==='blur'&&foc&&foc.f==='web')foc=null});
