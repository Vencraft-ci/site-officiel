/* ==========================================================================
   VENCRAFT — main.js (vanilla JS, no dependencies)
   ========================================================================== */

// Numéro WhatsApp de Vencraft
// Format international sans le "+", sans espaces (ex: 2250151030957)
const WHATSAPP_NUMBER = "2250151030957";

const OFFER_CATEGORIES = {
  catalogue: {
    label: "Service en ligne avec un lien",
    intro: "Je souhaite discuter d’un projet de service en ligne avec un lien.",
    offers: [
      { id: "essentiel", name: "Essentiel", price: "20 000 FCFA" },
      { id: "croissance", name: "Croissance", price: "40 000 FCFA" },
      { id: "impact", name: "Impact", price: "60 000 FCFA" },
      { id: "sur-mesure", name: "Sur mesure", price: "Sur devis" }
    ]
  },
  domain: {
    label: "Site web avec domaine",
    intro: "Je souhaite discuter d’un projet de site web avec domaine.",
    offers: [
      { id: "site-essentiel", name: "Site Essentiel", price: "À partir de 100 000 FCFA" },
      { id: "site-croissance", name: "Site Croissance", price: "À partir de 150 000 FCFA" },
      { id: "site-impact", name: "Site Impact", price: "À partir de 200 000 FCFA" },
      { id: "site-sur-mesure", name: "Site Sur mesure", price: "Sur devis" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  initSelectionFlow();
  initYear();
});

/* ---------------- mobile nav ---------------- */
function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".mobile-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ---------------- scroll reveal ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function initYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------- helper: read URL params (pré-remplissage depuis services.html) ---------------- */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ==========================================================================
   SELECTION FLOW — commande.html
   Niveau 1 : catégorie (catalogue / domain / je-ne-sais-pas)
   Niveau 2 : offre selon la catégorie choisie
   ========================================================================== */
function initSelectionFlow() {
  const flow = document.querySelector("[data-selection-flow]");
  if (!flow) return;

  const state = {
    track: null, // "catalogue" | "domain" | "unsure"
    offerId: null
  };

  const level1Cards = flow.querySelectorAll('input[name="track"]');
  const level2Catalogue = flow.querySelector('[data-level2="catalogue"]');
  const level2Domain = flow.querySelector('[data-level2="domain"]');
  const offerGridCatalogue = flow.querySelector('[data-offer-grid="catalogue"]');
  const offerGridDomain = flow.querySelector('[data-offer-grid="domain"]');

  const summaryTrack = document.querySelector("[data-summary-track]");
  const summaryOffer = document.querySelector("[data-summary-offer]");
  const summaryPrice = document.querySelector("[data-summary-price]");
  const summaryEmpty = document.querySelector("[data-summary-empty]");
  const summaryRows = document.querySelector("[data-summary-rows]");
  const summaryNote = document.querySelector("[data-summary-note]");

  const waButton = document.querySelector("[data-whatsapp-submit]");
  const formError = document.querySelector("[data-form-error]");

  // build offer choice cards dynamically from OFFER_CATEGORIES
  buildOfferGrid(offerGridCatalogue, "catalogue", OFFER_CATEGORIES.catalogue.offers);
  buildOfferGrid(offerGridDomain, "domain", OFFER_CATEGORIES.domain.offers);

  function buildOfferGrid(container, trackKey, offers) {
    if (!container) return;
    container.innerHTML = "";
    offers.forEach((offer) => {
      const label = document.createElement("label");
      label.className = `choice-card track-${trackKey === "catalogue" ? "catalogue" : "site"}`;
      label.innerHTML = `
        <input type="radio" name="offer-${trackKey}" value="${offer.id}" data-name="${offer.name}" data-price="${offer.price}">
        <span class="cc-name">${offer.name}</span>
        <span class="cc-price">${offer.price}</span>
      `;
      container.appendChild(label);
      label.querySelector("input").addEventListener("change", () => {
        container.querySelectorAll(".choice-card").forEach((c) => c.classList.remove("checked"));
        label.classList.add("checked");
        state.offerId = offer.id;
        updateSummary(trackKey, offer.name, offer.price);
      });
    });
  }

  level1Cards.forEach((input) => {
    input.addEventListener("change", () => {
      flow.querySelectorAll(".choice-card").forEach((c) => {
        if (c.contains(input)) c.classList.add("checked");
      });
      // un-check siblings visually
      level1Cards.forEach((i) => {
        if (i !== input) i.closest(".choice-card")?.classList.remove("checked");
      });
      input.closest(".choice-card")?.classList.add("checked");

      state.track = input.value;
      state.offerId = null;

      level2Catalogue?.classList.remove("active");
      level2Domain?.classList.remove("active");

      if (input.value === "catalogue") {
        level2Catalogue?.classList.add("active");
        resetSummary();
        summaryTrack && (summaryTrack.textContent = OFFER_CATEGORIES.catalogue.label);
      } else if (input.value === "domain") {
        level2Domain?.classList.add("active");
        resetSummary();
        summaryTrack && (summaryTrack.textContent = OFFER_CATEGORIES.domain.label);
      } else {
        resetSummary();
        summaryTrack && (summaryTrack.textContent = "À définir ensemble");
      }
      renderSummaryVisibility();
    });
  });

  function resetSummary() {
    summaryOffer && (summaryOffer.textContent = "—");
    summaryPrice && (summaryPrice.textContent = "—");
  }

  function updateSummary(trackKey, offerName, offerPrice) {
    summaryOffer && (summaryOffer.textContent = offerName);
    summaryPrice && (summaryPrice.textContent = offerPrice);
    renderSummaryVisibility();
  }

  function renderSummaryVisibility() {
    const hasTrack = !!state.track;
    if (summaryEmpty) summaryEmpty.style.display = hasTrack ? "none" : "block";
    if (summaryRows) summaryRows.style.display = hasTrack ? "flex" : "none";
    if (summaryNote) summaryNote.style.display = hasTrack ? "block" : "none";
  }
  renderSummaryVisibility();

  // pré-remplissage depuis services.html (?track=catalogue&offer=croissance)
  const prefTrack = getParam("track");
  const prefOffer = getParam("offer");
  if (prefTrack === "catalogue" || prefTrack === "domain") {
    const input = flow.querySelector(`input[name="track"][value="${prefTrack}"]`);
    if (input) {
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      if (prefOffer) {
        setTimeout(() => {
          const offerInput = flow.querySelector(`input[value="${prefOffer}"]`);
          if (offerInput) {
            offerInput.checked = true;
            offerInput.dispatchEvent(new Event("change"));
          }
        }, 0);
      }
    }
  }

  // ---------------- form submission -> WhatsApp ----------------
  const form = document.querySelector("[data-order-form]");
  if (!form || !waButton) return;

  waButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (formError) formError.classList.remove("show");

    if (!state.track || state.track === "unsure") {
      showError("Merci de choisir une catégorie et une offre avant de continuer, ou de nous contacter directement pour être guidé.");
      return;
    }
    if (!state.offerId) {
      showError("Merci de sélectionner une offre pour continuer.");
      return;
    }

    const nom = form.querySelector("#nom")?.value.trim();
    const entreprise = form.querySelector("#entreprise")?.value.trim();
    const ville = form.querySelector("#ville")?.value.trim();
    const numero = form.querySelector("#numero")?.value.trim();
    const objectif = form.querySelector("#objectif")?.value.trim();
    const description = form.querySelector("#description")?.value.trim();
    const infos = form.querySelector("#infos")?.value.trim();

    if (!nom || !numero) {
      showError("Merci de renseigner au moins votre nom et votre numéro WhatsApp.");
      return;
    }

    const category = OFFER_CATEGORIES[state.track === "catalogue" ? "catalogue" : "domain"];
    const offer = category.offers.find((o) => o.id === state.offerId);
    if (!offer) {
      showError("Merci de sélectionner une offre pour continuer.");
      return;
    }

    const message = buildWhatsAppMessage({
      isDomain: state.track === "domain",
      offerName: offer.name,
      offerPrice: offer.price,
      nom, entreprise, ville, numero, objectif, description, infos
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.classList.add("show");
  }
}

function buildWhatsAppMessage({ isDomain, offerName, offerPrice, nom, entreprise, ville, numero, objectif, description, infos }) {
  const intro = isDomain
    ? "Je souhaite discuter d’un projet de site web avec domaine."
    : "Je souhaite discuter d’un projet de service en ligne avec un lien.";

  return [
    "Bonjour Vencraft,",
    "",
    intro,
    "",
    `Offre qui m’intéresse : ${offerName}`,
    `Prix affiché : ${offerPrice}`,
    "",
    `Nom : ${nom || "-"}`,
    `Entreprise : ${entreprise || "-"}`,
    `Ville : ${ville || "-"}`,
    `Numéro WhatsApp : ${numero || "-"}`,
    "",
    "Objectif :",
    objectif || "-",
    "",
    "Description de mon activité :",
    description || "-",
    "",
    "Informations utiles :",
    infos || "-",
    "",
    "Merci."
  ].join("\n");
}

/* ==========================================================================
   Boutons "Choisir cette offre" sur services.html -> redirige vers
   commande.html avec la catégorie et l'offre pré-sélectionnées
   ========================================================================== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-goto-order]");
  if (!btn) return;
  const track = btn.getAttribute("data-track");
  const offer = btn.getAttribute("data-offer");
  const base = btn.getAttribute("data-base") || "commande.html";
  window.location.href = `${base}?track=${encodeURIComponent(track)}&offer=${encodeURIComponent(offer)}`;
});
