// Capacity ranges in pounds from https://www.humanscale.com/products/monitor-arms.
// Each entry describes one complete layout; never multiply a single-arm limit.
const armLayouts=[
  {count:1,maxSize:43,minLb:5,maxLb:22,model:'M2 Pro',code:'M21BTSC',product:'m2pro'},
  {count:1,maxSize:65,minLb:9,maxLb:50,model:'M8 Pro',code:'M81BTSC',product:'m8pro'},
  {count:2,maxSize:43,minLb:5,maxLb:22,model:'M2 Pro Dual Mount',code:'M22MTSC',product:'m2pro'},
  {count:2,maxSize:28,minLb:1,maxLb:12.5,model:'M8 Pro Dual',code:'M82BCSC',product:'m8pro'},
  {count:2,maxSize:48,minLb:9,maxLb:45,model:'M/Flex · M8 Pro Extended Reach',code:'X821ETSC',product:'mflex'},
  {count:3,maxSize:28,minLb:5,maxLb:22,model:'M/Flex · M2 Pro Triple',code:'X231FTSC',product:'mflex'},
  {count:3,maxSize:32,minLb:5,maxLb:22,model:'M/Flex · M2 Pro Extended Reach',code:'X231QTSC',product:'mflex'},
  {count:3,maxSize:33,minLb:9,maxLb:30,model:'M/Flex · M8 Pro Triple',code:'X831QTSC',product:'mflex'},
  {count:4,maxSize:37,minLb:5,maxLb:15,model:'M/Flex · M2 Pro Quad',code:'X242CTSC',product:'mflex'},
  {count:4,maxSize:43,minLb:5,maxLb:15,model:'M/Flex · M2 Pro Quad Extended Reach',code:'X242ETSC',product:'mflex'},
  {count:6,maxSize:33,minLb:3,maxLb:10,model:'M/Flex · Six',code:'X262FSSC',product:'mflex'}
];
function selectArmLayout(count,size,weight){
  if(!Number.isFinite(size)||!Number.isFinite(weight)||size<=0||weight<=0)return null;
  const pounds=weight/0.45359237;
  return armLayouts.find(layout=>layout.count===count&&size<=layout.maxSize&&pounds>=layout.minLb&&pounds<=layout.maxLb)||null;
}
(()=>{
  const root=document.getElementById('monitor-arm-configurator');
  const form=document.getElementById('armForm');
  const get=id=>document.getElementById(id);
  const texts=[...root.querySelectorAll('[data-arm-en]')].map(element=>({element,vi:element.textContent,en:element.dataset.armEn}));
  let selected=null;
  const en=()=>document.documentElement.lang==='en';
  const t=(vi,english)=>en()?english:vi;
  function render(){
    const count=Number(form.elements.armCount.value),size=Number(get('armSize').value),weight=Number(get('armWeight').value);
    const valid=get('armSize').validity.valid&&get('armWeight').validity.valid;
    const match=valid?selectArmLayout(count,size,weight):null;selected=match;
    const vesa=get('armVesa').value,dock=get('armDock').checked;
    const mount=get('armMount').value==='clamp'?t('Kẹp mép bàn','Desk clamp'):t('Xuyên mặt bàn','Through-desk mount');
    const result=get('armModel').closest('.arm-result');result.classList.toggle('needs-check',!match||vesa!=='100');
    get('armResultStatus').textContent=!valid?t('Nhập thông số hợp lệ','Enter valid specifications'):!match?t('Cần tư vấn cấu hình riêng','Custom configuration review required'):t('Gợi ý theo kích thước và tải trọng','Suggested by screen size and weight');
    get('armModel').textContent=match?.model||t('Đội ngũ TFW sẽ kiểm tra','TFW will check your setup');
    get('armCapacity').textContent=match?`${match.minLb}–${match.maxLb} lb (${(match.minLb*.45359237).toFixed(1)}–${(match.maxLb*.45359237).toFixed(1)} kg) / ${t('màn hình','screen')} · ${t('Tối đa','Up to')} ${match.maxSize}″`:t('Thông số này nằm ngoài các cấu hình tiêu chuẩn đã liệt kê.','These specifications fall outside the listed standard configurations.');
    get('armCompatibility').textContent=vesa==='100'?t('Bản gắn VESA 100 × 100 mm; cần xác nhận phần cứng gắn bàn.','100 × 100 mm VESA plate; desk mounting hardware requires confirmation.'):t('Cần xác nhận bản gắn hoặc adapter VESA trước khi chọn tay đỡ.','Confirm the VESA plate or adapter before selecting the arm.');
    const image=get('armImage');image.hidden=!match;
    if(match){const blackPreviews={M21BTSC:'assets/arm-card-m2pro-black.png',M81BTSC:'assets/monitor-arm-black-preview.png'};image.src=blackPreviews[match.code]||`https://www.humanscale.com/userfiles/images/collection-pages/monitor-arms/desktop/${match.code}.png`;image.alt=`${match.model} · ${count} ${t('màn hình','screens')}`;}
    get('armImageCaption').textContent=match?`${match.model} · ${count} ${t('màn hình','screens')}`:t('Chờ xác nhận cấu hình phù hợp','Awaiting a compatible configuration');
    get('armDockPreview').hidden=!dock;
    const summary=[
      [t('Màn hình','Screens'),valid?`${count} × ${size}″ · ${weight} kg/${t('màn hình','screen')}`:t('Cần nhập lại thông số','Check your input')],
      [t('Lắp đặt','Mounting'),mount],
      ['VESA',vesa==='other'?t('Chưa rõ','Not confirmed'):`${vesa} × ${vesa} mm`],
      ['Docking',dock?'M/Connect 3':t('Không chọn','Not selected')]
    ];
    get('armSummary').replaceChildren(...summary.map(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);return row;}));
    get('armProductLink').hidden=!match;
    const quote=get('armQuote');quote.setAttribute('aria-disabled',String(!valid));
    if(valid){const body=[match?.model||t('Cần tư vấn cấu hình riêng','Custom configuration review'),...summary.map(([label,value])=>`${label}: ${value}`)].join('\n');quote.href=`mailto:hi@tfw.space?subject=${encodeURIComponent('Monitor arm · '+(match?.model||'Custom setup'))}&body=${encodeURIComponent(body)}`;}else quote.removeAttribute('href');
  }
  function translate(){texts.forEach(({element,vi,en:english})=>element.textContent=en()?english:vi);render();}
  form.addEventListener('input',render);form.addEventListener('change',render);
  form.addEventListener('submit',event=>event.preventDefault());
  get('armProductLink').addEventListener('click',()=>{if(selected)openProductDetail(selected.product)});
  document.addEventListener('tfw:languagechange',translate);
  translate();
})();
