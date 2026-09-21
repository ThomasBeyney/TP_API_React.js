import { useEffect, useState } from 'react'
import './App.css'

type Character = {
  id: number
  name: string
  image: string
  status: string
  species: string
  gender: string
  origin: { name: string }
  location: { name: string }
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((response) => response.json())
      .then((data: { results: Character[] }) => setCharacters(data.results))
      .finally(() => setLoading(false))
  }, [])

  function loadCharacterDetails(characterId: number) {
    const character = characters.find(({ id }) => id === characterId)
    setSelectedCharacter(character ?? null)
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1>Salut Test 1</h1>
        <p>c'est pas bo</p>
        <p>mais bon</p>

        {loading && <p>Chargement...</p>}

        {!loading && characters.map((character) => (
          <button
            key={character.id}
            onClick={() => loadCharacterDetails(character.id)}
            type="button"
          >
            <img src={character.image} alt={character.name} width={100} />
            <span>{character.name}</span>
          </button>
        ))}

        {selectedCharacter && (
          <div>
            <h2>{selectedCharacter.name}</h2>
            <p>Statut : {selectedCharacter.status}</p>
            <p>Espèce : {selectedCharacter.species}</p>
            <p>Genre : {selectedCharacter.gender}</p>
            <p>Origine : {selectedCharacter.origin.name}</p>
            <p>Localisation : {selectedCharacter.location.name}</p>
          </div>
        )}
    </div>
  );
}

export default App
