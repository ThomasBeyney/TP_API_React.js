import CharacterGrid from '../components/CharacterGrid'
import { useFavorites } from '../hooks/useFavorites'
import { useCharactersByIds } from '../hooks/useCharactersByIds'

function FavoritesPage() {
  const { favorites } = useFavorites()
  const { characters, loading, error } = useCharactersByIds(favorites)

  if (loading) return <p className="message">Chargement...</p>
  if (error) return <p className="message error" role="alert">{error}</p>

  return <main className="app-content">
    <h1>Mes favoris</h1>
    {characters.length === 0
      ? <p>Aucun favori pour le moment.</p>
      : <CharacterGrid characters={characters} />}
  </main>
}

export default FavoritesPage