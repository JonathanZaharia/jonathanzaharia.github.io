const gremlin=document.getElementById('gremlin1');
let gx=50, gy=50, dx=2, dy=1.5;

function moveGremlin(){
  gx+=dx; gy+=dy;
  if(gx<0||gx>window.innerWidth-40) dx*=-1;
  if(gy<0||gy>window.innerHeight-40) dy*=-1;
  gremlin.style.left=gx+'px';
  gremlin.style.top=gy+'px';
  requestAnimationFrame(moveGremlin);
}
moveGremlin();

gremlin.addEventListener('click',()=>{
  dx*=-1; dy*=-1;
  triggerStageEvent('👾 Gremlin jumps away!');
});
