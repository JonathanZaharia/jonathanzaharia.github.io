const gremlin = document.getElementById('gremlin');

gremlin.addEventListener('click', () => {
  gremlin.style.animation = 'hop 0.5s ease-out';
  setTimeout(() => gremlin.style.animation = 'hop 3s infinite', 500);
  triggerStageEvent('👾 Gremlin jumps dramatically!');
});
