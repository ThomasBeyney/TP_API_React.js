import { useFavorites } from '../hooks/useFavorites'
import { useCharacters } from '../hooks/useCharacters'
import Character from './Character'

function CharacterPage({ id }: { id: number }) {
  const { characters, loading, error } = useCharacters()
  const { favorites, toggleFavorite } = useFavorites()
  const character = characters.find((item) => item.id === id)

  if (loading) return <p className="message">Chargement...</p>
  if (error) return <p className="message error" role="alert">{error}</p>
  if (!character) return <p className="message">Personnage introuvable.</p>

  return <Character character={character} isFavorite={favorites.includes(id)} onToggleFavorite={() => toggleFavorite(id)} />
}

export default CharacterPage