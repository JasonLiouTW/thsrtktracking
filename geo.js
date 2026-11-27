// 里程座標與幾何：投影、最近點、里程內插
let n=0,CH,LA,LO,X,Y,lastIdx=-1;
const LAT0=24,KX=111320*Math.cos(LAT0*Math.PI/180),KY=110574;
const proj=(la,lo)=>[(lo-120.9)*KX,(la-LAT0)*KY];
const unproj=(x,y)=>[y/KY+LAT0,x/KX+120.9];
function initTrack(D){
 n=D.length/3;CH=new Float64Array(n);LA=new Float64Array(n);LO=new Float64Array(n);X=new Float64Array(n);Y=new Float64Array(n);
 for(let i=0;i<n;i++){CH[i]=D[3*i];LA[i]=D[3*i+1];LO[i]=D[3*i+2];[X[i],Y[i]]=proj(LA[i],LO[i])}}
const fmt=ch=>{const a=Math.abs(Math.round(ch));return(ch<0?'−':'')+'K'+Math.floor(a/1000)+'+'+String(a%1000).padStart(3,'0')};
function seg(ch){let lo=0,hi=n-2;while(lo<hi){const m=(lo+hi+1)>>1;if(CH[m]<=ch)lo=m;else hi=m-1}return lo}
function llAt(ch){const i=seg(ch),f=Math.min(1,Math.max(0,(ch-CH[i])/(CH[i+1]-CH[i])));return[LA[i]+(LA[i+1]-LA[i])*f,LO[i]+(LO[i+1]-LO[i])*f]}
// 找最近的線段並內插里程（先搜上次位置前後 80 段，太遠再全線搜尋）
function nearest(px,py){
 let lo=0,hi=n-2;if(lastIdx>=0){lo=Math.max(0,lastIdx-80);hi=Math.min(n-2,lastIdx+80)}
 let best=null;
 for(let pass=0;pass<2;pass++){
  for(let i=lo;i<=hi;i++){const ax=X[i],ay=Y[i],bx=X[i+1]-ax,by=Y[i+1]-ay,l2=bx*bx+by*by;let u=l2?((px-ax)*bx+(py-ay)*by)/l2:0;u=u<0?0:u>1?1:u;
   const qx=ax+bx*u,qy=ay+by*u,d=Math.hypot(px-qx,py-qy);if(!best||d<best.d)best={d,i,t:u,ch:CH[i]+u*(CH[i+1]-CH[i]),la:LA[i]+u*(LA[i+1]-LA[i]),lo:LO[i]+u*(LO[i+1]-LO[i])}}
  if(pass===0&&best.d>1500&&(lo>0||hi<n-2)){lo=0;hi=n-2;best=null}else break}
 return best}
