// ===========================
// Vencraft-CI — Mini-site
// ===========================

// --- Apparition des sections au scroll (fade-in-up) ---
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

// --- Musique de fond : démarrage muet, activation au clic (contrainte navigateurs) ---
const audio = document.getElementById('bg-audio');
const toggleBtn = document.getElementById('sound-toggle');
const iconMuted = document.getElementById('icon-muted');
const iconUnmuted = document.getElementById('icon-unmuted');

let soundOn = false;

toggleBtn.addEventListener('click', () => {
  soundOn = !soundOn;

  if (soundOn) {
    audio.volume = 0.35; // volume bas, comme demandé dans le cahier des charges
    audio.play().catch(() => {
      // Si le fichier audio n'est pas encore fourni ou le navigateur bloque la lecture,
      // on revient silencieusement à l'état muet.
      soundOn = false;
      updateIcon();
    });
  } else {
    audio.pause();
  }

  updateIcon();
});

function updateIcon() {
  iconMuted.style.display = soundOn ? 'none' : 'block';
  iconUnmuted.style.display = soundOn ? 'block' : 'none';
  toggleBtn.setAttribute('aria-pressed', String(soundOn));
  toggleBtn.setAttribute('aria-label', soundOn ? 'Couper le son' : 'Activer le son');
}
