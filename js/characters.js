const gremlins = [document.getElementById('gremlin1'), document.getElementById('gremlin2')];

gremlins.forEach(g => {
  g.addEventListener('click',()=>{
    g.style.animation='hop 0.5s ease-out';
    setTimeout(()=>g.style.animation='hop 2s infinite ease-in-out',500);
    triggerStageEvent('👾 Gremlin jumps dramatically!');
  });
});
