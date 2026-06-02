import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-[#030D18] border-t border-vivid/15 py-12 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo_cropped.jpg" alt="HE&P" className="w-9 h-9" style={{ mixBlendMode: 'screen' }} />
            <div>
              <div className="font-bold text-sm tracking-[0.2em] uppercase">HE&P</div>
              <div className="text-[0.58rem] tracking-[0.2em] text-sky/50">Harmony Events & Productions</div>
            </div>
          </div>
          <p className="text-muted-hep text-sm font-light leading-relaxed max-w-xs">
            India's event management platform — where organizers and vendors connect, bid, and execute.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-[ping-dot_2s_ease-in-out_infinite]" />
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-success">GST Registered</span>
            <span className="font-mono-hep text-[0.6rem] text-sky/60 ml-2">33AAICH6273M1Z6</span>
          </div>
        </div>

        {/* Platform */}
        <div>
          <h5 className="text-[0.65rem] tracking-[0.25em] uppercase text-vivid font-semibold mb-4">Platform</h5>
          <ul className="space-y-2.5 list-none p-0">
            {[
              ['/', 'Home'],
              ['/consumer/post', 'Post an Event'],
              ['/vendor/events', 'Find Events to Bid'],
              ['/login', 'Sign In'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-[0.8rem] text-white/50 hover:text-white transition-colors no-underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="text-[0.65rem] tracking-[0.25em] uppercase text-vivid font-semibold mb-4">Contact</h5>
          <address className="not-italic text-[0.8rem] text-white/50 space-y-2">
            <div>Chennai, Tamil Nadu</div>
            <div>PIN: 600 032</div>
            <a href="tel:+919025234564" className="block hover:text-white transition-colors no-underline">+91 90252 34564</a>
            <a href="mailto:reach.harmonyevents@gmail.com" className="block hover:text-white transition-colors no-underline break-all">
              reach.harmonyevents@gmail.com
            </a>
          </address>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[0.68rem] text-white/25">© 2026 Harmony Events & Productions. All rights reserved.</p>
        <p className="text-[0.62rem] font-mono-hep text-white/20">Built in Chennai · IIT Madras Alumni</p>
      </div>
    </footer>
  )
}
