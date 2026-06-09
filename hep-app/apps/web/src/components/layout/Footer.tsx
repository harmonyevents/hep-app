import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail } from 'lucide-react'

const PLATFORM_LINKS = [
  { to: '/',                en: 'Home',               ta: 'முகப்பு' },
  { to: '/consumer/post',   en: 'Post an Event',      ta: 'நிகழ்வு பதிவிடு' },
  { to: '/vendor/events',   en: 'Find Events to Bid', ta: 'ஏலத்திற்கு நிகழ்வுகள்' },
  { to: '/login',           en: 'Sign In',            ta: 'உள்நுழைக' },
]

const VENDOR_LINKS = [
  { to: '/vendor/profile/setup', en: 'Join as Vendor',   ta: 'சேவையாளராக சேருக' },
  { to: '/vendor/dashboard',     en: 'Vendor Dashboard', ta: 'வெண்டர் டாஷ்போர்டு' },
]

export function Footer() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'

  return (
    <footer className="px-6 pb-6">
      <div style={{ background: '#031635', borderRadius: 16 }} className="px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <svg viewBox="0 0 256 256" width="28" height="28" fill="white">
                <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
              </svg>
              <div>
                <div className="font-semibold text-sm text-white" style={{ letterSpacing: '0.08em' }}>HE&amp;P</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Harmony Events &amp; Productions</div>
              </div>
            </div>
            <p className="text-sm font-light leading-relaxed max-w-xs mb-5" style={{ color: 'rgba(255,255,255,0.50)' }}>
              {isTa
                ? 'இந்தியாவின் முதல் B2B/C2B நிகழ்வு மேலாண்மை தளம் — நடத்துனர்களும் சேவையாளர்களும் இணையும் இடம்.'
                : "India's first B2B/C2B event management platform — where organizers and vendors connect, bid, and deliver."}
            </p>
            <div className="flex flex-col gap-2.5" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.40)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={12} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>Chennai, Tamil Nadu 600 032</span>
              </div>
              <a href="tel:+919025234564" className="flex items-center gap-2 no-underline transition-colors hover:text-white/70" style={{ color: 'rgba(255,255,255,0.40)' }}>
                <Phone size={12} style={{ color: '#D4AF37', flexShrink: 0 }} />
                +91 90252 34564
              </a>
              <a href="mailto:reach.harmonyevents@gmail.com" className="flex items-center gap-2 no-underline transition-colors hover:text-white/70 break-all" style={{ color: 'rgba(255,255,255,0.40)' }}>
                <Mail size={12} style={{ color: '#D4AF37', flexShrink: 0 }} />
                reach.harmonyevents@gmail.com
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h5 className="text-xs font-semibold mb-4 tracking-widest uppercase" style={{ color: '#D4AF37' }}>
              {isTa ? 'தளம்' : 'Platform'}
            </h5>
            <ul className="space-y-2.5 list-none p-0">
              {PLATFORM_LINKS.map(({ to, en, ta }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm no-underline transition-colors"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF37' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)' }}
                  >
                    {isTa ? ta : en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h5 className="text-xs font-semibold mb-4 tracking-widest uppercase" style={{ color: '#D4AF37' }}>
              {isTa ? 'சேவையாளர்கள்' : 'Vendors'}
            </h5>
            <ul className="space-y-2.5 list-none p-0 mb-6">
              {VENDOR_LINKS.map(({ to, en, ta }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm no-underline transition-colors"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF37' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)' }}
                  >
                    {isTa ? ta : en}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: '#22c55e', animation: 'ping-dot 2s ease-in-out infinite' }} />
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#22c55e' }}>GST Registered</p>
                <p className="font-mono-hep text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>33AAICH6273M1Z6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
            © 2026 Harmony Events &amp; Productions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono-hep" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.20)' }}>Built in Chennai, Tamil Nadu</span>
            <span className="w-px h-3" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <span className="font-mono-hep" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.20)' }}>IIT Madras Alumni</span>
            <span className="w-px h-3" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <span className="font-mono-hep" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.20)' }}>RBI Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
