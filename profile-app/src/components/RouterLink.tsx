import type { ReactNode } from 'react'
import { useNavigation } from '../routing/NavigationContext'

function RouterLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  const { navigate } = useNavigation()

  return <a className={className} href={to} onClick={(event) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault()
      navigate(to)
    }
  }}>{children}</a>
}

export default RouterLink