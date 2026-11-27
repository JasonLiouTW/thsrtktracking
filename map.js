// 地圖圖層、中心線、里程標籤與標記
let map,me,acc,snap,nose,line,labGroup,labT=0,noseOn=false;
function initMap(){
 const nlsc=L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP5_OPENDATA/default/GoogleMapsCompatible/{z}/{y}/{x}',{maxZoom:19,attribution:'© 內政部國土測繪中心'});
 const osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'});
 map=L.map('map',{layers:[nlsc],zoomControl:false}).setView([24.1,120.9],8);
 L.control.layers({'NLSC':nlsc,'OpenStreetMap':osm},null,{position:'topright'}).addTo(map);
 L.control.zoom({position:'topleft'}).addTo(map);
 let tileErr=0;nlsc.on('tileerror',()=>{if(++tileErr===6&&map.hasLayer(nlsc)){map.removeLayer(nlsc);osm.addTo(map)}});
 const pts=[];for(let i=0;i<n;i++)pts.push([LA[i],LO[i]]);
 line=L.polyline(pts,{color:'#E4661F',weight:4,opacity:.9}).addTo(map);
 labGroup=L.layerGroup().addTo(map);
 map.on('moveend zoomend',()=>{if(!labT)labT=setTimeout(()=>{labT=0;buildLabels()},500)});
 map.fitBounds(line.getBounds());buildLabels();
 const dot=(r,c,w)=>L.circleMarker([0,0],{radius:r,color:'#fff',weight:w,fillColor:c,fillOpacity:1});
 me=dot(8,'#1763E6',3);snap=dot(6,'#E4661F',2);nose=dot(6,'#E11D48',2);
 acc=L.circle([0,0],{radius:1,color:'#1763E6',weight:1,fillOpacity:.12})}
// 標籤密度依縮放調整（500 m ~ 50 km），只畫畫面附近的
function buildLabels(){labGroup.clearLayers();
 const mpp=143000/Math.pow(2,map.getZoom()),step=[500,1000,2000,5000,10000,20000,50000].find(s=>s/mpp>=50)||50000,b=map.getBounds().pad(.2);
 for(let ch=Math.ceil(CH[0]/step)*step;ch<=CH[n-1];ch+=step){const p=llAt(ch);if(!b.contains(p))continue;
  const km=Math.floor(Math.abs(ch)/1000),m=Math.abs(ch)%1000,tx=(ch<0?'−':'')+'K'+km+(m?'+'+String(m).padStart(3,'0'):'');
  L.circleMarker(p,{radius:3,color:'#fff',weight:1,fillColor:'#E4661F',fillOpacity:1}).bindTooltip(tx,{permanent:true,direction:'right',className:'k',offset:[6,0]}).addTo(labGroup)}}
