// stageshow.js
function triggerStageEvent(event) {
  const stage = document.getElementById('stage-panel');
  stage.innerHTML = event; // text + emojis
  stage.classList.add('show');
  setTimeout(() => stage.classList.remove('show'), 2000);
}

// Example calls
triggerStageEvent('💡 Spotlights sweep across the stage!');
triggerStageEvent('👟 Gremlins sabotage the wheel!');
triggerStageEvent('🎉 Confetti bursts!');

