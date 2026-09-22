import { useEffect, useState } from 'react'
import Character from './pages/Character'
import type { CharacterData } from './types/character'
import logo from './assets/Rick_and_Morty_logo.png'

function App() {
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((response) => response.json())
      .then((data: { results: CharacterData[] }) => setCharacters(data.results))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const characterId = Number(currentPath.split('/')[2])
    const character = characters.find(({ id }) => id === characterId)

    setSelectedCharacter(currentPath.startsWith('/character/') ? character ?? null : null)
  }, [characters, currentPath])

  function loadCharacterDetails(characterId: number) {
    const character = characters.find(({ id }) => id === characterId)
    window.history.pushState({}, '', `/character/${characterId}`)
    setCurrentPath(`/character/${characterId}`)
    setSelectedCharacter(character ?? null)
  }

  function goBackToCharacters() {
    window.history.pushState({}, '', '/')
    setCurrentPath('/')
    setSelectedCharacter(null)
  }

  if (selectedCharacter) {
    return <Character character={selectedCharacter} onBack={goBackToCharacters} />
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <header className="main-header">
          <h2><img className="site-logo" src={logo} alt="Rick and Morty" /></h2>
        </header>
        <header className="second-header">
          <p>Voici une liste de personnages de Rick and Morty</p>
        </header>

        {loading && <p>Chargement...</p>}

        {!loading && (
          <main className="character-grid" aria-label="Personnages">
            {characters.map((character) => (
              <button
                className="character-card"
                key={character.id}
                onClick={() => loadCharacterDetails(character.id)}
                type="button"
              >
                <img src={character.image} alt={character.name} />
                <span>{character.name}</span>
              </button>
            ))}
          </main>
        )}

    </div>
  );
}

export default App
