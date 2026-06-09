import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { useTranslation } from 'react-i18next'
import { Bell, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const VENDOR_LINKS = [
  { to: '/vendor/events',    en: 'Browse Events', ta: 'நிகழ்வுகள்' },
  { to: '/vendor/bids',      en: 'My Bids',       ta: 'என் ஏலங்கள்' },
  { to: '/vendor/dashboard', en: 'Dashboard',     ta: 'டாஷ்போர்டு' },
]
const CONSUMER_LINKS = [
  { to: '/consumer/post',      en: 'Post Event',  ta: 'நிகழ்வு பதிவிடு' },
  { to: '/consumer/events',    en: 'My Events',   ta: 'என் நிகழ்வுகள்' },
  { to: '/consumer/dashboard', en: 'Dashboard',   ta: 'டாஷ்போர்டு' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const isTa = i18n.language === 'ta'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setMenuOpen(false), [location.pathname])

  const toggleLang = () => i18n.changeLanguage(isTa ? 'en' : 'ta')
  const navLinks = user?.role === 'vendor' ? VENDOR_LINKS : CONSUMER_LINKS

  const roleColor = user
    ? { vendor: 'text-vivid border-vivid/40', admin: 'text-warn border-warn/40', consumer: 'text-success border-success/40' }[user.role]
    : ''
  const roleLabel = user
    ? { vendor: isTa ? 'சேவையாளர்' : 'Vendor', admin: 'Admin', consumer: isTa ? 'நடத்துனர்' : 'Host' }[user.role]
    : ''

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'py-3 glass-dark border-b border-white/6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : 'py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
          <div className="w-8 h-8 overflow-hidden flex-shrink-0">
            <img src="/logo_cropped.jpg" alt="HE&P" className="w-8 h-8 object-contain" style={{ mixBlendMode: 'screen' }} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[0.78rem] tracking-[0.24em] uppercase text-white group-hover:text-vivid transition-colors duration-200">HE&amp;P</span>
            <span className="text-[0.5rem] tracking-[0.16em] text-white/25 font-light mt-0.5 hidden sm:block">Harmony Events &amp; Productions</span>
          </div>
        </Link>

        {/* Desktop nav links (authenticated) */}
        {user && (
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'relative text-[0.68rem] tracking-[0.12em] uppercase font-medium transition-colors duration-200 no-underline py-1',
                    active ? 'text-white' : 'text-white/40 hover:text-white/75'
                  )}
                >
                  {isTa ? link.ta : link.en}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-vivid"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={toggleLang}
            className="text-[0.62rem] font-mono-hep tracking-widest uppercase text-white/30 hover:text-white/65 transition-colors border border-white/10 hover:border-white/20 px-2.5 py-1.5"
          >
            {isTa ? 'EN' : 'தமிழ்'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/notifications" className="relative no-underline text-white/35 hover:text-white/70 transition-colors w-8 h-8 flex items-center justify-center">
                <Bell size={16} strokeWidth={1.5} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-vivid rounded-full text-[0.42rem] font-bold text-white flex items-center justify-center">2</span>
              </Link>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className={cn('flex items-center gap-1.5 text-[0.62rem] font-semibold tracking-[0.14em] uppercase border px-3 py-1.5 outline-none transition-colors hover:bg-white/5', roleColor)}>
                    {roleLabel}
                    <ChevronDown size={10} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" sideOffset={8} className="z-50 min-w-[180px] glass-dark border border-white/10 py-1 animate-in fade-in-0 slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/8">
                      <p className="text-[0.7rem] text-white font-medium">{user.name || 'User'}</p>
                      <p className="text-[0.62rem] text-muted-hep">{user.phone}</p>
                    </div>
                    <DropdownMenu.Item
                      onSelect={() => { logout(); navigate('/') }}
                      className="flex items-center gap-2 px-3 py-2 text-[0.68rem] text-white/60 hover:text-white hover:bg-white/5 cursor-pointer outline-none transition-colors"
                    >
                      <LogOut size={12} />
                      {isTa ? 'வெளியேறு' : 'Sign out'}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase px-5 py-2.5 bg-gradient-to-r from-vivid to-vlight text-white hover:shadow-[0_0_24px_rgba(34,81,255,0.5)] transition-all duration-200 hover:-translate-y-px no-underline shadow-[0_4px_16px_rgba(34,81,255,0.3)]"
            >
              {isTa ? 'தொடங்குங்கள்' : 'Get Started'}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-white/60 hover:text-white transition-colors" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-dark border-t border-white/8 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {user && navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={cn('text-sm no-underline transition-colors', location.pathname.startsWith(link.to) ? 'text-white' : 'text-white/50 hover:text-white')}
                >
                  {isTa ? link.ta : link.en}
                </Link>
              ))}
              <div className="border-t border-white/8 pt-4 flex items-center justify-between">
                <button onClick={toggleLang} className="text-xs text-white/40 hover:text-white/70">
                  {isTa ? 'Switch to English' : 'தமிழிற்கு மாற'}
                </button>
                {user ? (
                  <button onClick={() => { logout(); navigate('/') }} className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1">
                    <LogOut size={12} /> {isTa ? 'வெளியேறு' : 'Sign out'}
                  </button>
                ) : (
                  <Link to="/login" className="text-xs text-vivid no-underline">{isTa ? 'தொடங்குங்கள்' : 'Get Started'} →</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
