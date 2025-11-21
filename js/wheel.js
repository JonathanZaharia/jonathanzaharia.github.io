const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');

// Boot segments - titles, links, and image file paths
const segments = [
  {title:'Baobab – Bronco Brown', 
   link:'https://jimgreenfootwear.com/store/baobab-boot-bronco/?attribute_pa_size=12', 
   img:'assets/boots/baobab-bronco.jpg'},
   
  {title:'African Ranger – Leather Midsole – Bronco Brown', 
   link:'https://jimgreenfootwear.com/store/african-ranger-bronco-leather-midsole/?attribute_pa_size=12', 
   img:'assets/boots/ar-bronco.jpg'},

  {title:'African Ranger – Leather Midsole – Houston Brown', 
   link:'https://jimgreenfootwear.com/store/african-ranger-houston-brown-leather-midsole/?attribute_pa_size=12', 
   img:'assets/boots/ar-houston.jpg'},

  {title:'African Ranger – Bronco Brown', 
   link:'https://jimgreenfootwear.com/store/african-ranger-tyre-wedge-bronco/?attribute_pa_size=12', 
   img:'assets/boots/ar-tyre.jpg'},

  {title:'719 – Frog Grip Sole – Bronco Brown', 
   link:'https://jimgreenfootwear.com/store/719-bronco/', 
   img:'assets/boots/719-frog.jpg'},

  {title:'719 – Tyre Wedge – Bronco Brown', 
   link:'https://jimgreenfootwear.com/store/719-bronco-brown-tyre-wedge/', 
   img:'assets/boots/719-tyre.jpg'},

  {title:'African Ranger – Buffalo Skin', 
   link:'https://jimgreenfootwear.com/store/african-ranger-buffalo-skin/', 
   img:'assets/boots/ar-buffalo.jpg'},

  {title:'African Ranger – Leather Midsole – Buffalo', 
   link:'https://jimgreenfootwear.com/store/african-ranger-buffalo-leather-midsole/', 
   img:'assets/boots/ar-buffalo-leather.jpg'}
];

const colors=['#ffcc00','#ff6600','#00ccff','#cc00ff','#66ff66','#ff0066','#00ffcc','#ccff00'];
let angle=0, spinning=false;

// JS audio context for sounds
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
let spinOscillator = null;

// Draw wheel
function drawWheel() {
  const width = canvas.clientWidth;
  canvas.width = width; canvas.height = width;
  const centerX=width/2, centerY=width/2, radius=width/2;
  const segAngle = 2*Math.PI/segments.length;
  ctx.clearRect(0,0,width,width);

  segments.forEach((seg,i)=>{
    // Draw colored segment
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX,centerY,radius,i*segAngle+angle,(i+1)*segAngle+angle);
    ctx.fillStyle = colors[i%colors.length]; ctx.fill();
    ctx.strokeStyle='#000'; ctx.stroke();

    // Draw boot image
    const img = new Image();
    img.src = seg.img;
    img.onload = () => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i*segAngle + segAngle/2 + angle);
      ctx.drawImage(img, radius-50, -25, 40, 40);
      ctx.restore();
    }

    // Draw title (shortened if too long)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(i*segAngle + segAngle/2 + angle);
    ctx.textAlign='right'; ctx.fillStyle='#000';
    ctx.font='bold 12px Arial';
    ctx.fillText(seg.title.length>15?seg.title.slice(0,15)+'...':seg.title,radius-10,5);
    ctx.restore();
  });
}
drawWheel();

// Populate boot list on side panel
const bootList=document.getElementById('boot-list');
segments.forEach(seg=>{
  const li=document.createElement('li');
  li.innerHTML=`<a href="${seg.link}" target="_blank">${seg.title}</a>`;
  bootList.appendChild(li);
});

// Spin wheel logic with JS-generated sound
document.getElementById('spin-btn').addEventListener('click',()=>{
  if(spinning) return;
  spinning=true;

  // Start spinning sound
  spinOscillator = audioCtx.createOscillator();
  spinOscillator.type='square';
  spinOscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  spinOscillator.connect(audioCtx.destination);
  spinOscillator.start();

  let spinAngle = Math.random()*Math.PI*6 + Math.PI*4;
  const spinInterval = setInterval(()=>{
    angle += 0.1;
    drawWheel();
    // Modulate frequency for spinning effect
    spinOscillator.frequency.setValueAtTime(400 + Math.random()*200, audioCtx.currentTime);
    spinAngle -= 0.1;
    if(spinAngle<=0){
      clearInterval(spinInterval);
      spinning=false;
      spinOscillator.stop();
      const winnerIndex = Math.floor((2*Math.PI - angle%(2*Math.PI)) / (2*Math.PI/segments.length));
      showWinnerPopup(winnerIndex);
      playWinnerVoice();
    }
  },20);
});

// Winner popup
function showWinnerPopup(index){
  const popup = document.getElementById('winner-popup');
  document.getElementById('winner-text').textContent = `🎉 Winner: ${segments[index].title} 🎉`;
  document.getElementById('winner-link').href = segments[index].link;
  popup.style.display='block';
}

document.getElementById('popup-close').addEventListener('click',()=>{
  document.getElementById('winner-popup').style.display='none';
});

// JS-generated winner voice effect
function playWinnerVoice(){
  const voiceOsc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  voiceOsc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  voiceOsc.type='sawtooth';
  voiceOsc.frequency.setValueAtTime(600, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  voiceOsc.start();
  voiceOsc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime+0.5);
  voiceOsc.stop(audioCtx.currentTime+0.6);
}
