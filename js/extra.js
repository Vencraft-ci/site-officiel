// ===========================
// Vencraft-CI — Secteurs, Stock Lite, barres de défilement horizontal
// (chargé APRÈS script.js)
// ===========================

// [nom de l'image (fichier images/secteur-<nom>.jpg), icône, secteur, exemples d'articles]
const SECTORS = [
  ['electromenager', '🔌', 'Électroménager', 'Frigo · Télé · Ventilateur'],
  ['mode', '👗', 'Mode', 'Robes · Pagnes · Chaussures'],
  ['bijouterie', '💎', 'Bijouterie', 'Colliers · Bagues · Montres'],
  ['restaurant', '🍽️', 'Restaurant', 'Plats · Boissons · Menus'],
  ['traiteur', '🍲', 'Traiteur', 'Buffets · Plateaux · Cocktails'],
  ['coiffure-beaute', '💇', 'Coiffure & Beauté', 'Tresses · Soins · Maquillage'],
  ['immobilier', '🏠', 'Immobilier', 'Villas · Terrains · Locations'],
  ['automobile', '🚗', 'Automobile', 'Voitures · Motos · Pièces'],
  ['telephonie', '📱', 'Téléphonie', 'Téléphones · Écouteurs · Chargeurs'],
  ['meubles', '🛋️', 'Meubles', 'Canapés · Lits · Tables'],
  ['alimentation', '🛒', 'Alimentation', 'Riz · Huile · Conserves'],
  ['materiaux', '🧱', 'Matériaux de construction', 'Ciment · Fer · Carreaux'],
  ['services', '🛠️', 'Services', 'Prestations · Forfaits · Devis'],
  ['artisanat', '🧵', 'Artisanat', 'Sculptures · Sacs · Poteries'],
  ['evenementiel', '🎉', 'Événementiel', 'Décoration · Sono · Location'],
  ['autres', '✨', 'Autres', 'Tous vos produits · Toutes activités']
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function sectorCard([slug, icon, name, items]) {
  return `
  <article class="sector-card hs-item" role="button" tabindex="0" aria-pressed="false">
    <div class="sector-media" style="background-image:url('images/secteur-${slug}.jpg')">
      <span class="sector-emoji" aria-hidden="true">${icon}</span>
      <span class="sector-check" aria-hidden="true">✓</span>
      <div class="sector-media-shade"></div>
      <h5 class="sector-title">${esc(name)}</h5>
      <p class="sector-items">${esc(items)}</p>
      <span class="sector-cta">Voir mon tarif <b>→</b></span>
    </div>
  </article>`;
}

// Stock Lite + étagère + caméras (images : images/<file>.jpg)
const LITE = [
  { file: 'stocklite-logiciel', icon: '💻', title: 'Stock Lite', tag: 'Logiciel à vie', price: '150 000 F', note: 'Une seule fois · Aucun abonnement',
    points: ['Installé sur votre ordinateur', 'Toutes vos infos sur un seul poste', 'Tout est sauvegardé'], main: true },
  { file: 'etagere-supermarche', icon: '🗄️', title: 'Étagère supermarché', tag: 'Équipement', price: '100 000 F', note: 'Prix de l\'étagère',
    points: ['Solide et prête à ranger', 'Pour boutique et supermarché'] },
  { file: 'installation-camera', icon: '📹', title: 'Installation de caméras', tag: 'Sécurité', price: 'Sur devis', note: 'Selon votre local',
    points: ['Surveillez votre commerce', 'Pose faite par nos équipes'] }
];

function liteCard(c) {
  return `
  <article class="sector-card lite-card hs-item${c.main ? ' lite-card--main' : ''}">
    <div class="sector-media" style="background-image:url('images/${c.file}.jpg')">
      <span class="sector-emoji" aria-hidden="true">${c.icon}</span>
      <span class="lite-tag">${c.tag}</span>
      <div class="sector-media-shade"></div>
      <h5 class="sector-title">${esc(c.title)}</h5>
    </div>
    <div class="lite-body">
      <p class="lite-price">${c.price}</p>
      <p class="lite-note">${esc(c.note)}</p>
      <ul>${c.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <a href="#contact" class="btn ${c.main ? 'btn-contact' : 'btn-outline'} btn-block">${c.price === 'Sur devis' ? 'Demander un devis' : 'Je commande'}</a>
    </div>
  </article>`;
}

const sTrack = document.getElementById('sectors-track');
if (sTrack) sTrack.innerHTML = SECTORS.map(sectorCard).join('');
const lTrack = document.getElementById('lite-track');
if (lTrack) lTrack.innerHTML = LITE.map(liteCard).join('');

// Barres de défilement horizontal (couleurs du site)
document.querySelectorAll('[data-hscroll]').forEach((box) => {
  const track = box.querySelector('.hs-track');
  const thumb = box.querySelector('.hs-bar span');
  const hint = box.querySelector('.hs-hint');
  if (!track || !thumb) return;

  function update() {
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 2) { box.classList.add('no-scroll'); return; }
    box.classList.remove('no-scroll');
    const w = Math.max(track.clientWidth / track.scrollWidth, 0.12);
    const pos = track.scrollLeft / max;
    thumb.style.width = `${w * 100}%`;
    thumb.style.left = `${pos * (1 - w) * 100}%`;
    if (hint) hint.classList.toggle('is-end', pos > 0.97);
  }
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();

  // Glisser à la souris sur ordinateur (le mode "glisse" ne démarre qu'après 5 px,
  // pour que le simple clic sur une carte continue de fonctionner)
  let down = false, startX = 0, startLeft = 0;
  track.addEventListener('mousedown', (e) => { down = true; track._moved = false; startX = e.pageX; startLeft = track.scrollLeft; });
  window.addEventListener('mouseup', () => { down = false; track.classList.remove('is-drag'); });
  window.addEventListener('mousemove', (e) => {
    if (!down) return;
    if (!track._moved && Math.abs(e.pageX - startX) > 5) { track._moved = true; track.classList.add('is-drag'); }
    if (track._moved) track.scrollLeft = startLeft - (e.pageX - startX);
  });
});

// Dépliant « tarifs » : textes du bouton (script.js gère l'ouverture ;
// ce clic est écouté juste après le sien)
const secBtn = document.getElementById('sectors-btn');
if (secBtn) {
  const secLabel = secBtn.querySelector('span');
  const TXT_CLOSED = 'Voir les tarifs';
  const TXT_OPEN = 'Masquer les tarifs';
  let secTimer;

  if (secLabel) secLabel.textContent = TXT_CLOSED;

  secBtn.addEventListener('click', () => {
    const isOpen = secBtn.classList.contains('is-open');
    if (secLabel) secLabel.textContent = isOpen ? TXT_OPEN : TXT_CLOSED;

    // Recalcule les barres de défilement après l'animation
    clearTimeout(secTimer);
    secTimer = setTimeout(() => window.dispatchEvent(new Event('resize')), 550);
  });
}

// ===========================
// Clic sur un secteur : la carte monte, les autres se floutent
// ===========================
function centerCard(track, card) {
  const left = track.scrollLeft
    + (card.getBoundingClientRect().left - track.getBoundingClientRect().left)
    - (track.clientWidth - card.offsetWidth) / 2;
  track.scrollTo({ left: Math.max(left, 0), behavior: 'smooth' });
}

function setPick(card) {
  if (!sTrack) return;
  sTrack.querySelectorAll('.sector-card').forEach((c) => {
    const on = c === card;
    c.classList.toggle('is-picked', on);
    c.setAttribute('aria-pressed', String(on));
  });
  sTrack.classList.toggle('has-pick', !!card);
  if (card) centerCard(sTrack, card);
}

function openTariffs() {
  const panel = document.getElementById('sectors-panel');
  if (secBtn && !secBtn.classList.contains('is-open')) secBtn.click();
  setTimeout(() => { if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 380);
}

if (sTrack) {
  sTrack.addEventListener('click', (e) => {
    if (sTrack._moved) return;
    const card = e.target.closest('.sector-card');
    if (!card) return;
    if (card.classList.contains('is-picked') && e.target.closest('.sector-cta')) { openTariffs(); return; }
    setPick(card.classList.contains('is-picked') ? null : card);
  });

  sTrack.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.sector-card');
    if (!card) return;
    e.preventDefault();
    setPick(card.classList.contains('is-picked') ? null : card);
  });

  // Clic en dehors de la zone secteurs, ou touche Échap : on revient à la vue normale
  document.addEventListener('click', (e) => { if (!e.target.closest('.offer-sectors')) setPick(null); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setPick(null); });
}

// ===========================
// Bloc « Site vitrine… » : apparaît à chaque arrivée, disparaît au départ
// ===========================
const offerList = document.querySelector('.offer-list');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (offerList && 'IntersectionObserver' in window && !reduceMotion) {
  offerList.querySelectorAll('.offer-list-text > *').forEach((el, i) => el.style.setProperty('--i', i));
  offerList.querySelectorAll('.offer-list-items li').forEach((el, i) => el.style.setProperty('--i', i + 2));
  offerList.classList.add('js-anim');

  const listObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.intersectionRatio >= 0.2) offerList.classList.add('in-view');
      else if (!e.isIntersecting) offerList.classList.remove('in-view');
    });
  }, { threshold: [0, 0.2] });
  listObserver.observe(offerList);
}

// ===========================
// Bouton « compte gratuit » : texte qui donne envie de cliquer
// (modifiez simplement la phrase ci-dessous)
// ===========================
const CTA_TEXT = 'Découvrez votre espace gratuit';
document.querySelectorAll('.plan-cta-note').forEach((a) => {
  a.innerHTML = `${CTA_TEXT}<span class="plan-cta-arrow">→</span>`;
});

// ===========================
// MUSIQUE : lecture automatique + flèche qui indique où l'arrêter
//  1) À l'arrivée : la musique démarre toute seule si le navigateur l'autorise.
//     Sur mobile il l'interdit presque toujours : dans ce cas une flèche descend
//     vers le bouton son avec « Touchez l'écran pour activer la musique », et la
//     musique démarre dès le premier toucher n'importe où sur la page.
//  2) Quand la musique joue, une flèche descend vers le bouton son pour montrer
//     qu'on peut l'arrêter (« Vous pouvez arrêter la musique ici »).
//  3) Si le visiteur n'a pas touché au bouton, la flèche redescend une 2e fois
//     quand il a fait défiler la page.
// (utilise soundOn et updateIcon de script.js)
// ===========================
(function () {
  const bg = document.getElementById('bg-audio');
  const btn = document.getElementById('sound-toggle');
  if (!bg || !btn) return;

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const HINT_TEXT = 'Vous pouvez arrêter la musique ici';
  const PROMPT_TEXT = isTouch
    ? 'Touchez l\'écran pour activer la musique'
    : 'Cliquez n\'importe où pour activer la musique';
  const HINT_DURATION = 6000;      // durée d'affichage de la flèche (ms)
  const FIRST_HINT_AT = 2600;      // après le préchargeur (ms depuis l'ouverture)
  const SCROLL_TRIGGER = 1.2;      // 2e flèche : après 1,2 écran de défilement

  // On charge le fichier à l'avance : au premier toucher, le son part tout de suite
  bg.preload = 'auto';
  bg.addEventListener('error', () => {
    console.error('Vencraft — le fichier audio/ambiance.mp3 est introuvable ou illisible.');
  });

  const hint = document.createElement('div');
  hint.className = 'sound-hint';
  hint.setAttribute('role', 'status');
  hint.setAttribute('aria-live', 'polite');
  hint.innerHTML =
    '<span class="sound-hint-text"></span>' +
    '<span class="sound-hint-arrow" aria-hidden="true">↓</span>';
  document.body.appendChild(hint);
  const hintText = hint.querySelector('.sound-hint-text');

  let userToggled = false;
  let secondShown = false;
  let promptAgain = true;
  let hideTimer;

  function hideHint() {
    clearTimeout(hideTimer);
    hint.classList.remove('is-visible');
    btn.classList.remove('is-hinted');
  }

  // force = true : on affiche même si la musique ne joue pas (invitation à l'activer)
  function showHint(text, force) {
    if (userToggled) return false;
    if (!force && bg.paused) return false;
    hintText.textContent = text;
    hint.classList.add('is-visible');
    btn.classList.add('is-hinted');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideHint, HINT_DURATION);
    return true;
  }

  function startMusic() {
    bg.volume = 0.35;
    return bg.play().then(() => {
      if (typeof soundOn !== 'undefined') soundOn = true;
      if (typeof updateIcon === 'function') updateIcon();
      return true;
    }).catch(() => false);
  }

  function afterDelay(fn) {
    setTimeout(fn, Math.max(800, FIRST_HINT_AT - performance.now()));
  }

  // Le visiteur touche au bouton son : il a compris, on arrête les indications
  btn.addEventListener('click', () => { userToggled = true; hideHint(); });
  hint.addEventListener('click', hideHint);

  // 1) Tentative de lecture automatique dès l'arrivée
  startMusic().then((ok) => {
    if (ok) { afterDelay(() => showHint(HINT_TEXT)); return; }

    // Le navigateur bloque : on invite à toucher l'écran
    afterDelay(() => { if (bg.paused) showHint(PROMPT_TEXT, true); });

    // Un vrai geste est exigé (sur mobile : un toucher, pas un simple défilement).
    // On réessaie à chaque geste jusqu'à ce que la musique démarre vraiment.
    const unlockEvents = ['pointerup', 'touchend', 'click', 'keydown'];
    let trying = false;
    function stopListening() {
      unlockEvents.forEach((n) => document.removeEventListener(n, unlock, true));
    }
    function unlock(e) {
      if (userToggled || !bg.paused) { stopListening(); return; }
      if (e.target && e.target.closest && e.target.closest('#sound-toggle')) return; // le bouton son gère ce clic
      if (trying) return;
      trying = true;
      startMusic().then((started) => {
        trying = false;
        if (started) {
          stopListening();
          hideHint();
          afterDelay(() => showHint(HINT_TEXT));
        }
      });
    }
    unlockEvents.forEach((n) => document.addEventListener(n, unlock, true));
  });

  // 2) Après un défilement : on rappelle (invitation si pas de son, sinon « arrêter »)
  function onScrollHint() {
    if (secondShown || userToggled) { window.removeEventListener('scroll', onScrollHint); return; }
    if (hint.classList.contains('is-visible')) return;
    if (window.scrollY <= window.innerHeight * SCROLL_TRIGGER) return;

    if (bg.paused) {
      if (promptAgain) { promptAgain = false; showHint(PROMPT_TEXT, true); }
    } else if (showHint(HINT_TEXT)) {
      secondShown = true;
      window.removeEventListener('scroll', onScrollHint);
    }
  }
  window.addEventListener('scroll', onScrollHint, { passive: true });
})();