// 多語系：新增語言時，在 I18N 加一組同名 key 即可（缺少的 key 會退回中文）
const I18N={
zh:{title:'高鐵里程定位',spd:'時速',mlab:'現在里程',tlab:z=>'本地時間（'+z+'）',langbtn:'日本語',
 go:'定位',go_on:'定位中',fol_on:'跟隨：開',fol_off:'跟隨：關',carb:'車廂補償',carb_sel:(m,c)=>m+'・'+c+'車',
 gmap:'Google Map',demo_run:'Demo Run',demo_pause:'Demo Pause',
 dN:'往北',dS:'往南',dr_start:'開始',dr_pause:'暫停',dx:'結束模擬',
 dh_n:'往北：里程數減少。點地圖上的中心線，可從該點開始模擬。',dh_s:'往南：里程數增加。點地圖上的中心線，可從該點開始模擬。',
 car_model:'車型',car_ends:'頭尾車（1 車向南，12 車向北）',car_mid:'中間車',car_n:k=>k+' 車',coff:'不補償',cx:'關閉',
 ci_none:'未選車廂：顯示裝置所在位置的里程。裝置以車廂中央計算。',
 ci_wait:(m,c)=>'已選 '+m+' '+c+' 車（車廂中央）。等待依里程變化判斷行駛方向。',
 ci_dir:(m,c,d,o)=>m+' '+c+' 車中央，往'+(d>0?'南，車鼻為 1 車前端':'北，車鼻為 12 車前端')+'，里程補償 '+o+' m',
 mlab_nose:d=>'車鼻里程（'+(d>0?'往南':'往北')+'）',mlab_wait:'現在里程（判斷行駛方向中）',
 st_init:'尚未開始',st_ok:'GPS 正常',st_lost:s=>'GPS 訊號中斷 '+s+' 秒，維持上次有效資料',st_demo:'模擬模式',st_demo_paused:'模擬模式（已暫停）',
 bad_off:d=>'定位無效：偏離中心線 '+d+' m，維持上次有效資料',bad_speed:v=>'定位無效：速度 '+v+' km/h，維持上次有效資料',
 s2:(d,a)=>'距中心線 '+d+'　誤差 ±'+a+' m',
 err_perm:'定位權限被拒絕，請在瀏覽器設定允許位置',err_pos:'無法取得位置',err_nosupport:'此瀏覽器不支援定位',
 err_nopos:'尚未取得位置，請先按「定位」',err_load:'載入里程資料失敗，請確認 hsr-data.json 與其他檔案已一起上傳'},
ja:{title:'台湾高鉄 キロ程測位',spd:'速度',mlab:'現在キロ程',tlab:z=>'現地時刻（'+z+'）',langbtn:'English',
 go:'測位',go_on:'測位中',fol_on:'追従：ON',fol_off:'追従：OFF',carb:'車両補正',carb_sel:(m,c)=>m+'・'+c+'号車',
 gmap:'Google マップ',demo_run:'デモ走行',demo_pause:'デモ一時停止',
 dN:'北行',dS:'南行',dr_start:'開始',dr_pause:'一時停止',dx:'デモ終了',
 dh_n:'北行：キロ程が減少。地図上の中心線をタップすると、その地点から開始します。',dh_s:'南行：キロ程が増加。地図上の中心線をタップすると、その地点から開始します。',
 car_model:'車種',car_ends:'端の車両（1号車は南向き、12号車は北向き）',car_mid:'中間車',car_n:k=>k+'号車',coff:'補正なし',cx:'閉じる',
 ci_none:'車両未選択：端末の位置のキロ程を表示します。端末は車両の中央にあるものとして計算します。',
 ci_wait:(m,c)=>'選択中：'+m+' '+c+'号車（車両中央）。キロ程の変化から進行方向を判定中です。',
 ci_dir:(m,c,d,o)=>m+' '+c+'号車中央、'+(d>0?'南行（先頭は1号車の前端）':'北行（先頭は12号車の前端）')+'、キロ程補正 '+o+' m',
 mlab_nose:d=>'先頭キロ程（'+(d>0?'南行':'北行')+'）',mlab_wait:'現在キロ程（進行方向を判定中）',
 st_init:'未開始',st_ok:'GPS 正常',st_lost:s=>'GPS信号途絶 '+s+' 秒、直前の有効データを維持',st_demo:'デモモード',st_demo_paused:'デモモード（一時停止中）',
 bad_off:d=>'測位無効：中心線から '+d+' m 離れています。直前の有効データを維持',bad_speed:v=>'測位無効：速度 '+v+' km/h。直前の有効データを維持',
 s2:(d,a)=>'中心線まで '+d+'　誤差 ±'+a+' m',
 err_perm:'位置情報の許可が拒否されました。ブラウザの設定で許可してください',err_pos:'位置を取得できません',err_nosupport:'このブラウザは位置情報に対応していません',
 err_nopos:'位置を取得できていません。先に「測位」を押してください',err_load:'キロ程データの読み込みに失敗しました。hsr-data.json などが同じ場所にあるか確認してください'},
en:{title:'Taiwan HSR Mileage Locator',spd:'Speed',mlab:'Mileage',tlab:z=>'Local time ('+z+')',langbtn:'中文',
 go:'Locate',go_on:'Locating',fol_on:'Follow: On',fol_off:'Follow: Off',carb:'Car offset',carb_sel:(m,c)=>m+' · Car '+c,
 gmap:'Google Map',demo_run:'Demo Run',demo_pause:'Demo Pause',
 dN:'Northbound',dS:'Southbound',dr_start:'Start',dr_pause:'Pause',dx:'End demo',
 dh_n:'Northbound: mileage decreases. Tap the center line on the map to start from that point.',dh_s:'Southbound: mileage increases. Tap the center line on the map to start from that point.',
 car_model:'Train type',car_ends:'End cars (car 1 faces south, car 12 faces north)',car_mid:'Middle cars',car_n:k=>'Car '+k,coff:'No offset',cx:'Close',
 ci_none:'No car selected: showing the mileage of the device position. The device is assumed to be at the center of the car.',
 ci_wait:(m,c)=>'Selected '+m+' car '+c+' (car center). Waiting to detect direction from the mileage trend.',
 ci_dir:(m,c,d,o)=>m+' car '+c+' center, '+(d>0?'southbound, nose is the front of car 1':'northbound, nose is the front of car 12')+', mileage offset '+o+' m',
 mlab_nose:d=>'Nose mileage ('+(d>0?'southbound':'northbound')+')',mlab_wait:'Mileage (detecting direction…)',
 st_init:'Not started',st_ok:'GPS OK',st_lost:s=>'GPS signal lost for '+s+' s; holding last valid data',st_demo:'Demo mode',st_demo_paused:'Demo mode (paused)',
 bad_off:d=>'Invalid fix: '+d+' m from the center line; holding last valid data',bad_speed:v=>'Invalid fix: speed '+v+' km/h; holding last valid data',
 s2:(d,a)=>'Off center line '+d+'  accuracy ±'+a+' m',
 err_perm:'Location permission denied. Please allow location in the browser settings.',err_pos:'Unable to get position',err_nosupport:'This browser does not support geolocation',
 err_nopos:'No position yet. Tap "Locate" first.',err_load:'Failed to load mileage data. Make sure hsr-data.json and the other files were uploaded together.'}
};
let LANG=(()=>{try{const s=localStorage.getItem('hsrlang');if(I18N[s])return s}catch(e){}const l=(navigator.language||'').slice(0,2);return I18N[l]?l:'zh'})();
const $=id=>document.getElementById(id);
const t=(k,...a)=>{const v=I18N[LANG][k]??I18N.zh[k];return typeof v==='function'?v(...a):v};
function applyStatic(){
 document.documentElement.lang={zh:'zh-Hant',ja:'ja',en:'en'}[LANG];document.title=t('title');
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 $('c1').textContent=t('car_n',1);$('c12').textContent=t('car_n',12)}
