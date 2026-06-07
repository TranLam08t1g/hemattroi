import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Trang Chủ' },
  { to: '/planets', label: 'Hành Tinh' },
  { to: '/gallery', label: 'Thư Viện' },
  { to: '/about', label: 'Giới Thiệu' },
]

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
      <Link
        to="/"
        className="font-heading text-sm font-bold tracking-[0.35em] uppercase text-white"
      >
        Solaris
      </Link>
      <ul className="flex list-none gap-6 md:gap-10">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`relative pb-1 text-[11px] font-medium tracking-[0.25em] uppercase transition-colors duration-300 ${
                pathname === link.to ? 'text-white' : 'text-[#4a4a5a] hover:text-white'
              }`}
            >
              {link.label}
              {pathname === link.to && (
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-white" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
