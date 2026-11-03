# Portfolio — Fanilo Andriantenaina

Deux sites statiques bilingues (FR / EN) qui partagent le même contenu :

| Dossier | Version | Stack | Port local |
|---|---|---|---|
| `pro/` | Moderne : hero animé (flux de données en canvas, titre à mot changeant, compteurs), cartes projets avec aperçu animé, schéma d'architecture interactif (survol / focus = explication, paquets de données qui circulent), animations au défilement. Bricolage Grotesque + IBM Plex. | Astro 7 · Tailwind CSS 4 · Motion | 4321 |
| `creative/` | Affiche 3D : pipeline de données en WebGL que la caméra parcourt au défilement, étape active en vermillon et synchronisée avec un rail d'étapes. Poster statique sur mobile et appareils modestes. | Astro 7 · Tailwind CSS 4 · React Three Fiber · Lenis | 4322 |

Identité commune : 4 palettes au choix (Cobalt par défaut, Émeraude, Violet, Klein), chacune en clair et en sombre ; le thème suit l'appareil et le visiteur peut changer palette et thème dans l'en-tête (choix mémorisé). Les palettes sont dans `shared/styles/palettes.css`, la liste et le sélecteur dans `shared/palettes.ts`. Échelle typographique fluide de 320 px au 4K, styles d'impression, contraste élevé Windows (`forced-colors`) et `prefers-contrast`.

Forcer la 3D ou le poster pour tester : ajoutez `?3d=1` ou `?3d=0` à l'URL du site créatif.
| `shared/` | Contenu FR/EN, SEO (JSON-LD), formulaire de contact, CV, génération des PDF et images OG | TypeScript | — |

## Modifier le contenu

Tout le texte est dans `shared/content/fr.ts` et `shared/content/en.ts` (mêmes clés dans les deux).
Coordonnées, liens et photo : `shared/content/index.ts` (`profile`).

- **Photo** : déposez `photo.jpg` (carrée, 400 px min.) dans `pro/public/` et `creative/public/`, puis mettez `photo: '/photo.jpg'`. Sans photo, un monogramme « FA » s'affiche.
- **GitHub** : renseignez `profile.github` ; ajoutez vos dépôts dans `labs.items` (FR et EN). La section « Open source & labs » apparaît automatiquement.
- **CV** : sources HTML dans `shared/cv/` ; `npm run assets` régénère les PDF et les images de partage (Chrome ou Edge requis).

## Les deux versions sur un seul site

Les deux versions sont publiées ensemble, sur le même domaine :

| URL | Version |
|---|---|
| `/fr/`, `/en/`, `/fr/projects/…` | Classique (par défaut) |
| `/3d/fr/`, `/3d/en/` | 3D |
| `/` | Redirige selon la langue du navigateur et le **dernier choix du visiteur** |

- Un bouton dans l'en-tête (« 3D » / « Version 3D », et « Version classique » côté 3D) permet de basculer ; il est aussi dans le menu mobile et le pied de page. Le choix est mémorisé (`localStorage.version`).
- Les liens partagés (`/fr/`, `/3d/en/`…) ouvrent toujours la version qu'ils désignent : seule la racine `/` tient compte du choix mémorisé.
- Palette, thème et langue sont communs aux deux versions.
- Référencement : les pages 3D déclarent la version classique comme URL canonique, et seul le sitemap de la version classique est publié (pas de contenu dupliqué).

## En local

```bash
npm install
npm run build           # CV/images + vérification TypeScript + build des 2 sites + fusion
npm run preview         # http://localhost:4321  (classique à /, 3D à /3d/)
```

Pour développer une version à la fois (rechargement à chaud) :

```bash
npm run dev:pro         # http://localhost:4321/fr/
npm run dev:creative    # http://localhost:4322/3d/fr/
```

En mode dev séparé, le bouton qui mène à l'autre version ne fonctionne pas (deux ports différents) : utilisez `npm run build && npm run preview` pour tester la bascule.

Résultat du build : **un seul dossier à publier, `pro/dist/`** (la version 3D est copiée dans `pro/dist/3d/` par `shared/scripts/merge-sites.mjs`).

## Configuration (`.env`)

Copiez `.env.example` dans `pro/.env` **et** `creative/.env` (même contenu) :

- `SITE_URL` : URL publique finale, la même pour les deux (**obligatoire avant de déployer**, sinon canonical, sitemap et Open Graph pointent vers localhost).
- `PUBLIC_WEB3FORMS_KEY` : clé gratuite sur web3forms.com pour recevoir les messages du formulaire par e-mail. Sans clé, le formulaire ouvre le client mail du visiteur.
- `PUBLIC_UMAMI_SRC` / `PUBLIC_UMAMI_ID` : statistiques sans cookie (facultatif).

## Déployer

**Vercel ou Netlify** (le plus simple) : importez le dépôt avec :
- Root directory : `.` (racine du dossier `portfolio`)
- Build command : `npm run build -w pro && npm run build -w creative && node shared/scripts/merge-sites.mjs`
- Output directory : `pro/dist`
- Variables d'environnement : celles de `.env`

Lancez `npm run assets` en local et committez les fichiers générés dans `pro/public/` et `creative/public/` : les serveurs de build n'ont pas toujours Chrome.

**GitHub Pages / tout hébergement statique** : `npm run build`, puis publiez le contenu de `pro/dist/`.

Après la mise en ligne :
1. Soumettez `https://votre-domaine/sitemap-index.xml` dans Google Search Console et Bing Webmaster Tools.
2. Ajoutez l'URL dans LinkedIn (section Sélection + coordonnées) et sur le CV.
3. Testez l'aperçu de partage avec le LinkedIn Post Inspector.
