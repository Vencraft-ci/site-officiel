// ===========================
// Vencraft-CI — Mini-site — Motion design
// ===========================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const hasGSAP = typeof gsap !== 'undefined';

if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------------------------------------------
   1) SPLIT TEXT — découpe lettre par lettre / mot par mot
--------------------------------------------------- */
function splitWords(el) {
  const text = el.textContent;
  el.textContent = '';
  const words = text.split(/(\s+)/);
  words.forEach((word) => {
    if (word.trim() === '') {
      el.appendChild(document.createTextNode(word));
      return;
    }
    const wrap = document.createElement('span');
    wrap.className = 'split-word-wrap';
    const inner = document.createElement('span');
    inner.className = 'split-word';
    inner.textContent = word;
    wrap.appendChild(inner);
    el.appendChild(wrap);
  });
  return el.querySelectorAll('.split-word');
}

// Découpe par mots (un mot ne se coupe jamais), puis lettre par lettre dans chaque mot
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const chars = [];
  text.split(/(\s+)/).forEach((part) => {
    if (part.trim() === '') {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const wordWrap = document.createElement('span');
    wordWrap.className = 'split-word-wrap';
    part.split('').forEach((ch) => {
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.textContent = ch;
      wordWrap.appendChild(inner);
      chars.push(inner);
    });
    el.appendChild(wordWrap);
  });
  return chars;
}

const splitTargets = [];
document.querySelectorAll('[data-split]').forEach((el) => {
  const mode = el.getAttribute('data-split');
  const units = mode === 'chars' ? splitChars(el) : splitWords(el);
  splitTargets.push({ el, units, mode });
});

/* ---------------------------------------------------
   2) PRÉCHARGEUR — compteur + rideau, puis entrée du hero
--------------------------------------------------- */
const preloader = document.getElementById('preloader');
const preloaderNumber = document.getElementById('preloader-number');
const preloaderFill = document.getElementById('preloader-fill');

function playHeroEntrance() {
  // Par défaut (CSS), tout le contenu du hero est déjà visible.
  // On ne le "masque" que juste avant de l'animer, et uniquement si GSAP
  // est bien chargé : si quoi que ce soit échoue, le texte reste affiché.
  if (!hasGSAP || prefersReducedMotion) return;

  try {
    const heroUnits = splitTargets
      .filter((t) => t.el.closest('.hero h1'))
      .flatMap((t) => Array.from(t.units));

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroUnits.length) {
      tl.fromTo(heroUnits, { yPercent: 130 }, { yPercent: 0, duration: 0.9, stagger: 0.018 }, 0);
    }
    tl.fromTo('.hero-in--2', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.35)
      .fromTo('.hero-in--3', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
      .fromTo('.hero-in--4', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.62)
      .fromTo('.hero-in--5', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.3)
      .fromTo('.hero-in--6', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9);
  } catch (err) {
    console.error('Vencraft — entrée du hero interrompue, affichage forcé :', err);
    document.querySelectorAll('.hero-in').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }
}

function runPreloader() {
  if (!preloader) { playHeroEntrance(); return; }

  if (prefersReducedMotion) {
    preloader.remove();
    playHeroEntrance();
    return;
  }

  let count = 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    count = Math.floor(progress * 100);
    if (preloaderNumber) preloaderNumber.textContent = count;
    if (preloaderFill) preloaderFill.style.width = `${count}%`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      preloader.classList.add('is-done');
      playHeroEntrance();
      setTimeout(() => preloader.remove(), 950);
    }
  }
  requestAnimationFrame(tick);
}

runPreloader();

/* ---------------------------------------------------
   3) SCROLL SCÉNARISÉ — apparition des sections et listes
--------------------------------------------------- */
function setupScrollReveals() {
  // Par défaut (CSS), .reveal et les textes fractionnés sont déjà visibles.
  // On ne cache un élément qu'au moment précis où on l'anime (fromTo),
  // jamais avant : une erreur en cours de route ne peut donc pas
  // laisser du texte invisible sur la page.
  if (!hasGSAP || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

  try {
    document.querySelectorAll('.reveal').forEach((el) => {
      const fromVars = { opacity: 0 };
      if (el.classList.contains('reveal-left')) fromVars.x = -48;
      else if (el.classList.contains('reveal-right')) fromVars.x = 48;
      else if (el.classList.contains('reveal-scale')) fromVars.scale = 0.94;
      else fromVars.y = 28;

      gsap.fromTo(el, fromVars, {
        opacity: 1, x: 0, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    document.querySelectorAll('.reveal-stagger').forEach((group) => {
      gsap.fromTo(group.children, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 88%' }
      });
    });

    splitTargets.forEach(({ el, units, mode }) => {
      if (el.closest('.hero')) return; // le hero est géré par le préchargeur
      if (mode === 'chars') {
        gsap.fromTo(units, { yPercent: 115 }, {
          yPercent: 0, duration: 0.8, stagger: 0.015, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      } else {
        gsap.fromTo(units, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      }
    });

    // Parallax discret des orbes de lumière
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const container = orb.closest('section, header');
      if (!container) return;
      gsap.to(orb, {
        y: i % 2 === 0 ? 60 : -60,
        ease: 'none',
        scrollTrigger: { trigger: container, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });
  } catch (err) {
    console.error('Vencraft — révélations au scroll interrompues, affichage forcé :', err);
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach((el) => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    splitTargets.forEach(({ units }) => units.forEach((u) => { u.style.opacity = '1'; u.style.transform = 'none'; }));
  }
}

setupScrollReveals();

/* ---------------------------------------------------
   FILET DE SÉCURITÉ — garantit qu'aucun texte ne reste
   invisible, quoi qu'il arrive (erreur JS, CDN bloqué, etc.)
--------------------------------------------------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll(
      '.reveal, .reveal-stagger > *, .hero-in, [data-split] .split-char, [data-split] .split-word'
    ).forEach((el) => {
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.05) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }, 4000);
});

/* ---------------------------------------------------
   4) CURSEUR PERSONNALISÉ
--------------------------------------------------- */
if (!isCoarsePointer && !prefersReducedMotion) {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, [data-tilt]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('is-active'));
  });
}

/* ---------------------------------------------------
   5) BOUTONS MAGNÉTIQUES
--------------------------------------------------- */
if (!isCoarsePointer && !prefersReducedMotion) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.35;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

/* ---------------------------------------------------
   6) TILT 3D SUR LES CARTES
--------------------------------------------------- */
if (!isCoarsePointer && !prefersReducedMotion) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.getAttribute('data-tilt-max')) || 10;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

/* ---------------------------------------------------
   7) BARRE DE PROGRESSION DE LECTURE
--------------------------------------------------- */
const progressFill = document.getElementById('scroll-progress-fill');
function updateScrollProgress() {
  if (!progressFill) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
  progressFill.style.width = `${Math.min(ratio * 100, 100)}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------------------------------------------------
   8) MUSIQUE DE FOND — démarrage muet, activation au clic
--------------------------------------------------- */
const audio = document.getElementById('bg-audio');
const toggleBtn = document.getElementById('sound-toggle');
const iconMuted = document.getElementById('icon-muted');
const iconUnmuted = document.getElementById('icon-unmuted');

let soundOn = false;

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    soundOn = !soundOn;

    if (soundOn) {
      audio.volume = 0.35;
      audio.play().catch(() => {
        soundOn = false;
        updateIcon();
      });
    } else {
      audio.pause();
    }

    updateIcon();
  });
}

function updateIcon() {
  if (!iconMuted || !iconUnmuted || !toggleBtn) return;
  iconMuted.style.display = soundOn ? 'none' : 'block';
  iconUnmuted.style.display = soundOn ? 'block' : 'none';
  toggleBtn.setAttribute('aria-pressed', String(soundOn));
  toggleBtn.setAttribute('aria-label', soundOn ? 'Couper le son' : 'Activer le son');
}

/* ---------------------------------------------------
   9) SECTEURS : dépliant progressif
--------------------------------------------------- */
const sectorsBtn = document.getElementById('sectors-btn');
const sectorsPanel = document.getElementById('sectors-panel');

if (sectorsBtn && sectorsPanel) {
  sectorsBtn.addEventListener('click', () => {
    const isOpen = sectorsPanel.classList.toggle('is-open');
    sectorsBtn.classList.toggle('is-open', isOpen);
    sectorsBtn.setAttribute('aria-expanded', String(isOpen));
    sectorsBtn.querySelector('span').textContent = isOpen
      ? 'Masquer les secteurs'
      : 'Voir les secteurs que nous accompagnons';

    if (hasGSAP && !prefersReducedMotion && isOpen && typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 550);
    }
  });
}