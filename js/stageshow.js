function triggerStageEvent(event){
  const stage=document.getElementById('stage-panel');
  stage.textContent=event; stage.classList.add('show');
  // confetti
  for(let i=0;i<5;i++){
    const c=document.createElement('div'); c.className='confetti';
    c.style.left=Math.random()*window.innerWidth+'px';
    c.style.backgroundColor=['red','yellow','blue','green'][Math.floor(Math.random()*4)];
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2000);
  }
  setTimeout(()=>stage.classList.remove('show'),2000);
}
