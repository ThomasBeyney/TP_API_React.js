# Annuaire Rick et Morty

Application React permettant de parcourir et rechercher les personnages de la série Rick et Morty.

## Équipe et API

- BEYNEY Thomas
- Esteban KLAPCZYNSKI
- API : [The Rick and Morty API](https://rickandmortyapi.com/documentation), endpoint REST `/api/character`.

## Application déployée

[https://tp-api-react-js.vercel.app](https://tp-api-react-js.vercel.app)

## Installation et lancement

Depuis la racine du dépôt :

```bash
cd profile-app
npm install
```

Créer `profile-app/.env.local` et y ajouter l’URL de l’API :

```env
VITE_API_URL=https://rickandmortyapi.com/api/character
```

Lancer le serveur de développement :

```bash
npm run dev
```

Commandes de vérification :

```bash
npm run build
npm run lint
```

## Fonctionnalités

- Liste des personnages avec 20 résultats maximum par page.
- Pagination avec navigation entre les pages.
- Recherche par nom et filtres par genre, espèce, origine, localisation et état.
- Recherche et filtres appliqués à l’ensemble des personnages, pas seulement à la page visible.
- Fiche détaillée d’un personnage.
- Ajout et retrait de personnages des favoris.
- Navigation entre les pages Personnages, Favoris et À propos.

## Optimisation et mesures

La liste complète est chargée en suivant la pagination fournie par `info.next`, puis conservée en mémoire pendant la session. La recherche globale peut ainsi fonctionner sur tous les personnages sans refaire le chargement à chaque changement de filtre ou de page. L’affichage reste limité à 20 personnages par page.

- Avant : une requête chargeait une seule page de 20 personnages ; la recherche et les filtres ne couvraient que cette page.
- Après : le premier chargement parcourt les 42 pages de l’API (826 personnages au total, 20 par page au maximum). Une fois les données en cache, changer de filtre ou de page ne déclenche aucune nouvelle requête de liste.
- Ces chiffres sont le comptage des pages et requêtes dans le code, pas un benchmark chronométré. Le temps de chargement initial n’a pas été mesuré.

## Tests et limites

Vérifications effectuées : `npm run build` (compilation TypeScript et build Vite) et `npm run lint` (ESLint).

Aucun test unitaire ou test automatisé de navigateur n’est configuré. Le chargement dépend de la disponibilité de l’API distante et peut échouer si celle-ci limite les requêtes.

## Avec une semaine de plus

- Ajouter des tests unitaires pour les filtres, la pagination et les favoris, ainsi que des tests de parcours dans le navigateur.
- Ajouter un indicateur de progression et une action pour relancer un chargement échoué.
- Enregistrer les favoris dans le stockage local du navigateur.
- Mesurer le temps de chargement sur plusieurs connexions et optimiser le chargement initial si nécessaire.