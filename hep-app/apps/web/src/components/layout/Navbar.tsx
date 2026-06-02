import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/ui/Icon'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'ta' : 'en')

  const navLinks = user
    ? user.role === 'vendor'
      ? [
          { to: '/vendor/events', label: 'Browse Events', labelTa: 'நிகழ்வுகளை உலாவுக' },
          { to: '/vendor/bids', label: 'My Bids', labelTa: 'என் ஏலங்கள்' },
          { to: '/vendor/dashboard', label: 'Dashboard', labelTa: 'டாஷ்போர்டு' },
        ]
      : [
          { to: '/consumer/post', label: 'Post Event', labelTa: 'நிகழ்வை பதிவிடுக' },
          { to: '/consumer/events', label: 'My Events', labelTa: 'என் நிகழ்வுகள்' },
          { to: '/consumer/dashboard', label: 'Dashboard', labelTa: 'டாஷ்போர்டு' },
        ]
    : []

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark border-b border-white/8 py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="/logo_cropped.jpg"
              alt="HE&P"
              className="w-9 h-9 object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[0.8rem] tracking-[0.24em] uppercase text-white group-hover:text-vivid transition-colors duration-200">HE&P</span>
            <span className="text-[0.52rem] tracking-[0.18em] text-white/30 font-light mt-0.5 hidden sm:block">Harmony Events & Productions</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[0.7rem] tracking-[0.12em] uppercase font-medium transition-colors duration-200 no-underline
                ${location.pathname.startsWith(link.to) ? 'text-white' : 'text-white/45 hover:text-white/80'}`}
            >
              {i18n.language === 'ta' ? link.labelTa : link.label}
            </Link>
          ))}

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-[0.65rem] font-mono-hep tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors border border-white/10 px-2.5 py-1 hover:border-white/25"
          >
            {i18n.language === 'en' ? 'தமிழ்' : 'EN'}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <Link to="/notifications" className="relative no-underline text-white/35 hover:text-white/70 transition-colors" title="Notifications">
                <Icon name="bell" size={17} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-vivid rounded-full text-[0.42rem] font-bold text-white flex items-center justify-center">2</span>
              </Link>

              {/* Role pill */}
              <span className={`text-[0.6rem] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 border
                ${user.role === 'vendor'
                  ? 'border-vivid/40 text-vivid'
                  : user.role === 'admin'
                  ? 'border-warn/40 text-warn'
                  : 'border-success/40 text-success'}`}>
                {user.role === 'admin' ? 'Admin' : user.role === 'vendor' ? 'Vendor' : 'Host'}
              </span>

              <button
                onClick={() => { logout(); navigate('/') }}
                className="text-[0.65rem] tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
              >
                {i18n.language === 'ta' ? 'வெளியேறு' : 'Sign out'}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase px-5 py-2.5 bg-vivid text-white hover:bg-vlight transition-all duration-200 hover:-translate-y-px shadow-[0_4px_20px_rgba(34,81,255,0.3)] no-underline"
            >
              {i18n.language === 'ta' ? 'தொடங்குங்கள்' : 'Get Started'}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} className="block w-5 h-px bg-white" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-5 h-px bg-white" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} className="block w-5 h-px bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
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
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`text-sm transition-colors no-underline
                    ${location.pathname.startsWith(link.to) ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {i18n.language === 'ta' ? link.labelTa : link.label}
                </Link>
              ))}
              <div className="border-t border-white/8 pt-4 flex items-center justify-between">
                <button onClick={toggleLang} className="text-xs text-white/40 hover:text-white/70">
                  {i18n.language === 'en' ? 'Switch to தமிழ்' : 'Switch to English'}
                </button>
                {user ? (
                  <button onClick={() => { logout(); navigate('/') }} className="text-xs text-white/40 hover:text-white/70">
                    Sign out
                  </button>
                ) : (
                  <Link to="/login" className="text-xs text-vivid no-underline">Get Started →</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
