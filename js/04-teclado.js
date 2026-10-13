// Quest Mãos · 04-teclado
// ===== Teclado ABNT2 =====
const DICT='olá oi bom dia boa tarde noite obrigado como vai você tudo bem navegador quest realidade virtual janela teclado mundo casa amigo música vídeo jogo notas'.split(' ');
const mk=(a,w)=>a.split(' ').map((k,i)=>({k,w:w?w[i]:1})),NUM='1 2 3 4 5 6 7 8 9 0',BOT=a=>mk('🎤 '+a+' ␣ . - / ↵',[1.5,1.5,3,1,1,1,1]);
const LY=[mk(NUM),mk('q w e r t y u i o p'),mk('a s d f g h j k l ç'),mk('⇧ z x c v b n m ⌫',[1.5,1,1,1,1,1,1,1,1.5]),mk('á ã â é ê í ó õ ô ú'),BOT('123')];
const SY=[mk(NUM),mk('@ # $ % & - + ( ) /'),mk('. , : ; ! ? = * _ #'),mk('www. .com .br ⌫',[2.5,2.5,2.5,2.5]),mk('~ ^ < > [ ] { } | \\'),BOT('ABC')];
const gT=()=>foc&&foc.f!=='dom'&&foc.f!=='web'?(foc.f==='addr'?foc.W.addr:foc.W.notes):'',sT=s=>{if(foc&&foc.f!=='dom'&&foc.f!=='web'){foc.f==='addr'?foc.W.addr=s:foc.W.notes=s;draw(foc.W)}};
function setFoc(W,f){foc={W,f};if(f==='addr')W.sel=true;if(!wins.some(w=>w.kind==='kbd')&&!TM.ativo)iniciarTeclado();draw(W)}
function typeChar(ch){if(foc&&(foc.f==='dom'||foc.f==='web')){appKey(foc,ch);return}if(!foc)return toast('Toque em um campo de texto');if(foc.f==='addr'&&foc.W.sel){foc.W.addr='';foc.W.sel=false}sT(gT()+ch)}
function enter(){if(!foc)return;if(foc.f==='dom'||foc.f==='web'){appKey(foc,'Enter');return}if(foc.f==='addr'){const W=foc.W;foc=null;go(W,W.addr)}else typeChar('\n')}
function bs(){if(foc&&(foc.f==='dom'||foc.f==='web')){appKey(foc,'Backspace');return}if(foc&&foc.f==='addr'&&foc.W.sel){foc.W.sel=false;sT('')}else sT(gT().slice(0,-1))}
function dictate(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Ditado não suportado');try{const r=new SR();r.lang='pt-BR';r.onresult=e=>[...e.results[0][0].transcript].forEach(typeChar);r.start();toast('🎤 Ouvindo…')}catch(e){toast('Microfone indisponível')}}
const ICK={'⇧':'@:shift','⌫':'@:bksp','↵':'@:enter','🎤':'@:mic','✕':'@:close'};
DR.kbd=W=>{const w=W.cv.width,kw=(w-32)/10,txt=gT(),wd=(txt.split(/\s+/).pop()||'').toLowerCase(),sg=wd?DICT.filter(d=>d.startsWith(wd)&&d!==wd).slice(0,3):[];
for(let i=0;i<3;i++){const s=sg[i];btn(W,'s'+i,16+i*(w-32)/3,40,(w-32)/3-8,40,s||'',()=>{if(s)sT(txt.slice(0,txt.length-wd.length)+s+' ')},0,20)}
(W.sym?SY:LY).forEach((row,ri)=>{let x=(w-10*kw)/2;row.forEach(o=>{const k=o.k,id=k+ri,cw=o.w*kw,lab=ICK[k]||(k==='␣'?'espaço':(W.sh&&/^[a-zç]$/.test(k)?k.toUpperCase():k));
btn(W,id,x+3,88+ri*56,cw-6,50,lab,()=>{W.pk=id;setTimeout(()=>{W.pk=null;if(wins.includes(W))draw(W)},110);
if(k==='⇧')W.sh=!W.sh;else if(k==='⌫')bs();else if(k==='␣')typeChar(' ');else if(k==='↵')enter();else if(k==='🎤')dictate();else if(k==='123'||k==='ABC')W.sym=!W.sym;else{[...k].forEach(ch=>typeChar(W.sh&&/[a-zç]/.test(ch)?ch.toUpperCase():ch));W.sh=false}
if(wins.includes(W))draw(W)},W.pk===id||(k==='⇧'&&W.sh),k.length>3?18:22);x+=cw})})};
