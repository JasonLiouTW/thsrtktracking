// 平滑與凍結：里程 sm、位置 ps 在兩次 GPS 之間依速度推算，新定位進來時再平順修正
const sm={base:null,t0:0,rate:0,corr:0,lastCh:null,lastTs:0};
const ps={base:false,bx:0,by:0,t0:0,vx:0,vy:0,cx:0,cy:0,lx:0,ly:0,lts:0};
let frozen=false,prev=null,sp=null;
function disp(now){const dt=(now-sm.t0)/1000;return sm.base+sm.rate*Math.min(dt,2)+sm.corr*Math.exp(-dt/.6)}
function fix(ch,ts){const now=performance.now();
 if(sm.lastCh!=null&&Math.abs(ch-sm.lastCh)>3000){sm.base=null;sm.rate=0;sm.lastCh=null}
 const shown=sm.base==null?ch:disp(now);
 if(sm.lastCh!=null&&ts>sm.lastTs){const r=(ch-sm.lastCh)/((ts-sm.lastTs)/1000);if(Math.abs(r)<150)sm.rate=sm.rate*.5+r*.5}
 sm.corr=shown-ch;sm.base=ch;sm.t0=now;sm.lastCh=ch;sm.lastTs=ts}
function pdisp(now){const dt=(now-ps.t0)/1000,k=Math.exp(-dt/.6),d=Math.min(dt,2);return[ps.bx+ps.vx*d+ps.cx*k,ps.by+ps.vy*d+ps.cy*k]}
function posFix(x,y,ts){const now=performance.now();
 if(ps.base&&Math.hypot(x-ps.lx,y-ps.ly)>3000)ps.base=false;
 let sx=x,sy=y;
 if(ps.base){[sx,sy]=pdisp(now);const dt=(ts-ps.lts)/1000;if(dt>0){const vx=(x-ps.lx)/dt,vy=(y-ps.ly)/dt;if(Math.hypot(vx,vy)<150){ps.vx=ps.vx*.5+vx*.5;ps.vy=ps.vy*.5+vy*.5}}}else{ps.vx=0;ps.vy=0}
 ps.cx=sx-x;ps.cy=sy-y;ps.bx=x;ps.by=y;ps.base=true;ps.t0=now;ps.lx=x;ps.ly=y;ps.lts=ts}
// 無效定位：畫面停在目前顯示的狀態
function freeze(){if(frozen)return;const now=performance.now();
 if(sm.base!=null){sm.base=disp(now);sm.rate=0;sm.corr=0;sm.t0=now}
 if(ps.base){const[px,py]=pdisp(now);ps.bx=px;ps.by=py;ps.vx=0;ps.vy=0;ps.cx=0;ps.cy=0;ps.t0=now}
 frozen=true}
function resetSmooth(){sm.base=null;sm.rate=0;sm.lastCh=null;ps.base=false;ps.vx=0;ps.vy=0;prev=null;sp=null;lastIdx=-1}
