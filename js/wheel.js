const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');

const segments = [
  {title: 'Baobab – Bronco Brown', img: 'assets/boots/baobab-bronco.png'},
  {title: 'African Ranger – Leather Midsole – Bronco Brown', img: 'assets/boots/ar-bronco-leather.png'},
  {title: 'African Ranger – Leather Midsole – Houston Brown', img: 'assets/boots/ar-houston.png'},
  {title: 'African Ranger – Bronco Brown', img: 'assets/boots/ar-tyre.png'},
  {title: '719 – Frog Grip Sole – Bronco Brown', img: 'assets/boots/719-bronco.png'},
  {title: '719 – Tyre Wedge – Bronco Brown', img: 'assets/boots/719-tyre.png'},
  {title: 'African Ranger – Buffalo Skin', img: 'assets/boots/ar-buffalo.png'},
  {title: 'African Ranger – Leather Midsole – Buffalo', img: 'assets/boots/ar-buffalo-leather.png'}
];

let spinning = false;
let angle = 0;

function drawWheel() {
  const width = canvas.clientWidth;
  canvas.width = width;
  canvas.height = width;

  const centerX = width/2;
  const centerY = width/2;
  const radius = width/2;

  const segAngle = 2 * Math.PI / segments.length;

  ctx.clearRect(0, 0, width, width);

  segments.forEach((seg, i) => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, i*segAngle + angle, (i+1)*segAngle + angle);
    ctx.fillStyle = i % 2 === 0 ? '#444' : '#666';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Draw segment image
    const img = new Image();
    img.src = seg.img;
    img.onload = function() {
      const theta = i*segAngle + segAngle/2 + angle;
      const imgX = centerX + radius/2 * Math.cos(theta) - 25;
      const imgY = centerY + radius/2 * Math.sin(theta) - 25;
      ctx.drawImage(img, imgX, imgY, 50, 50);
    }
  });
}

drawWheel();

document.getElementById('spin-btn').addEventListener('click', () => {
  if(spinning) return;
  spinning = true;
  let spinAngle = Math.random() * Math.PI * 4 + Math.PI*4; 
  const spinInterval = setInterval(() => {
    angle += 0.1;
    drawWheel();
    spinAngle -= 0.1;
    if(spinAngle <= 0){
      clearInterval(spinInterval);
      spinning = false;
      const winnerIndex = Math.floor((2*Math.PI - angle%(2*Math.PI)) / (2*Math.PI/segments.length));
      triggerStageEvent(`🎉 Winner: ${segments[winnerIndex].title} 🎉`);
      playWinnerSound();
    }
  }, 20);
});
