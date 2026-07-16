import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Find treks' },
  { to: '/new-permit', label: 'New safety card' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="border-b border-slate-light/40 bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-moss-dark">Trailhead</span>
        </Link>
        <nav className="flex gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors ' +
                  (active
                    ? 'bg-moss text-paper'
                    : 'text-ink/70 hover:bg-canvas hover:text-ink')
                }
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
