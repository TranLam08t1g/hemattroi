import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Trang Chủ' },
  { to: '/planets', label: 'Mặt Trăng' },
  { to: '/gallery', label: 'Hành tinh' },
  { to: '/about', label: 'Giới Thiệu' },
]

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-8 rounded-full border border-white/10 bg-black/60 px-8 py-3 backdrop-blur-2xl">
        <Link
          to="/"
          className="font-heading text-sm font-bold tracking-[0.35em] uppercase text-white transition-colors duration-300 hover:text-[#00D4FF]"
        >
          Solaris
        </Link>
        <div className="h-5 w-px bg-white/10" />
        <ul className="flex list-none gap-6">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`relative pb-1 text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-300 ${
                  pathname === link.to
                    ? 'text-[#00D4FF]'
                    : 'text-[#4a4a5a] hover:text-white'
                }`}
              >
                {link.label}
                {pathname === link.to && (
                  <span className="absolute -bottom-1 left-1/2 h-[2px] w-4/5 -translate-x-1/2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}