import { useEffect, useState, type ReactNode } from 'react'
import { NavigationContext } from './NavigationContext'

function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  function navigate(path: string) {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return <NavigationContext.Provider value={{ currentPath, navigate }}>{children}</NavigationContext.Provider>
}

export default NavigationProvider