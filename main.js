const dashboardVideo = document.getElementById('varVideo');
const monitorVideo = document.getElementById('monitorVideo') || null;
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 562;
let laatsteVerdediger = null;
let poses = [];
let posenetModel = null;
const channel = new BroadcastChannel('var_channel');

if(dashboardVideo){
  document.getElementById('slowMoBtn').onclick = () => dashboardVideo.playbackRate = 0.25;
  document.getElementById('normalBtn').onclick = () => dashboardVideo.playbackRate = 1;
  document.getElementById('frameBackBtn').onclick = () => dashboardVideo.currentTime -= 1/60;
  document.getElementById('frameForwardBtn').onclick = () => dashboardVideo.currentTime += 1/60;
  document.getElementById('decisionBtn').onclick = () => { laatsteVerdediger=null; drawOverlay(); sendState(); };
  canvas.addEventListener('click', e=>{ laatsteVerdediger = e.clientX - canvas.getBoundingClientRect().left; drawOverlay(); sendState(); });
  dashboardVideo.addEventListener('timeupdate', ()=>{ drawOverlay(); sendState(); });
  async function loadPoseNet(){ posenetModel = await posenet.load(); detectPose(); }
  async function detectPose(){ if(!posenetModel) return; const pose = await posenetModel.estimateSinglePose(dashboardVideo,{flipHorizontal:false}); poses=[pose]; drawOverlay(); sendState(); requestAnimationFrame(detectPose); }
  dashboardVideo.addEventListener('play', loadPoseNet);
  function sendState(){ channel.postMessage({currentTime:dashboardVideo.currentTime, playbackRate:dashboardVideo.playbackRate, laatsteVerdediger, poses}); }
}
if(monitorVideo){ channel.onmessage = e => { const state = e.data; monitorVideo.currentTime=state.currentTime; monitorVideo.playbackRate=state.playbackRate; laatsteVerdediger=state.laatsteVerdediger; poses
