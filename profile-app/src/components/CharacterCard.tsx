import { useFavorites } from '../context/FavoritesContext'
import RouterLink from './RouterLink'
import type { CharacterData } from '../types/character'

function CharacterCard({ character }: { character: CharacterData }) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = favorites.includes(character.id)

  return <article className="character-card">
    <RouterLink to={`/character/${character.id}`}>
      {character.image && <img src={character.image} alt={character.name ?? 'Personnage'} />}
      <span>{character.name ?? 'Sans nom'}</span>
    </RouterLink>
    <button className="favorite-button" onClick={() => toggleFavorite(character.id)} type="button">
      {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </button>
  </article>
}

export default CharacterCard