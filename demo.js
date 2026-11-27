// Demo Run：沒有 GPS 時模擬列車行駛（可選方向、車速，點中心線選起點）
const SPEEDS=[5,30,45,70,120,170,230,300,315];
const demo={on:false,run:false,ch:0,dir:1,si:4,timer:null};
function simReset(ch){resetSmooth();demo.ch=ch}
function simEmit(v){const[la,lo]=llAt(demo.ch);update(la,lo,5,v,Date.now())}
function simTick(){const v=SPEEDS[demo.si]/3.6;demo.ch+=demo.dir*v;
 if(demo.ch>=CH[n-1]||demo.ch<=CH[0]){demo.ch=Math.min(CH[n-1],Math.max(CH[0],demo.ch));simEmit(0);setRun(false);return}
 simEmit(v)}
function setRun(on){if(on===demo.run)return;demo.run=on;
 if(on){simTick();if(demo.run)demo.timer=setInterval(simTick,1000)}else{clearInterval(demo.timer);sm.rate=0;ps.vx=0;ps.vy=0}
 setDemoBtn()}
function setDemoBtn(){$('demo').textContent=t(demo.on&&demo.run?'demo_pause':'demo_run');$('dr').textContent=t(demo.run?'dr_pause':'dr_start')}
function setPanel(){$('dpanel').hidden=!demo.on;$('dN').setAttribute('aria-pressed',demo.dir<0);$('dS').setAttribute('aria-pressed',demo.dir>0);
 $('dv').textContent=SPEEDS[demo.si]+' km/h';$('dh').textContent=t(demo.dir<0?'dh_n':'dh_s')}
function enterDemo(){if(demo.on)return;const c=sm.lastCh!=null?sm.lastCh:100000;demo.on=true;simReset(c);simEmit(0);setDemoBtn();setPanel()}
const toggleDemo=()=>demo.on?setRun(!demo.run):enterDemo();
function stopDemo(){if(demo.run)setRun(false);demo.on=false;setDemoBtn();setPanel()}
