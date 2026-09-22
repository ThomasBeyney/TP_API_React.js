import type { CharacterData } from '../types/character'
import logo from '../assets/Rick_and_Morty_logo.png'

type CharacterProps = {
  character: CharacterData
  onBack: () => void
}

function Character({ character, onBack }: CharacterProps) {
  return (
    <main className="character-page">
      <header className="main-header">
        <h2><img className="site-logo" src={logo} alt="Rick and Morty" /></h2>
      </header>
      <section className="character-profile">
        <button className="back-button" onClick={onBack} type="button">Retour</button>
        <div className="character-intro">
          <img src={character.image} alt={character.name} width={300} />
          <div>
            <h1>{character.name}</h1>
            <span className="status-badge">{character.status}</span>
          </div>
        </div>
        <dl className="character-details">
          <div><dt>Espèce</dt><dd>{character.species}</dd></div>
          <div><dt>Genre</dt><dd>{character.gender}</dd></div>
          <div><dt>Origine</dt><dd>{character.origin.name}</dd></div>
          <div><dt>Localisation</dt><dd>{character.location.name}</dd></div>
        </dl>
      </section>
    </main>
  )
}

export default Character
