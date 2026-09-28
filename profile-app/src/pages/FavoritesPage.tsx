import CharacterGrid from '../components/CharacterGrid'
import { useFavorites } from '../context/FavoritesContext'
import { useCharacters } from '../hooks/useCharacters'

function FavoritesPage() {
  const { characters, loading, error } = useCharacters()
  const { favorites } = useFavorites()

  if (loading) return <p className="message">Chargement...</p>
  if (error) return <p className="message error" role="alert">{error}</p>

  const savedCharacters = characters.filter((character) => favorites.includes(character.id))

  return <main className="app-content">
    <h1>Mes favoris</h1>
    {savedCharacters.length === 0
      ? <p>Aucun favori pour le moment.</p>
      : <CharacterGrid characters={savedCharacters} />}
  </main>
}

export default FavoritesPage