import RouterLink from '../components/RouterLink'

function NotFoundPage() {
  return <main className="app-content">
    <h1>Page introuvable</h1>
    <p>Cette page n’existe pas.</p>
    <RouterLink to="/">Retour aux personnages</RouterLink>
  </main>
}

export default NotFoundPage