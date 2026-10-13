// Quest Mãos · 00b-ponte-nativa — só ativa dentro do app Android que expõe window.NativeApp (addWebMessageListener). window.open("ext:") passa a pedir ao Android para abrir o link fora.
(function(){const N=window.NativeApp;if(!N)return;window.open=u=>{N.postMessage(JSON.stringify({t:'abrir',url:String(u)}));return null}})();
