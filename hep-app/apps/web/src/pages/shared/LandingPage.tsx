import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/ui/Icon'
import { Marquee } from '@/components/ui/Marquee'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

// ── Design tokens (light theme — all inline to bypass Tailwind purge) ────────
const BLUE        = '#2251FF'
const BLUE_LIGHT  = '#4D70FF'
const BLUE_5      = 'rgba(34,81,255,0.05)'
const BLUE_10     = 'rgba(34,81,255,0.10)'
const BLUE_15     = 'rgba(34,81,255,0.15)'
const BLUE_20     = 'rgba(34,81,255,0.20)'
const GOLD        = '#B8893A'          // slightly deeper gold reads better on white
const GOLD_LIGHT  = '#D4A85A'
const GOLD_8      = 'rgba(184,137,58,0.08)'
const GOLD_15     = 'rgba(184,137,58,0.15)'
const GOLD_25     = 'rgba(184,137,58,0.25)'
const GOLD_50     = 'rgba(184,137,58,0.50)'
const TXT         = '#0D1B2A'          // near-black headings
const TXT2        = '#3D4E63'          // body text
const TXT3        = '#7A8C9E'          // muted labels
const BG          = '#FAFAF8'          // page background
const BG_CREAM    = '#F5F0E8'          // alternate warm section
const BG_LIGHT    = '#F8F8FA'          // cool-light alternate
const BORDER      = 'rgba(0,0,0,0.08)'
const BORDER_GOLD = 'rgba(184,137,58,0.25)'

// ── Data ────────────────────────────────────────────────────────────────────
const EN_WORDS = ['wedding', 'conference', 'birthday', 'festival', 'launch', 'concert']
const TA_WORDS = ['திருமணம்', 'மாநாடு', 'பிறந்தநாள்', 'விழா', 'அறிமுகம்', 'கச்சேரி']

const STEPS = [
  { n: '01', icon: 'clipboard' as const,
    en: { title: 'Post your event', desc: 'Describe the event, set budget and date. AI suggests the services you need.' },
    ta: { title: 'நிகழ்வை பதிவிடுங்கள்', desc: 'நிகழ்வை விவரிக்கவும். AI தேவையான சேவைகளை பரிந்துரைக்கும்.' } },
  { n: '02', icon: 'zap' as const,
    en: { title: 'Vendors bid for you', desc: 'Nearby vendors are notified instantly. Comparable bids — no phone calls.' },
    ta: { title: 'சேவையாளர்கள் ஏலம் போடுவார்கள்', desc: 'அருகிலுள்ள சேவையாளர்களுக்கு உடனடி அறிவிப்பு.' } },
  { n: '03', icon: 'file-text' as const,
    en: { title: 'Agree & pay securely', desc: 'Accept the best bid. Digital agreement auto-generated. Pay via Razorpay.' },
    ta: { title: 'ஒப்புக்கொண்டு செலுத்துங்கள்', desc: 'சிறந்த ஏலத்தை ஏற்றுக்கொள்ளுங்கள். டிஜிட்டல் ஒப்பந்தம் தயாரிக்கப்படும்.' } },
  { n: '04', icon: 'check-circle' as const,
    en: { title: 'Event done. Vendor paid.', desc: 'Confirm completion in the app. Vendor receives payout within 2 days.' },
    ta: { title: 'நிகழ்வு முடிந்தது. பணம் கிடைத்தது.', desc: 'பயன்பாட்டில் உறுதிப்படுத்துங்கள். 2 நாட்களில் பணம் கிடைக்கும்.' } },
]

const PAIN_POINTS = [
  { icon: 'shield' as const,
    en: { pain: 'Vendor no-shows', fix: 'Security deposit held. Backup pool activated within 4 hours if they cancel.' },
    ta: { pain: 'சேவையாளர் வராமல் போவது', fix: 'பாதுகாப்பு வைப்பு வைக்கப்படும். 4 மணி நேரத்தில் மாற்று குழு.' } },
  { icon: 'eye' as const,
    en: { pain: '"Quote on call" pricing', fix: 'Every bid is visible, detailed, and comparable in one place.' },
    ta: { pain: '"அழைப்பில் மேற்கோள்" விலை', fix: 'ஒவ்வொரு ஏலமும் ஒரே இடத்தில் தெளிவாக ஒப்பிடலாம்.' } },
  { icon: 'file-text' as const,
    en: { pain: 'No invoice, no GST trail', fix: 'Auto-generated GST invoices, PDFs delivered. 3-year records.' },
    ta: { pain: 'இன்வாய்ஸ் இல்லை, GST பதிவு இல்லை', fix: 'தானாக GST இன்வாய்ஸ். 3 ஆண்டு பதிவு.' } },
  { icon: 'lock' as const,
    en: { pain: 'Cash payments, no record', fix: 'Razorpay — RBI-licensed. Money released only after event confirmation.' },
    ta: { pain: 'பண கொடுப்பனவு, பதிவு இல்லை', fix: 'RBI அங்கீகரிக்கப்பட்ட Razorpay. நிகழ்வு உறுதிப்பட்ட பிறகே பணம்.' } },
  { icon: 'users' as const,
    en: { pain: 'WhatsApp thread chaos', fix: 'One dashboard for all vendors, bids, agreements, and payments.' },
    ta: { pain: 'WhatsApp நூல் குழப்பம்', fix: 'அனைத்திற்கும் ஒரே டாஷ்போர்டு.' } },
  { icon: 'clock' as const,
    en: { pain: 'Last-minute crises', fix: 'HE&P Emergency Response. Replacement in 4 hrs or full refund.' },
    ta: { pain: 'கடைசி நிமிட நெருக்கடி', fix: '4 மணி நேரத்தில் மாற்று அல்லது முழு திரும்பல்.' } },
]

const TRUST_ITEMS = [
  { icon: 'shield' as const,       en: 'Vendor security deposits',     ta: 'சேவையாளர் பாதுகாப்பு வைப்பு' },
  { icon: 'lock' as const,         en: 'Razorpay — RBI-licensed PA',   ta: 'RBI அங்கீகரிக்கப்பட்ட Razorpay' },
  { icon: 'file-text' as const,    en: 'Auto GST invoices + Form 16A', ta: 'தானியங்கி GST இன்வாய்ஸ்கள்' },
  { icon: 'check-circle' as const, en: 'KYC verified vendors only',    ta: 'KYC சரிபார்க்கப்பட்ட சேவையாளர்கள்' },
  { icon: 'award' as const,        en: 'IIT Madras-backed startup',    ta: 'IIT Madras ஆதரவு' },
  { icon: 'star' as const,         en: '4.9★ avg satisfaction',        ta: '4.9★ சராசரி திருப்தி' },
]

const CATEGORIES = [
  { icon: 'camera' as const,   en: 'Photography & Video', ta: 'புகைப்படம் & வீடியோ' },
  { icon: 'music' as const,    en: 'Entertainment',       ta: 'பொழுதுபோக்கு' },
  { icon: 'users' as const,    en: 'Catering',            ta: 'சிற்றுண்டி சேவை' },
  { icon: 'building' as const, en: 'Venue',               ta: 'நிகழ்விடம்' },
  { icon: 'cpu' as const,      en: 'AV & Stage',          ta: 'ஒலி & மேடை' },
  { icon: 'truck' as const,    en: 'Logistics',           ta: 'தளவாட சேவை' },
  { icon: 'mic' as const,      en: 'Anchoring & MC',      ta: 'நிகழ்ச்சி தொகுப்பாளர்' },
  { icon: 'award' as const,    en: 'Decor & Florals',     ta: 'அலங்காரம்' },
  { icon: 'scissors' as const, en: 'Bridal & Makeup',     ta: 'மணமகள் & மேக்கப்' },
  { icon: 'printer' as const,  en: 'Print & Invites',     ta: 'அழைப்பிதழ்கள்' },
]

const VENDOR_BENEFITS = [
  { icon: 'trending-up' as const, en: 'Revenue analytics — bid win rate, monthly earnings', ta: 'வருவாய் பகுப்பாய்வு' },
  { icon: 'award' as const,       en: 'Build a reputation. Reviews and ratings stay with you.', ta: 'நற்பெயர் கட்டுங்கள்.' },
  { icon: 'file-text' as const,   en: 'GST invoices, TDS certificates auto-generated', ta: 'GST இன்வாய்ஸ் தானாக.' },
  { icon: 'shield' as const,      en: 'Emergency backup pool — earn even when others fail', ta: 'அவசர காப்பு குழு.' },
]

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// ── Sub-components ───────────────────────────────────────────────────────────
function CyclicWord({ isTa }: { isTa: boolean }) {
  const [idx, setIdx] = useState(0)
  const words = isTa ? TA_WORDS : EN_WORDS
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % words.length), 2800)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span className="inline-block relative overflow-hidden align-bottom" style={{ minWidth: isTa ? '7ch' : '6.5ch' }}>
      <AnimatePresence mode="wait">
        <motion.span key={words[idx]}
          className="block"
          style={{ color: BLUE }}
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: '0%',   opacity: 1 }}
          exit={{   y: '-105%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >{words[idx]}</motion.span>
      </AnimatePresence>
    </span>
  )
}

function Divider({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <span className="font-mono-hep text-[0.58rem] tracking-[0.35em]" style={{ color: GOLD }}>{number}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${GOLD_25}, transparent)` }} />
      <span className="text-[0.58rem] tracking-[0.28em] uppercase" style={{ color: TXT3 }}>{label}</span>
    </div>
  )
}

// ── Hero — dark dramatic top, transitions to light ────────────────────────────
function HeroSection({ isTa }: { isTa: boolean }) {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, #0D1B2A 0%, #0F2340 50%, #0D1B2A 100%)` }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" style={{ zIndex: 1 }} />
      {/* Gold glow bottom-right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ zIndex: 1,
        background: `radial-gradient(circle, ${GOLD_8} 0%, transparent 70%)` }} />
      {/* Blue glow top-left */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ zIndex: 1,
        background: 'radial-gradient(circle, rgba(34,81,255,0.12) 0%, transparent 70%)' }} />
      {/* Full-width diagonal slice — hero cuts cleanly into cream section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: '100%', height: 72, display: 'block' }}>
          <polygon points="0,32 1440,0 1440,72 0,72" fill={BG_CREAM} />
        </svg>
      </div>

      <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 10 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[88vh] py-24">
          <div className="lg:col-span-7 flex flex-col justify-center">

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px" style={{ background: GOLD }} />
              <span className="text-[0.6rem] tracking-[0.32em] uppercase" style={{ color: 'rgba(255,255,255,0.50)' }}>
                {isTa ? 'இந்தியாவின் நிகழ்வு மேடை' : "India's event management platform"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-success" style={{ animation: 'ping-dot 2s ease-in-out infinite' }} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="font-display font-light leading-[0.92] mb-8 tracking-tight text-white"
              style={{ fontSize: 'clamp(3.8rem, 8.5vw, 8.5rem)' }}
            >
              {isTa ? 'உங்கள்' : 'Your'}<br />
              {isTa ? 'அடுத்த' : 'next'}<br />
              <CyclicWord isTa={isTa} /><br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }} className="italic">{isTa ? 'சரியாக.' : 'done right.'}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-base leading-relaxed max-w-lg mb-10 font-light"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {isTa
                ? 'நிகழ்வை பதிவிடுங்கள். சேவையாளர்கள் ஏலம் போடுவார்கள். சிறந்ததை தேர்ந்தெடுங்கள்.'
                : 'Post your event. Vendors bid. You pick the best. Contracts, invoices, and payments — all handled.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/login" className="no-underline">
                <motion.div whileHover={{ y: -3, boxShadow: `0 12px 40px ${GOLD_25}` }} whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden text-[0.72rem] font-bold tracking-[0.16em] uppercase px-9 py-4 text-center cursor-pointer flex items-center justify-center gap-2.5"
                  style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`, color: '#0D1B2A' }}
                >
                  <motion.span className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.3) 50%,transparent 65%)', width: '60%' }}
                    animate={{ x: ['-100%', '280%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
                  <Icon name="plus-circle" size={15} />
                  {isTa ? 'நிகழ்வை பதிவிடுக' : 'Post an Event'}
                </motion.div>
              </Link>
              <Link to="/login" className="no-underline">
                <motion.div whileHover={{ y: -2, borderColor: GOLD_50 }} whileTap={{ scale: 0.97 }}
                  className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-9 py-4 text-center cursor-pointer flex items-center justify-center gap-2.5 transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.70)' }}
                >
                  <Icon name="briefcase" size={15} />
                  {isTa ? 'சேவையாளராக சேருக' : 'Join as Vendor'}
                </motion.div>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
              className="flex items-center gap-5 mt-10"
            >
              <div className="flex -space-x-1.5">
                {[BLUE, GOLD, BLUE_LIGHT, GOLD_LIGHT].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2"
                    style={{ borderColor: '#0D1B2A', background: `radial-gradient(circle at 35% 35%, ${c}cc, ${c}66)` }} />
                ))}
              </div>
              <span className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.40)' }}>
                {isTa ? '500+ நிகழ்வுகள் முடிந்தன' : '500+ events successfully managed'}
              </span>
            </motion.div>
          </div>

          {/* Stat cards */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }} className="lg:col-span-5 flex flex-col gap-5 items-end"
          >
            {[
              { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated', delay: 0, gold: false },
              { to: 120, suffix: '+', label: isTa ? 'KYC சரிபார்க்கப்பட்டவர்கள்' : 'KYC-verified vendors', delay: 0.2, gold: true },
              { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள் — வளர்கிறோம்' : 'Cities — growing fast', delay: 0.4, gold: false },
            ].map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + s.delay, duration: 0.5 }}
                className="px-7 py-5 min-w-[210px] animate-float"
                style={{
                  animationDelay: `${s.delay}s`,
                  background: s.gold ? `rgba(255,255,255,0.10)` : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${s.gold ? GOLD_25 : 'rgba(255,255,255,0.12)'}`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="font-display text-5xl font-light leading-none mb-1"
                  style={{ color: s.gold ? GOLD_LIGHT : 'white' }}
                >
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[0.62rem] tracking-[0.18em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: 'rgba(255,255,255,0.25)' }}
        >
          <div className="w-0.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.40)' }} />
        </motion.div>
        <span className="text-[0.52rem] tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>scroll</span>
      </motion.div>
    </section>
  )
}

// ── Ticker ────────────────────────────────────────────────────────────────────
function MarqueeTicker({ isTa }: { isTa: boolean }) {
  const items = TRUST_ITEMS.map(t => (
    <div key={t.en} className="flex items-center gap-2.5 flex-shrink-0 transition-colors duration-200"
      style={{ color: TXT3 }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.color = GOLD)}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.color = TXT3)}
    >
      <Icon name={t.icon} size={13} strokeWidth={1.5} style={{ color: GOLD }} />
      <span className="text-[0.63rem] tracking-[0.1em] whitespace-nowrap">{isTa ? t.ta : t.en}</span>
    </div>
  ))
  const withSeps = items.flatMap((item, i) =>
    i < items.length - 1 ? [item, <span key={`s${i}`} className="w-px h-3 flex-shrink-0" style={{ background: GOLD_25 }} />] : [item]
  )
  return (
    <div className="py-3.5 overflow-hidden" style={{ background: BG_CREAM, borderBottom: `1px solid ${GOLD_15}` }}>
      <Marquee speed={35} gap="2.5rem">{withSeps}</Marquee>
    </div>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsSection({ isTa }: { isTa: boolean }) {
  const stats = [
    { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated',    sub: isTa ? 'IIT Madras முதல் Chennai வரை' : 'From IIT Madras to Chennai weddings' },
    { to: 120, suffix: '+', label: isTa ? 'KYC சரிபார்க்கப்பட்டவர்கள்' : 'Verified vendors', sub: isTa ? 'PAN சரிபார்க்கப்பட்டது' : 'PAN verified, security deposit held' },
    { to: 9,   suffix: '★', label: isTa ? 'சராசரி மதிப்பீடு' : 'Avg satisfaction',      sub: isTa ? '100+ மதிப்பாய்வுகள்' : 'Across 100+ completed events', prefix: '4.' },
    { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள்' : 'Cities active',           sub: isTa ? 'மேலும் விரைவில்' : 'More launching soon' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: BORDER }}
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="group relative overflow-hidden px-8 py-10" style={{ background: BG }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: GOLD_8 }} />
              <div className="font-display font-light leading-none mb-2 relative z-10" style={{ fontSize: 'clamp(3rem,5vw,4.5rem)', color: GOLD }}>
                {s.prefix ?? ''}<AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-[0.7rem] tracking-[0.14em] uppercase mb-1 relative z-10" style={{ color: TXT }}>{s.label}</div>
              <div className="text-[0.65rem] relative z-10" style={{ color: TXT3 }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── How It Works — 3D cards ───────────────────────────────────────────────────
function HowItWorksSection({ isTa }: { isTa: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className="py-28 px-6 relative overflow-hidden" style={{ background: BG_CREAM }}>
      {/* Subtle blue glow top */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{ background: `radial-gradient(circle, ${BLUE_5} 0%, transparent 70%)` }} />

      <div className="max-w-7xl mx-auto">
        <Divider number="01" label={isTa ? 'நிகழ்வு பாதை' : 'How it works'} />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display font-light leading-tight mb-3" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', color: TXT }}>
              {isTa ? 'நான்கு படிகளில்\nதிட்டமிடுங்கள்.' : 'Plan your event\nin four steps.'}
            </h2>
            <p className="text-sm max-w-sm" style={{ color: TXT2 }}>
              {isTa ? 'WhatsApp அலைச்சல் இல்லை. கடைசி நிமிட பரபரப்பு இல்லை.' : 'No WhatsApp back-and-forth. No last-minute surprises.'}
            </p>
          </motion.div>
        </div>

        {/* 3D cards */}
        <div style={{ perspective: '1200px', perspectiveOrigin: '50% 30%' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => {
              const initRotY = [20, 10, -10, -20][i]
              return (
                <motion.div key={step.n}
                  initial={{ opacity: 0, rotateY: initRotY, y: 50, scale: 0.92 }}
                  animate={isInView ? { opacity: 1, rotateY: 0, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.85, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ rotateY: i < 2 ? -6 : 6, scale: 1.03, z: 30 }}
                  style={{ transformStyle: 'preserve-3d', cursor: 'default' }}
                  className="relative group"
                >
                  {/* Ghost watermark */}
                  <div className="absolute -top-2 -right-1 font-display leading-none select-none pointer-events-none"
                    style={{ fontSize: 'clamp(5rem,9vw,8rem)', color: GOLD_8, transform: 'translateZ(12px)', zIndex: 0 }}
                  >{step.n}</div>

                  {/* Card */}
                  <div className="relative overflow-hidden h-full flex flex-col gap-5 p-7 transition-all duration-300"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${BORDER_GOLD}`,
                      boxShadow: `0 4px 24px rgba(0,0,0,0.06), 0 1px 0 ${GOLD_8} inset`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Blue top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300"
                      style={{ background: `linear-gradient(to right, ${BLUE}, ${BLUE_LIGHT})`, opacity: 0.8 }} />

                    {/* Icon + step */}
                    <div className="flex items-center justify-between relative z-10 pt-1" style={{ transform: 'translateZ(8px)' }}>
                      <div className="w-11 h-11 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ border: `1px solid ${GOLD_25}`, background: GOLD_8 }}
                      >
                        <Icon name={step.icon} size={19} strokeWidth={1.4} style={{ color: GOLD }} />
                      </div>
                      <span className="font-mono-hep text-[0.6rem] tracking-[0.25em]" style={{ color: GOLD_50 }}>{step.n}</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1" style={{ transform: 'translateZ(4px)' }}>
                      <h3 className="font-display text-[1.3rem] font-semibold leading-snug mb-2.5" style={{ color: TXT }}>
                        {isTa ? step.ta.title : step.en.title}
                      </h3>
                      <p className="text-[0.78rem] leading-relaxed" style={{ color: TXT2 }}>
                        {isTa ? step.ta.desc : step.en.desc}
                      </p>
                    </div>

                    {/* Bottom gold accent */}
                    <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD_25}, transparent)` }} />
                  </div>

                  {/* Arrow */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute top-[52px] -right-3 z-20 items-center">
                      <div className="w-6 h-px" style={{ background: GOLD_25 }} />
                      <div className="w-0 h-0" style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `5px solid ${GOLD_25}` }} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Pain Points ───────────────────────────────────────────────────────────────
function PainPointsSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-28 px-6" style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto">
        <Divider number="02" label={isTa ? 'நாம் தீர்க்கும் பிரச்சினைகள்' : 'What we fix'} />
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-light leading-tight mb-14" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', color: TXT }}
        >
          {isTa ? 'நிகழ்வு ஏற்பாட்டின்\nமிகப்பெரிய தலைவலிகள்.' : 'The real problems\nwith event planning.'}
        </motion.h2>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PAIN_POINTS.map(p => (
            <motion.div key={p.en.pain} variants={fadeUp}
              className="group p-7 transition-all duration-300 cursor-default"
              style={{ background: '#FFFFFF', border: `1px solid ${BORDER}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px ${GOLD_25}` }}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-5 transition-all duration-300"
                style={{ background: BLUE_5, border: `1px solid ${BLUE_10}` }}
              >
                <Icon name={p.icon} size={18} strokeWidth={1.4} style={{ color: BLUE }} />
              </div>
              <div className="text-[0.58rem] tracking-[0.22em] uppercase mb-2" style={{ color: TXT3 }}>The problem</div>
              <h3 className="font-display text-xl font-semibold mb-3" style={{ color: TXT }}>
                {isTa ? p.ta.pain : p.en.pain}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-px" style={{ background: GOLD }} />
                <Icon name="arrow-right" size={10} style={{ color: GOLD }} />
              </div>
              <p className="text-[0.78rem] leading-relaxed" style={{ color: TXT2 }}>
                {isTa ? p.ta.fix : p.en.fix}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Categories ────────────────────────────────────────────────────────────────
function CategoriesSection({ isTa }: { isTa: boolean }) {
  const pills = CATEGORIES.map(c => (
    <div key={c.en} className="flex items-center gap-2.5 px-5 py-2.5 cursor-default flex-shrink-0 transition-all duration-200"
      style={{ border: `1px solid ${BORDER}`, background: '#FFFFFF' }}
      onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = GOLD_25; d.style.background = GOLD_8 }}
      onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = BORDER; d.style.background = '#FFFFFF' }}
    >
      <Icon name={c.icon} size={14} strokeWidth={1.5} style={{ color: GOLD }} />
      <span className="text-[0.75rem] whitespace-nowrap tracking-wide" style={{ color: TXT2 }}>{isTa ? c.ta : c.en}</span>
    </div>
  ))
  return (
    <section className="py-28 overflow-hidden" style={{ background: BG_LIGHT, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Divider number="03" label={isTa ? 'சேவை வகைகள்' : 'Service categories'} />
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-light leading-tight" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', color: TXT }}
        >
          {isTa ? 'எல்லா வகை\nசேவைகளும் ஒரே இடத்தில்.' : 'Every vendor category,\ncovered.'}
        </motion.h2>
      </div>
      <div className="flex flex-col gap-4">
        <Marquee speed={28} gap="1rem" className="py-1">{pills}</Marquee>
        <Marquee speed={22} reverse gap="1rem" className="py-1">{pills}</Marquee>
      </div>
    </section>
  )
}

// ── Vendor Section ────────────────────────────────────────────────────────────
function VendorSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-28 px-6" style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto">
        <Divider number="04" label={isTa ? 'சேவையாளர்களுக்கு' : 'For vendors'} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display font-light leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem,4.5vw,4.5rem)', color: TXT }}
            >
              {isTa ? 'வேலை தேடுவது நிறுத்துங்கள்.\nவேலை உங்களை தேடட்டும்.' : "Stop hunting for clients.\nLet them find you."}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: TXT2 }}
            >
              {isTa
                ? 'உங்கள் பகுதியில் நிகழ்வு பதிவிடப்பட்டவுடன் அறிவிப்பு. ஏலம் போடுங்கள், வேலை கிடைக்கும்.'
                : 'The moment an event posts in your area, you get notified. Bid, get accepted, do the work, get paid. No middlemen.'}
            </motion.p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4 mb-10">
              {VENDOR_BENEFITS.map(b => (
                <motion.div key={b.en} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ border: `1px solid ${GOLD_25}`, background: GOLD_8 }}
                  >
                    <Icon name={b.icon} size={14} strokeWidth={1.5} style={{ color: GOLD }} />
                  </div>
                  <span className="text-[0.82rem] leading-relaxed" style={{ color: TXT2 }}>{isTa ? b.ta : b.en}</span>
                </motion.div>
              ))}
            </motion.div>
            <Link to="/login" className="no-underline inline-block">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase cursor-pointer transition-all"
                style={{ border: `1px solid ${BLUE_20}`, color: BLUE }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = BLUE_5; d.style.borderColor = BLUE }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'transparent'; d.style.borderColor = BLUE_20 }}
              >
                {isTa ? 'சேவையாளராக சேருக' : 'Join as a vendor'}
                <Icon name="arrow-right" size={14} />
              </motion.div>
            </Link>
          </div>

          {/* Pro plan card */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <div className="relative p-8 overflow-hidden"
              style={{ background: TXT, border: `1px solid rgba(255,255,255,0.10)`, boxShadow: '0 24px 64px rgba(13,27,42,0.25)' }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${GOLD_15} 0%, transparent 70%)`, filter: 'blur(30px)' }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[0.58rem] tracking-[0.28em] uppercase mb-1" style={{ color: GOLD_50 }}>Pro Plan</div>
                    <div className="font-display text-4xl font-light" style={{ color: GOLD_LIGHT }}>₹2,499</div>
                    <div className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.40)' }}>per month</div>
                  </div>
                  <div className="px-3 py-1.5" style={{ border: `1px solid ${GOLD_25}`, background: GOLD_8 }}>
                    <span className="text-[0.6rem] tracking-[0.18em] uppercase" style={{ color: GOLD_LIGHT }}>Popular</span>
                  </div>
                </div>
                <div className="space-y-3.5 mb-8">
                  {[
                    isTa ? 'முன்னுரிமை தேடல் பட்டியல்' : 'Priority search listing',
                    isTa ? '30 போர்ட்ஃபோலியோ படங்கள்'  : '30 portfolio images',
                    isTa ? 'முன்னமே நிகழ்வு அணுகல்'     : 'Early event access (24hr)',
                    isTa ? 'அவசர காப்பு குழு தகுதி'     : 'Emergency backup pool eligibility',
                    isTa ? 'மேம்பட்ட வருவாய் பகுப்பாய்வு' : 'Advanced revenue analytics',
                    isTa ? 'அர்ப்பணிக்கப்பட்ட ஆதரவு'    : 'Dedicated support line',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ border: `1px solid ${GOLD_25}` }}>
                        <Icon name="check" size={10} strokeWidth={2} style={{ color: GOLD_LIGHT }} />
                      </div>
                      <span className="text-[0.78rem]" style={{ color: 'rgba(255,255,255,0.60)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/login" className="no-underline block">
                  <motion.div whileHover={{ y: -2, boxShadow: `0 8px 30px ${GOLD_25}` }} whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden text-[0.7rem] font-bold tracking-[0.16em] uppercase py-3.5 text-center cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`, color: TXT }}
                  >
                    <motion.span className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)', width: '60%' }}
                      animate={{ x: ['-100%', '280%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.4 }} />
                    <span className="relative">{isTa ? 'Pro ஆக தொடங்குங்கள்' : 'Get Started with Pro'}</span>
                  </motion.div>
                </Link>
                <p className="text-[0.6rem] text-center mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {isTa ? 'கமிஷன் இல்லை முதல் 3 மாதங்களுக்கு' : 'No commission for the first 3 months'}
                </p>
              </div>
            </div>
            <div className="mt-4 p-5 flex items-center justify-between transition-colors"
              style={{ border: `1px solid ${BORDER}`, background: '#FFFFFF' }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = GOLD_25)}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = BORDER)}
            >
              <div>
                <div className="text-[0.62rem] tracking-[0.18em] uppercase mb-0.5" style={{ color: TXT3 }}>Free tier</div>
                <div className="text-[0.78rem]" style={{ color: TXT2 }}>{isTa ? '5 ஏலங்கள் / மாதம், 10 படங்கள்' : '5 bids/month, 10 portfolio images'}</div>
              </div>
              <Link to="/login" className="no-underline">
                <span className="text-[0.65rem] tracking-widest uppercase transition-colors" style={{ color: BLUE }}
                  onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.color = GOLD)}
                  onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.color = BLUE)}
                >
                  {isTa ? 'தொடங்குங்கள் →' : 'Start free →'}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection({ isTa }: { isTa: boolean }) {
  return (
    <section className="relative overflow-hidden"
      style={{ background: TXT }}
    >
      {/* Angled entry — white section slices into dark CTA */}
      <div className="pointer-events-none overflow-hidden" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: '100%', height: 72, display: 'block' }}>
          <polygon points="0,0 1440,40 1440,0" fill={BG} />
        </svg>
      </div>
      <div className="py-28 px-6 relative">
      {/* Gold glow center */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 70% at 50% 55%, ${GOLD_8} 0%, transparent 70%)` }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ border: `1px solid ${GOLD_8}`, animation: 'spotlight-rotate 30s linear infinite' }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ border: `1px solid ${GOLD_15}`, animation: 'spotlight-rotate 20s linear infinite reverse' }} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-5 mb-12">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD_25})` }} />
          <span className="font-mono-hep text-[0.55rem] tracking-[0.35em]" style={{ color: GOLD_50 }}>HE&P</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD_25})` }} />
        </div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-light leading-tight mb-6 text-white" style={{ fontSize: 'clamp(3rem,7vw,7rem)' }}
        >
          {isTa ? 'உங்கள் அடுத்த நிகழ்வை\nஏற்பாடு செய்வோம்.' : 'Ready to plan your\nnext event?'}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="text-sm mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {isTa
            ? 'IIT Madras நிகழ்வுகளிலிருந்து Chennai திருமணங்கள் வரை — HE&P-ல் இப்போதே தொடங்குங்கள்.'
            : 'From IIT Madras fests to Chennai weddings. No commission for the first 3 months.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/login" className="no-underline">
            <motion.div whileHover={{ y: -3, boxShadow: `0 12px 40px ${GOLD_25}` }} whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden text-[0.72rem] font-bold tracking-[0.16em] uppercase px-12 py-4 cursor-pointer flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`, color: TXT }}
            >
              <motion.span className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)', width: '60%' }}
                animate={{ x: ['-100%', '280%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
              <Icon name="zap" size={14} />
              <span className="relative">{isTa ? 'நிகழ்வை பதிவிடுக — இலவசம்' : 'Post an Event — Free'}</span>
            </motion.div>
          </Link>
          <Link to="/login" className="no-underline">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-12 py-4 cursor-pointer flex items-center justify-center gap-2 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = GOLD_25; d.style.color = GOLD_LIGHT }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = 'rgba(255,255,255,0.20)'; d.style.color = 'rgba(255,255,255,0.65)' }}
            >
              <Icon name="briefcase" size={14} />
              {isTa ? 'சேவையாளராக சேருக' : 'Join as a Vendor'}
            </motion.div>
          </Link>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="text-[0.58rem] mt-10 tracking-wide" style={{ color: 'rgba(255,255,255,0.20)' }}
        >
          {isTa ? 'Razorpay மூலம் பாதுகாக்கப்பட்டது · GSTIN: 33AAICH6273M1Z6 · Chennai, Tamil Nadu'
            : 'Secured by Razorpay · GSTIN: 33AAICH6273M1Z6 · Built in Chennai, Tamil Nadu'}
        </motion.p>
      </div>
      </div>{/* close py-28 wrapper */}
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  return (
    <div className="overflow-x-hidden">
      <HeroSection isTa={isTa} />
      <MarqueeTicker isTa={isTa} />
      <StatsSection isTa={isTa} />
      <HowItWorksSection isTa={isTa} />
      <PainPointsSection isTa={isTa} />
      <CategoriesSection isTa={isTa} />
      <VendorSection isTa={isTa} />
      <CTASection isTa={isTa} />
    </div>
  )
}
