import logo from '../assets/Rick_and_Morty_logo.png'
import RouterLink from './RouterLink'

function SiteHeader({ currentPath }: { currentPath: string }) {
  return <header className="main-header">
    <RouterLink to="/"><img className="site-logo" src={logo} alt="Rick and Morty" /></RouterLink>
    <nav className="main-nav" aria-label="Navigation principale">
      <RouterLink className={currentPath === '/' ? 'nav-link active' : 'nav-link'} to="/">Personnages</RouterLink>
      <RouterLink className={currentPath.startsWith('/favorites') ? 'nav-link active' : 'nav-link'} to="/favorites">Favoris</RouterLink>
      <RouterLink className={currentPath.startsWith('/about') ? 'nav-link active' : 'nav-link'} to="/about">À propos</RouterLink>
    </nav>
  </header>
}

export default SiteHeader