# Vencraft-CI — Mini-site

Site statique (HTML/CSS/JS natif), conforme au cahier des charges V1.

## Liens à remplacer avant mise en ligne

1. **Chaîne WhatsApp** (nav, en haut) → dans `index.html`, remplacer
   `https://whatsapp.com/channel/REMPLACER_PAR_VOTRE_LIEN` par le lien réel de votre chaîne.
2. **Instagram** (nav, en haut) → remplacer
   `https://instagram.com/REMPLACER_PAR_VOTRE_COMPTE` par l'URL de votre compte.
3. **Facebook / TikTok** (footer) → les icônes pointent encore vers `#`, à remplacer par vos vraies pages.

## Images à remplacer

1. **Image "Dépassement de soi"** → `images/depassement-de-soi.webp`
   - Décommenter la ligne `background-image` dans `.hero` (css/style.css)
   - Idem pour `.mouvement` si vous utilisez la même photo en Section 4
   - Un repère visuel (badge en pointillés) indique la zone tant que l'image n'est pas posée — à retirer une fois faite (classe `.placeholder-corner` dans le HTML)

2. **Image "Tranquillité"** → `images/tranquillite.webp`
   - Décommenter la ligne `background-image` dans `.presentation-image` (css/style.css)
   - Retirer le bloc `.placeholder-mark` correspondant dans le HTML une fois l'image posée

3. **Audio d'ambiance** → `audio/ambiance.mp3`
   - Fichier MP3 léger (< 1 Mo), libre de droits (Pixabay Audio, Free Music Archive)
   - Déposer le fichier à cet emplacement exact ; aucune modification de code nécessaire

En attendant ces fichiers, le site utilise des dégradés violets en placeholder pour les images, et le bouton son se désactive proprement si l'audio n'est pas trouvé.

## Logo

Le logo fourni a été détouré automatiquement (fond transparent) en deux versions :
- `images/logo.png` — noir, utilisé dans la barre de navigation (fond clair)
- `images/logo-white.png` — blanc, utilisé dans le footer (fond sombre)
- `images/favicon.png` — miniature utilisée comme favicon

## Déploiement sur GitHub Pages

1. Créer un dépôt (ex. `vencraft-ci.github.io` ou un dépôt classique avec Pages activé)
2. Pousser tout le contenu de ce dossier à la racine du dépôt
3. Dans les paramètres du dépôt → Pages → choisir la branche `main` et le dossier `/ (root)`
4. Le site sera accessible à l'URL générée par GitHub (ou un domaine personnalisé à configurer ensuite)

## Structure

```
index.html
css/style.css
js/script.js
images/   (logo.png, logo-white.png, favicon.png — photos à ajouter)
audio/    (à compléter)
```
