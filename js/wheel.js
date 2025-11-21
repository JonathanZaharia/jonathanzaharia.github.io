const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');

const segments = [
  {title:'Baobab – Bronco Brown', link:'https://jimgreenfootwear.com/store/baobab-boot-bronco/?attribute_pa_size=12'},
  {title:'African Ranger – Leather Midsole – Bronco Brown', link:'https://jimgreenfootwear.com/store/african-ranger-bronco-leather-midsole/?attribute_pa_size=12'},
  {title:'African Ranger – Leather Midsole – Houston Brown', link:'https://jimgreenfootwear.com/store/african-ranger-houston-brown-leather-midsole/?attribute_pa_size=12'},
  {title:'African Ranger – Bronco Brown', link:'https://jimgreenfootwear.com/store/african-ranger-tyre-wedge-bronco/?attribute_pa_size=12'},
  {title:'719 – Frog Grip Sole – Bronco Brown', link:'https://jimgreenfootwear.com/store/719-bronco/'},
  {title:'719 – Tyre Wedge – Bronco Brown', link:'https://jimgreenfootwear.com/store/719-bronco-brown-tyre-wedge/'},
  {title:'African Ranger – Buffalo Skin', link:'https://jimgreenfootwear.com/store/african-ranger-buffalo-skin/'},
  {title:'African Ranger – Leather Midsole – Buffalo', link:'https://jimgreenfootwear.com/store/african-ranger-buffalo-leather-midsole/'}
];

let spinning = false;
let angle = 0;
const colors = ['#ffcc00','#ff6600','#00ccff','#cc00ff','#66ff66','#ff0066','#00ffcc','#ccff00'];

function drawWheel() {
  const width = canvas.clientWidth;
  canvas.width = width;
  canvas.height = width;
  const centerX = width/2;
  const centerY = width/2;
  const radius = width/2;
  const segAngle = 2*Math.PI/segments.length;
  ctx.clearRect(0,0,width,width);

  segments.forEach((seg,i)=>{
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX,centerY,radius,i*segAngle+angle,(i+1)*segAngle+angle);
    ctx.fillStyle = colors[i%colors.length];
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(i*segAngle + segAngle/2 + angle);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(seg.title.length>15?seg.title.slice(0,15)+'...':seg.title,radius-10,5);
    ctx.restore();
  });
}
drawWheel();

document.getElementById('spin-btn').addEventListener('click', ()=>{
  if(spinning) return;
  spinning = true;
  let spinAngle = Math.random()*Math.PI*6 + Math.PI*4;
  const spinInterval = setInterval(()=>{
    angle += 0.1;
    drawWheel();
    spinAngle -= 0.1;
    if(spinAngle<=0){
      clearInterval(spinInterval);
      spinning=false;
      const winnerIndex = Math.floor((2*Math.PI - angle%(2*Math.PI)) / (2*Math.PI/segments.length));
      triggerStageEvent(`🎉 Winner: ${segments[winnerIndex].title} 🎉`);
      playWinnerSound();
      window.open(segments[winnerIndex].link,'_blank');
    }
  },20);
});
