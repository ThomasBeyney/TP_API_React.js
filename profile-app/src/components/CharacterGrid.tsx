import CharacterCard from './CharacterCard'
import type { CharacterData } from '../types/character'

function CharacterGrid({ characters, emptyMessage = 'Aucun personnage trouvé.' }: { characters: CharacterData[]; emptyMessage?: string }) {
  return <section className="character-grid" aria-label="Personnages">
    {characters.map((character) => <CharacterCard character={character} key={character.id} />)}
    {characters.length === 0 && <p className="no-results">{emptyMessage}</p>}
  </section>
}

export default CharacterGrid