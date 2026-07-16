import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Find treks' },
  { to: '/new-permit', label: 'New safety card' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-500">
            <path d="M12 2L2 20H22L12 2Z" fill="currentColor" opacity="0.9"/>
            <path d="M12 8L7 18H17L12 8Z" fill="#60A5FA" opacity="0.7"/>
          </svg>
          <span className="font-display text-lg font-semibold text-gray-100">Trailhead</span>
        </Link>
        <nav className="flex gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ' +
                  (active
                    ? 'bg-gray-800 text-gray-100'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200')
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
