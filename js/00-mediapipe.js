// Quest Mãos · 00-mediapipe — IA local (lib/): window.criarHL() = HandLandmarker (reserva) e window.criarOD() = ObjectDetector (acha a mesa p/ o teclado).
// Script comum + import() dinâmico com URL absoluta: funciona em http://localhost, WebViewAssetLoader e Capacitor (não em file://).
const _mp=()=>window._mpv||(window._mpv=(async()=>{const B=new URL('.',location.href).href,v=await import(B+'lib/mediapipe/vision_bundle.js'),fs=await v.FilesetResolver.forVisionTasks(B+'lib/mediapipe/wasm');return{B,v,fs}})());
window.criarHL=async()=>{const{B,v,fs}=await _mp();let soft=true;try{const g=document.createElement('canvas').getContext('webgl'),x=g&&g.getExtension('WEBGL_debug_renderer_info'),rn=x?String(g.getParameter(x.UNMASKED_RENDERER_WEBGL)):'';soft=!g||/swiftshader|llvmpipe|software|virtualbox|vmware|basic render/i.test(rn)}catch(e){}
const mk=d=>v.HandLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:B+'lib/hand_landmarker.task',delegate:d},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.5});
if(soft)return await mk('CPU');try{return await mk('GPU')}catch(e){return await mk('CPU')}};
// Modelo: lib/models/efficientdet_lite0.tflite (offline/APK); se não existir, baixa do Google (precisa de internet).
window.criarOD=async()=>{const{B,v,fs}=await _mp(),urls=[B+'lib/models/efficientdet_lite0.tflite','https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite'];let er;
for(const u of urls){try{return await v.ObjectDetector.createFromOptions(fs,{baseOptions:{modelAssetPath:u,delegate:'CPU'},runningMode:'VIDEO',scoreThreshold:.2,maxResults:8,categoryAllowlist:['dining table']})}catch(e){er=e}}throw er};
