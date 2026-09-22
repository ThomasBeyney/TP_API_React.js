// 1. Sous-types pour les objets imbriqués
export interface LocationRef {
  name: string;
  url: string;
}

// Union de types littéraux pour limiter les valeurs possibles (évite string trop large)
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

// Type complet des persinnages
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string; // parfois vide ""
  gender: CharacterGender;
  origin: LocationRef;
  location: LocationRef;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Type des métadonnées de pagination
export interface PageInfo {
  count: number;
  pages: number;
  next: string | null; // null sur la dernière page
  prev: string | null; // null sur la première page
}

//  Réponse globale de la liste d'API (paginée)
export interface ApiResponse {
  info: PageInfo;
  results: Character[];
}
