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
    <footer className="relative border-t border-vivid/10 bg-[#030D18] overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vivid/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo_cropped.jpg" alt="HE&P" className="w-9 h-9" style={{ mixBlendMode: 'screen' }} />
              <div>
                <div className="font-bold text-sm tracking-[0.2em] uppercase text-white">HE&amp;P</div>
                <div className="text-[0.55rem] tracking-[0.18em] text-sky/40 mt-0.5">Harmony Events &amp; Productions</div>
              </div>
            </div>
            <p className="text-muted-hep text-sm font-light leading-relaxed max-w-xs mb-5">
              {isTa
                ? 'இந்தியாவின் முதல் B2B/C2B நிகழ்வு மேலாண்மை தளம் — நடத்துனர்களும் சேவையாளர்களும் இணையும் இடம்.'
                : "India's first B2B/C2B event management platform — where organizers and vendors connect, bid, and deliver."}
            </p>
            <div className="flex flex-col gap-2.5 text-[0.75rem] text-white/40">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-vivid/60 flex-shrink-0" />
                <span>Chennai, Tamil Nadu 600 032</span>
              </div>
              <a href="tel:+919025234564" className="flex items-center gap-2 hover:text-white/70 transition-colors no-underline">
                <Phone size={12} className="text-vivid/60 flex-shrink-0" />
                +91 90252 34564
              </a>
              <a href="mailto:reach.harmonyevents@gmail.com" className="flex items-center gap-2 hover:text-white/70 transition-colors no-underline break-all">
                <Mail size={12} className="text-vivid/60 flex-shrink-0" />
                reach.harmonyevents@gmail.com
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h5 className="text-[0.62rem] tracking-[0.28em] uppercase text-vivid/80 font-semibold mb-4">
              {isTa ? 'தளம்' : 'Platform'}
            </h5>
            <ul className="space-y-2.5 list-none p-0">
              {PLATFORM_LINKS.map(({ to, en, ta }) => (
                <li key={to}>
                  <Link to={to} className="text-[0.78rem] text-white/45 hover:text-white transition-colors no-underline">
                    {isTa ? ta : en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h5 className="text-[0.62rem] tracking-[0.28em] uppercase text-vivid/80 font-semibold mb-4">
              {isTa ? 'சேவையாளர்கள்' : 'Vendors'}
            </h5>
            <ul className="space-y-2.5 list-none p-0 mb-6">
              {VENDOR_LINKS.map(({ to, en, ta }) => (
                <li key={to}>
                  <Link to={to} className="text-[0.78rem] text-white/45 hover:text-white transition-colors no-underline">
                    {isTa ? ta : en}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success mt-1 animate-[ping-dot_2s_ease-in-out_infinite] flex-shrink-0" />
              <div>
                <p className="text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-success">GST Registered</p>
                <p className="font-mono-hep text-[0.58rem] text-sky/50 mt-0.5">33AAICH6273M1Z6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[0.65rem] text-white/22">
            © 2026 Harmony Events &amp; Productions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[0.58rem] font-mono-hep text-white/18">Built in Chennai</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[0.58rem] font-mono-hep text-white/18">IIT Madras Alumni</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[0.58rem] font-mono-hep text-white/18">RBI Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
