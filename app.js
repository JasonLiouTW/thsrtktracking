// 主程式：定位資料處理（有效性檢查）、畫面更新、按鈕與語言切換
const MAXOFF=200,MAXKMH=350;   // 偏離中心線 >200 m 或速度 >350 km/h 視為無效定位
let lastRecv=0,follow=true,first=true,watchId=null,locating=false,bad=null,cur=null,s2i=null,lastTxt='',lastLab='';

/* ---------- 畫面文字（會隨語言重繪） ---------- */
const renderGo=()=>{$('go').textContent=t(locating?'go_on':'go')};
const renderFol=()=>{$('fol').textContent=t(follow?'fol_on':'fol_off')};
const renderTz=()=>{$('tlab').textContent=t('tlab',Intl.DateTimeFormat().resolvedOptions().timeZone)};
function renderStatus(){if(!cur)return;$('s1').className=cur.cls;$('s1').textContent=t(cur.key,...cur.a)}
function setStatus(cls,key,...a){if(cur&&cur.cls===cls&&cur.key===key&&String(cur.a)===String(a))return;cur={cls,key,a};renderStatus()}
function renderS2(){if(!s2i)return;const[d,a]=s2i;$('s2').textContent=t('s2',d<1000?Math.round(d)+' m':(d/1000).toFixed(1)+' km',Math.round(a))}
function refreshAll(){applyStatic();renderTz();renderGo();renderFol();setDemoBtn();setPanel();renderComp();renderStatus();renderS2();lastLab=''}
function setLang(l){LANG=l;try{localStorage.setItem('hsrlang',l)}catch(e){}refreshAll()}

/* ---------- 每次定位 ---------- */
function update(la,lo,accu,speed,ts){
 const[x,y]=proj(la,lo),q=nearest(x,y);
 let v=(speed==null||isNaN(speed))?null:speed,cand=null;
 if(v==null&&prev&&ts>prev.ts){const d=Math.hypot(x-prev.x,y-prev.y)/((ts-prev.ts)/1000);cand=sp==null?d:sp*.5+d*.5;v=cand}
 const kmh=v==null?0:v*3.6;
 if(q.d>MAXOFF||kmh>MAXKMH){
  bad=q.d>MAXOFF?{key:'bad_off',a:[Math.round(q.d)]}:{key:'bad_speed',a:[Math.round(kmh)]};
  setStatus('bad',bad.key,...bad.a);freeze();return}
 if(bad){bad=null;setStatus('ok','st_ok')}
 if(frozen){frozen=false;resetSmooth();v=(speed==null||isNaN(speed))?null:speed;cand=null}
 lastRecv=Date.now();lastIdx=q.i;
 if(cand!=null)sp=cand;
 prev={x,y,ts};
 if(v!=null)$('spd').innerHTML=Math.round(v*3.6)+'<small>km/h</small>';
 fix(q.ch,ts);posFix(x,y,ts);
 if(v!=null&&v>1&&Math.abs(sm.rate)>.5){const nd=sm.rate>0?1:-1;if(nd!==trainDir){trainDir=nd;renderComp()}}   // 依里程趨勢判斷方向
 const ll=[la,lo];me.setLatLng(ll);acc.setLatLng(ll).setRadius(accu||1);snap.setLatLng([q.la,q.lo]);
 if(!map.hasLayer(me)){acc.addTo(map);snap.addTo(map);me.addTo(map)}
 if(first){map.setView(ll,16);first=false}
 s2i=[q.d,accu||0];renderS2()}

/* ---------- 每個畫面影格：平滑里程、車鼻補償、地圖跟隨 ---------- */
function loop(){const now=performance.now();
 if(sm.base!=null){const raw=disp(now),ok=comp.car!=null&&trainDir!==0,shown=ok?raw+trainDir*noseDist(comp.model,comp.car,trainDir):raw,s=fmt(shown);
  if(s!==lastTxt){lastTxt=s;$('mil').textContent=s}
  const lb=comp.car==null?t('mlab'):ok?t('mlab_nose',trainDir):t('mlab_wait');
  if(lb!==lastLab){lastLab=lb;$('mlab').textContent=lb}
  if(ok){nose.setLatLng(llAt(Math.min(CH[n-1],Math.max(CH[0],shown))));if(!noseOn){nose.addTo(map);noseOn=true}}else if(noseOn){map.removeLayer(nose);noseOn=false}}
 if(ps.base&&!first){const[px,py]=pdisp(now),ll=unproj(px,py);me.setLatLng(ll);acc.setLatLng(ll);if(sm.base!=null)snap.setLatLng(llAt(disp(now)));if(follow)map.panTo(ll,{animate:false})}
 requestAnimationFrame(loop)}

/* ---------- GPS ---------- */
function start(){locating=true;renderGo();stopDemo();
 if(!navigator.geolocation){setStatus('bad','err_nosupport');return}
 if(watchId!=null)navigator.geolocation.clearWatch(watchId);
 watchId=navigator.geolocation.watchPosition(p=>{if(!demo.on)update(p.coords.latitude,p.coords.longitude,p.coords.accuracy,p.coords.speed,p.timestamp)},
  e=>setStatus('bad',e.code===1?'err_perm':'err_pos'),{enableHighAccuracy:true,maximumAge:0,timeout:20000});
 getWL()}
async function getWL(){try{if('wakeLock' in navigator)await navigator.wakeLock.request('screen')}catch(e){}}
function statusTick(){
 if(demo.on){if(lastRecv)setStatus('ok',demo.run?'st_demo':'st_demo_paused');return}
 if(bad){setStatus('bad',bad.key,...bad.a);return}
 if(!lastRecv)return;
 const s=Math.round((Date.now()-lastRecv)/1000);
 s>5?setStatus('bad','st_lost',s):setStatus('ok','st_ok')}
function openGoogleMap(){if(!ps.base){setStatus('bad','err_nopos');return}
 const[la,lo]=unproj(...pdisp(performance.now()));
 window.open('https://www.google.com/maps/search/?api=1&query='+la.toFixed(6)+','+lo.toFixed(6),'_blank','noopener')}

/* ---------- 按鈕 ---------- */
function closeComp(){$('cpanel').hidden=true;$('dpanel').style.display=''}
function wire(){
 $('go').onclick=start;$('gmap').onclick=openGoogleMap;$('lang').onclick=()=>setLang(LANG==='zh'?'ja':'zh');
 $('fol').onclick=()=>{follow=!follow;renderFol();if(follow&&me.getLatLng().lat)map.panTo(me.getLatLng())};
 map.on('dragstart',()=>{follow=false;renderFol()});
 // 車廂補償
 $('carb').onclick=()=>{const open=$('cpanel').hidden;$('cpanel').hidden=!open;$('dpanel').style.display=open?'none':'';renderComp()};
 $('cx').onclick=closeComp;
 $('coff').onclick=()=>{comp.car=null;saveComp();renderComp()};
 $('m700').onclick=()=>{comp.model='700T';saveComp();renderComp()};$('mN7').onclick=()=>{comp.model='N700ST';saveComp();renderComp()};
 for(let k=1;k<=12;k++)$('c'+k).onclick=()=>{comp.car=k;saveComp();renderComp()};
 // Demo Run
 $('demo').onclick=()=>{closeComp();toggleDemo()};$('dx').onclick=stopDemo;$('dr').onclick=()=>setRun(!demo.run);
 $('dN').onclick=()=>{demo.dir=-1;setPanel()};$('dS').onclick=()=>{demo.dir=1;setPanel()};
 $('dm').onclick=()=>{if(demo.si>0)demo.si--;setPanel()};$('dp').onclick=()=>{if(demo.si<SPEEDS.length-1)demo.si++;setPanel()};
 map.on('click',e=>{if(!demo.on)return;lastIdx=-1;const[x,y]=proj(e.latlng.lat,e.latlng.lng),q=nearest(x,y);simReset(q.ch);simEmit(demo.run?SPEEDS[demo.si]/3.6:0)})}

/* ---------- 啟動 ---------- */
(async()=>{
 setStatus('','st_init');refreshAll();
 const tick=()=>{$('tm').textContent=new Date().toLocaleTimeString('en-GB',{hourCycle:'h23'})};tick();setInterval(tick,1000);
 try{initTrack(await(await fetch('hsr-data.json')).json());initMap()}catch(e){console.error(e);setStatus('bad','err_load');return}
 wire();loop();setInterval(statusTick,1000);
 if(location.search.includes('demo')){enterDemo();setRun(true)}})();
