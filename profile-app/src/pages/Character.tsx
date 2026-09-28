import type { CharacterData } from '../types/character'

type CharacterProps = {
  character: CharacterData
  isFavorite: boolean
  onToggleFavorite: () => void
}

function Character({ character, isFavorite, onToggleFavorite }: CharacterProps) {
  const statusClass = `status-${(character.status ?? 'unknown').toLowerCase()}`

  return (
    <main className="character-page">
      <section className="character-profile">
        <div className="character-intro">
          {character.image && <img src={character.image} alt={character.name ?? 'Personnage'} width={300} />}
          <div>
            <h1>{character.name ?? 'Sans nom'}</h1>
            <span className={`status-badge ${statusClass}`}>{character.status ?? 'Inconnu'}</span>
          </div>
        </div>
        <button className="back-button" onClick={onToggleFavorite} type="button">
          {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
        <dl className="character-details">
          <div><dt>Espèce</dt><dd>{character.species ?? 'Inconnue'}</dd></div>
          <div><dt>Genre</dt><dd>{character.gender ?? 'Inconnu'}</dd></div>
          <div><dt>Origine</dt><dd>{character.origin?.name ?? 'Inconnue'}</dd></div>
          <div><dt>Localisation</dt><dd>{character.location?.name ?? 'Inconnue'}</dd></div>
        </dl>
      </section>
    </main>
  )
}

export default Character
