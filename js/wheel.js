/* ----------------- CONFIG: your options ----------------- */
const options = [
  { label: "Baobab – Bronco Brown", price: "$199.99", img: "assets/baobab.jpg", url: "https://jimgreenfootwear.com/store/baobab-boot-bronco/?attribute_pa_size=12", value:199.99 },
  { label: "African Ranger – Leather Midsole – Bronco Brown", price: "$169.99", img: "assets/ar-bronco-leather.jpg", url: "https://jimgreenfootwear.com/store/african-ranger-bronco-leather-midsole/?attribute_pa_size=12", value:169.99 },
  { label: "African Ranger – Leather Midsole – Houston Brown", price: "$155.99", img: "assets/ar-houston-leather.jpg", url: "https://jimgreenfootwear.com/store/african-ranger-houston-brown-leather-midsole/?attribute_pa_size=12", value:155.99 },
  { label: "African Ranger – Bronco Brown (Tyre Wedge)", price: "$155.99", img: "assets/ar-tyre.jpg", url: "https://jimgreenfootwear.com/store/african-ranger-tyre-wedge-bronco/?attribute_pa_size=12", value:155.99 },
  { label: "719 – Frog Grip Sole – Bronco Brown", price: "$129.99", img: "assets/719-frog.jpg", url: "https://jimgreenfootwear.com/store/719-bronco/", value:129.99 },
  { label: "719 – Tyre Wedge – Bronco Brown", price: "$129.99", img: "assets/719-tyre.jpg", url: "https://jimgreenfootwear.com/store/719-bronco-brown-tyre-wedge/", value:129.99 },
  { label: "African Ranger – Buffalo Skin", price: "$240.00", img: "assets/ar-buffalo.jpg", url: "https://jimgreenfootwear.com/store/african-ranger-buffalo-skin/", value:240.00 },
  { label: "African Ranger – Leather Midsole – Buffalo", price: "$240.00", img: "assets/ar-buffalo-leather.jpg", url: "https://jimgreenfootwear.com/store/african-ranger-buffalo-leather-midsole/", value:240.00 }
];
/* ----------------- END CONFIG ----------------- */

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const cx = canvas.width/2, cy = canvas.height/2;
const outerR = Math.min(cx, cy) - 8;
const innerR = 54;
let angle = 0, angularVelocity = 0, spinning = false;
const friction = 0.993;
const colors = ["#c0392b","#e67e22","#f1c40f","#2ecc71","#1abc9c","#3498db","#9b59b6","#e84393"];

/* DRAW WHEEL WITH IMAGES */
function drawWheel(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const len = options.length;
  const arc = Math.PI*2 / len;
  const maxVal = Math.max(...options.map(o=>o.value));

  for(let i=0;i<len;i++){
    const start = angle + i*arc;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,outerR,start,start+arc);
    ctx.closePath();
    const intensity = 0.85 + (options[i].value/maxVal)*0.6;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = intensity;
    ctx.fill();
    ctx.globalAlpha = 1;

    // inner cutout
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,innerR,start,start+arc,true);
    ctx.closePath();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // boot image
    const mid = start + arc/2;
    const img = new Image();
    img.src = options[i].img;
    img.onload = () => {
      ctx.save();
      ctx.translate(cx + Math.cos(mid)*(innerR+outerR)/2*0.6, cy + Math.sin(mid)*(innerR+outerR)/2*0.6);
      ctx.rotate(mid + Math.PI/2);
      ctx.drawImage(img, -28, -28, 56, 56);
      ctx.restore();
    }

    // text below image
    ctx.save();
    ctx.translate(cx + Math.cos(mid)*(innerR+outerR)/2*0.6, cy + Math.sin(mid)*(innerR+outerR)/2*0.6 + 38);
    ctx.rotate(0);
    ctx.fillStyle="#031018";
    ctx.font="600 12px sans-serif";
    ctx.textAlign="center";
    const label = options[i].label.length>26 ? options[i].label.slice(0,23)+"..." : options[i].label;
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  // center
  ctx.beginPath(); ctx.arc(cx,cy,innerR-8,0,Math.PI*2); ctx.fillStyle="#031018"; ctx.fill();

  // pointer
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR - 6);
  ctx.lineTo(cx-16, cy - outerR + 18);
  ctx.lineTo(cx+16, cy - outerR + 18);
  ctx.closePath();
  ctx.fillStyle = "#ffd166";
  ctx.fill();

  // center label
  ctx.fillStyle="#fff"; ctx.font="700 16px sans-serif"; ctx.textAlign="center"; ctx.fillText("SPIN!", cx, cy+6);
}

/* ANIMATE SPIN */
function animate(){
  if(spinning){
    angularVelocity *= friction;
    if(Math.abs(angularVelocity) < 0.0005){
      angularVelocity = 0;
      spinning = false;
      setTimeout(onStop, 300);
    }
    angle += angularVelocity;
  }
  drawWheel();
  requestAnimationFrame(animate);
}

/* SPIN */
function spin(){
  if(spinning) return;
  angularVelocity = 0.35 + Math.random()*0.6;
  angularVelocity *= (Math.random()>0.5?1:-1);
  spinning = true;
  subtleDrumroll();
}

/* SUBTLE DRUMROLL SOUND */
let _audioCtx=null;
function ensureAudio(){ if(!_audioCtx) _audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }
function subtleDrumroll(){
  ensureAudio();
  const ctx=_audioCtx; let t=0;
  for(let i=0;i<12;i++){
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    o.type='square'; o.frequency.value=600 - i*8;
    g.gain.value=0.001;
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.04);
    t+=0.04;
  }
}

/* WINNER CALCULATION */
function getSelectedIndex(){
  const len = options.length;
  const normalized = ((angle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2);
  const arc = Math.PI*2 / len;
  const pointerAngle = -Math.PI/2;
  const relative = (pointerAngle - normalized + Math.PI*2) % (Math.PI*2);
  return Math.floor(relative / arc);
}

function onStop(){
  const idx = getSelectedIndex();
  const opt = options[idx];
  if(!opt) return;
  flashSlice(idx);
  showWinnerPopup(opt);
}

function flashSlice(idx){
  const len = options.length;
  const arc = Math.PI*2 / len;
  const start = angle + idx*arc;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.arc(cx,cy,outerR,start,start+arc);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fill();
  setTimeout(drawWheel, 400);
}

/* POPUP */
function showWinnerPopup(opt){
  const modal = document.getElementById('winnerModal');
  document.getElementById('winImg').src = opt.img;
  document.getElementById('winTitle').textContent = opt.label;
  document.getElementById('winPrice').textContent = opt.price;
  modal.classList.add('show');
  document.getElementById('buyBtn').onclick = ()=> window.open(opt.url,'_blank');
  document.getElementById('spinAgainBtn').onclick = ()=>{ modal.classList.remove('show'); spin(); };
}

/* OPTIONS LIST */
const optionsEl = document.getElementById('options');
function buildOptionsUI(){
  optionsEl.innerHTML='';
  const vals = options.map(o=>o.value);
  const max = Math.max(...vals), min = Math.min(...vals);
  options.forEach(o=>{
    const div = document.createElement('div');
    div.className='option';
    const tier = (o.value >= max*0.85) ? 'High spender' : (o.value <= min*1.05 ? 'Bottom dollar' : 'Mid spend');
    div.innerHTML = `<img src="${o.img}" alt="${o.label}"><div class="optMeta"><div class="optTitle">${o.label}</div><div class="optPrice">${o.price} <span class="badge">${tier}</span></div></div>`;
    div.addEventListener('click', ()=> window.open(o.url,'_blank'));
    optionsEl.appendChild(div);
  });
}

/* INIT */
animate();
buildOptionsUI();
drawWheel();

document.getElementById('spinBtn').addEventListener('click',()=>spin());
canvas.addEventListener('click',()=>{
  if(!spinning){
    const idx = getSelectedIndex();
    const o = options[idx];
    if(o && o.url) window.open(o.url,'_blank');
  }
});
