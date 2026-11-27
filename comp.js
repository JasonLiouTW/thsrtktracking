// 車廂補償：把裝置所在里程換算成車鼻里程（裝置以車廂中央計算；1 車向南、12 車向北）
const CARS={'700T':{end:26.75,mid:24.5},'N700ST':{end:27.35,mid:25}};
const comp={model:'700T',car:null};let trainDir=0;
try{const s=JSON.parse(localStorage.getItem('hsrcomp')||'null');if(s&&CARS[s.model]){comp.model=s.model;comp.car=(s.car>=1&&s.car<=12)?s.car:null}}catch(e){}
const carLen=(m,k)=>(k===1||k===12)?CARS[m].end:CARS[m].mid;
function noseDist(m,k,d){let s=carLen(m,k)/2;if(d>0){for(let i=1;i<k;i++)s+=carLen(m,i)}else{for(let i=k+1;i<=12;i++)s+=carLen(m,i)}return s}
const saveComp=()=>{try{localStorage.setItem('hsrcomp',JSON.stringify(comp))}catch(e){}};
function renderComp(){
 $('m700').setAttribute('aria-pressed',comp.model==='700T');$('mN7').setAttribute('aria-pressed',comp.model==='N700ST');
 for(let k=1;k<=12;k++)$('c'+k).setAttribute('aria-pressed',comp.car===k);
 $('carb').textContent=comp.car==null?t('carb'):t('carb_sel',comp.model,comp.car);
 $('ci').textContent=comp.car==null?t('ci_none'):trainDir===0?t('ci_wait',comp.model,comp.car):
  t('ci_dir',comp.model,comp.car,trainDir,(trainDir*noseDist(comp.model,comp.car,trainDir)).toFixed(1))}
