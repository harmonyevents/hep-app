import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { useTranslation } from 'react-i18next'
import { Bell, LogOut, Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const PUBLIC_LINKS = [
  { to: '/',         en: 'Home',         ta: 'முகப்பு' },
  { to: '/vendor/events', en: 'Vendors',  ta: 'சேவையாளர்கள்' },
  { to: '#how',      en: 'How it works', ta: 'எப்படி' },
  { to: '#pricing',  en: 'Pricing',      ta: 'விலை' },
  { to: '#help',     en: 'Help',         ta: 'உதவி' },
]

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
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setMenuOpen(false), [location.pathname])

  const toggleLang = () => i18n.changeLanguage(isTa ? 'en' : 'ta')
  const navLinks = user?.role === 'vendor' ? VENDOR_LINKS : user?.role === 'consumer' ? CONSUMER_LINKS : PUBLIC_LINKS

  const roleLabel = user
    ? { vendor: isTa ? 'சேவையாளர்' : 'Vendor', admin: 'Admin', consumer: isTa ? 'நடத்துனர்' : 'Host' }[user.role]
    : ''

  // Initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'HE'

  return (
    <nav
      style={scrolled
        ? { background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #E4E4E4', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
        : { background: 'transparent' }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'py-3' : 'py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
          <img
            src="/logo_cropped.jpg"
            alt="HE&P"
            width={32}
            height={32}
            style={{ filter: scrolled ? 'brightness(0)' : 'brightness(0) invert(1)', flexShrink: 0 }}
          />
          <span
            className="font-semibold text-sm transition-colors duration-200"
            style={{ color: scrolled ? '#031635' : '#ffffff', letterSpacing: '0.02em' }}
          >HE&amp;P</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => {
            const active = link.to.startsWith('/') && location.pathname.startsWith(link.to) && link.to !== '/'
              || (link.to === '/' && location.pathname === '/')
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-medium transition-colors duration-200 no-underline py-1"
                style={{
                  color: active
                    ? '#D4AF37'
                    : (scrolled ? '#3D3D3D' : 'rgba(255,255,255,0.85)'),
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = scrolled ? '#0A0A0A' : '#ffffff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = active ? '#D4AF37' : (scrolled ? '#3D3D3D' : 'rgba(255,255,255,0.85)') }}
              >
                {isTa ? link.ta : link.en}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5"
                    style={{ background: '#D4AF37', borderRadius: 9999 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={toggleLang}
            style={{ color: scrolled ? '#858585' : 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}
            className="font-medium transition-colors px-2 py-1"
          >
            {isTa ? 'EN' : 'தமிழ்'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/notifications" className="relative no-underline transition-colors w-8 h-8 flex items-center justify-center" style={{ color: scrolled ? '#858585' : 'rgba(255,255,255,0.65)' }}>
                <Bell size={16} strokeWidth={1.5} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full text-[0.6rem] font-bold text-white flex items-center justify-center" style={{ background: '#D4AF37', color: '#031635' }}>2</span>
              </Link>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    style={{ background: '#1a2b4b', color: '#ffffff', borderRadius: 9999 }}
                    className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 outline-none transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold" style={{ background: '#D4AF37', color: '#031635' }}>{initials}</span>
                    {roleLabel}
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" sideOffset={8} style={{ background: '#ffffff', border: '1px solid #E4E4E4', borderRadius: 12, boxShadow: '0px 10px 30px rgba(26,43,75,0.12)' }} className="z-50 min-w-[180px] py-1 animate-in fade-in-0 slide-in-from-top-2">
                    <div className="px-3 py-2" style={{ borderBottom: '1px solid #E4E4E4' }}>
                      <p className="text-sm font-medium" style={{ color: '#031635' }}>{user.name || 'User'}</p>
                      <p className="text-xs" style={{ color: '#858585' }}>{user.phone}</p>
                    </div>
                    <DropdownMenu.Item
                      onSelect={() => { logout(); navigate('/') }}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none transition-colors"
                      style={{ color: '#858585' }}
                    >
                      <LogOut size={13} />
                      {isTa ? 'வெளியேறு' : 'Sign out'}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ) : (
            <Link
              to="/login"
              style={scrolled
                ? { background: '#0A0A0A', color: '#ffffff', borderRadius: 9999 }
                : { background: '#ffffff', color: '#031635', borderRadius: 9999 }}
              className="flex items-center gap-2 text-sm font-medium px-6 py-2.5 transition-all duration-200 hover:-translate-y-px no-underline"
            >
              {isTa ? 'தொடங்குங்கள்' : 'Get Started'}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 transition-colors"
          style={{ color: scrolled ? '#0A0A0A' : 'rgba(255,255,255,0.85)' }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
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
            style={{ background: '#ffffff', borderTop: '1px solid #E4E4E4' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium no-underline transition-colors"
                  style={{ color: location.pathname.startsWith(link.to) ? '#D4AF37' : '#858585' }}
                >
                  {isTa ? link.ta : link.en}
                </Link>
              ))}
              <div className="border-t pt-4 flex items-center justify-between" style={{ borderColor: '#E4E4E4' }}>
                <button onClick={toggleLang} className="text-sm" style={{ color: '#858585' }}>
                  {isTa ? 'Switch to English' : 'தமிழிற்கு மாற'}
                </button>
                {user ? (
                  <button onClick={() => { logout(); navigate('/') }} className="text-sm flex items-center gap-1" style={{ color: '#858585' }}>
                    <LogOut size={13} /> {isTa ? 'வெளியேறு' : 'Sign out'}
                  </button>
                ) : (
                  <Link to="/login" className="text-sm font-medium no-underline" style={{ color: '#031635' }}>
                    {isTa ? 'தொடங்குங்கள்' : 'Get Started'} →
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
