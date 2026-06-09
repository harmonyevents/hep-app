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
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Marquee } from '@/components/ui/Marquee'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

// ── Palette constants (inline — bypasses Tailwind purge entirely) ────────────
const GOLD         = '#C9A96E'
const GOLD_LIGHT   = '#E8C98A'
const GOLD_8       = 'rgba(201,169,110,0.08)'
const GOLD_12      = 'rgba(201,169,110,0.12)'
const GOLD_20      = 'rgba(201,169,110,0.20)'
const GOLD_30      = 'rgba(201,169,110,0.30)'
const GOLD_50      = 'rgba(201,169,110,0.50)'
const DEEP         = '#051C2C'

// ── Data ────────────────────────────────────────────────────────────────────
const EN_WORDS = ['wedding', 'conference', 'birthday', 'festival', 'launch', 'concert']
const TA_WORDS = ['திருமணம்', 'மாநாடு', 'பிறந்தநாள்', 'விழா', 'அறிமுகம்', 'கச்சேரி']

const STEPS = [
  { n: '01', icon: 'clipboard' as const,
    en: { title: 'Post your event', desc: 'Describe the event, set your budget and date. AI fills in the services you need.' },
    ta: { title: 'நிகழ்வை பதிவிடுங்கள்', desc: 'நிகழ்வை விவரிக்கவும். AI தேவையான சேவைகளை பரிந்துரைக்கும்.' } },
  { n: '02', icon: 'zap' as const,
    en: { title: 'Vendors bid for you', desc: 'Vendors within 5 km are notified first. Transparent, comparable bids — no calls.' },
    ta: { title: 'சேவையாளர்கள் ஏலம் போடுவார்கள்', desc: '5 கி.மீ. சேவையாளர்களுக்கு அறிவிக்கப்படும்.' } },
  { n: '03', icon: 'file-text' as const,
    en: { title: 'Agree & pay securely', desc: 'Accept the best bid. Digital agreement auto-generated. Pay via Razorpay.' },
    ta: { title: 'ஒப்புக்கொண்டு செலுத்துங்கள்', desc: 'சிறந்த ஏலத்தை ஏற்றுக்கொள்ளுங்கள்.' } },
  { n: '04', icon: 'check-circle' as const,
    en: { title: 'Event done. Vendor paid.', desc: 'Confirm completion in the app. Vendor receives payout within 2 days.' },
    ta: { title: 'நிகழ்வு முடிந்தது. பணம் கிடைத்தது.', desc: '2 நாட்களில் பணம் கிடைக்கும்.' } },
]

const PAIN_POINTS = [
  { icon: 'shield' as const,
    en: { pain: 'Vendor no-shows', fix: 'Security deposit held. Backup pool activated in 4 hours if they cancel.' },
    ta: { pain: 'சேவையாளர் வராமல் போவது', fix: 'பாதுகாப்பு வைப்பு வைக்கப்படும். 4 மணி நேரத்தில் மாற்று குழு.' } },
  { icon: 'eye' as const,
    en: { pain: '"Quote on call" pricing', fix: 'Every bid is visible, detailed, and comparable in one place.' },
    ta: { pain: '"அழைப்பில் மேற்கோள்" விலை', fix: 'ஒவ்வொரு ஏலமும் ஒரே இடத்தில் தெளிவாக ஒப்பிடலாம்.' } },
  { icon: 'file-text' as const,
    en: { pain: 'No invoice, no GST trail', fix: 'Auto-generated GST invoices, PDFs on WhatsApp. 3-year records.' },
    ta: { pain: 'இன்வாய்ஸ் இல்லை, GST பதிவு இல்லை', fix: 'தானாக GST இன்வாய்ஸ். 3 ஆண்டு பதிவு.' } },
  { icon: 'lock' as const,
    en: { pain: 'Cash payments, no record', fix: 'Razorpay — RBI-licensed. Money released only after event confirmation.' },
    ta: { pain: 'பண கொடுப்பனவு, பதிவு இல்லை', fix: 'RBI அங்கீகரிக்கப்பட்ட Razorpay.' } },
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
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
}
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ── Helpers ──────────────────────────────────────────────────────────────────
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
        <motion.span key={words[idx]} className="block text-gradient"
          initial={{ y: '105%', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: '0%',   opacity: 1, filter: 'blur(0px)' }}
          exit={{   y: '-105%', opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >{words[idx]}</motion.span>
      </AnimatePresence>
    </span>
  )
}

function GoldDivider({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <span className="font-mono-hep text-[0.58rem] tracking-[0.35em]" style={{ color: GOLD_50 }}>{number}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${GOLD_20}, rgba(255,255,255,0.05), transparent)` }} />
      <span className="text-[0.58rem] tracking-[0.28em] uppercase text-white/25">{label}</span>
    </div>
  )
}

function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    ref.current?.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    ref.current?.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])
  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`group relative overflow-hidden ${className}`}
      style={{ '--mx': '50%', '--my': '50%' } as React.CSSProperties}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(280px circle at var(--mx) var(--my), ${GOLD_8}, transparent 70%)` }} />
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD_30}, transparent)` }} />
      {children}
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ isTa }: { isTa: boolean }) {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <AuroraBackground className="fixed inset-0 w-full h-full" />
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
        background: 'radial-gradient(ellipse 80% 65% at 8% 38%, rgba(5,28,44,0.65) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
        background: 'linear-gradient(to bottom, transparent 60%, #051C2C 100%)' }} />
      {/* Gold glow bottom right */}
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none" style={{ zIndex: 2,
        background: `radial-gradient(circle, ${GOLD_8} 0%, transparent 70%)` }} />

      <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 10 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[88vh] py-24">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px" style={{ background: GOLD }} />
              <span className="text-[0.6rem] tracking-[0.32em] uppercase text-white/50">
                {isTa ? 'இந்தியாவின் நிகழ்வு மேடை' : "India's event management platform"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-success" style={{ animation: 'ping-dot 2s ease-in-out infinite' }} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="font-display font-light leading-[0.9] mb-8 tracking-tight"
              style={{ fontSize: 'clamp(3.8rem, 8.5vw, 8.5rem)' }}
            >
              {isTa ? 'உங்கள்' : 'Your'}<br />
              {isTa ? 'அடுத்த' : 'next'}<br />
              <CyclicWord isTa={isTa} /><br />
              <span className="text-white/35 italic">{isTa ? 'சரியாக.' : 'done right.'}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-white/55 text-base leading-relaxed max-w-lg mb-10 font-light"
            >
              {isTa
                ? 'நிகழ்வை பதிவிடுங்கள். சேவையாளர்கள் ஏலம் போடுவார்கள். சிறந்ததை தேர்ந்தெடுங்கள்.'
                : 'Post your event. Vendors bid. You pick the best. Contracts, invoices, payments — all handled.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/login" className="no-underline">
                <motion.div whileHover={{ y: -3, boxShadow: '0 12px 50px rgba(34,81,255,0.55)' }} whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden bg-vivid-gradient text-white text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-9 py-4 text-center cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <motion.span className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%)', width: '60%' }}
                      animate={{ x: ['-100%', '280%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
                  </span>
                  <Icon name="plus-circle" size={15} />
                  {isTa ? 'நிகழ்வை பதிவிடுக' : 'Post an Event'}
                </motion.div>
              </Link>
              <Link to="/login" className="no-underline">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="text-white/65 text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-9 py-4 text-center cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200"
                  style={{ border: `1px solid rgba(255,255,255,0.18)` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD_50)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
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
                {['#2251FF', GOLD, '#4D70FF', GOLD_LIGHT].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-deep"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${c}cc, ${c}66)` }} />
                ))}
              </div>
              <span className="text-[0.65rem] text-white/45">
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
              { to: 120, suffix: '+', label: isTa ? 'சரிபார்க்கப்பட்ட சேவையாளர்கள்' : 'KYC-verified vendors', delay: 0.2, gold: true },
              { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள் — வளர்கிறோம்' : 'Cities — growing fast', delay: 0.4, gold: false },
            ].map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + s.delay, duration: 0.5 }}
                className="px-7 py-5 min-w-[200px] animate-float"
                style={{
                  animationDelay: `${s.delay}s`,
                  border: `1px solid ${s.gold ? GOLD_30 : 'rgba(255,255,255,0.1)'}`,
                  background: s.gold ? `linear-gradient(135deg, ${GOLD_8}, transparent)` : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className="font-display text-5xl font-light leading-none mb-1"
                  style={{ color: s.gold ? GOLD : 'white' }}
                >
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[0.62rem] tracking-[0.18em] uppercase text-white/35 mt-1">{s.label}</div>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="px-4 py-2.5 text-right mt-2" style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="text-[0.5rem] tracking-[0.22em] uppercase text-white/20 mb-0.5">GST Registered</div>
              <div className="font-mono-hep text-[0.6rem] text-white/30">33AAICH6273M1Z6</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-0.5 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
        <span className="text-[0.52rem] tracking-[0.28em] uppercase text-white/20">scroll</span>
      </motion.div>
    </section>
  )
}

// ── Ticker ────────────────────────────────────────────────────────────────────
function MarqueeTicker({ isTa }: { isTa: boolean }) {
  const items = TRUST_ITEMS.map(t => (
    <div key={t.en} className="flex items-center gap-2.5 flex-shrink-0 transition-colors duration-200"
      style={{ color: 'rgba(255,255,255,0.50)' }}
      onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
    >
      <Icon name={t.icon} size={13} strokeWidth={1.5} style={{ color: GOLD_50 }} />
      <span className="text-[0.63rem] tracking-[0.1em] whitespace-nowrap">{isTa ? t.ta : t.en}</span>
    </div>
  ))
  const withSeps = items.flatMap((item, i) =>
    i < items.length - 1 ? [item, <span key={`s${i}`} className="w-px h-3 flex-shrink-0" style={{ background: GOLD_20 }} />] : [item]
  )
  return (
    <div className="py-3.5 overflow-hidden backdrop-blur-sm" style={{ borderTop: `1px solid ${GOLD_12}`, borderBottom: `1px solid ${GOLD_12}`, background: 'rgba(5,28,44,0.8)' }}>
      <Marquee speed={35} gap="2.5rem">{withSeps}</Marquee>
    </div>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsSection({ isTa }: { isTa: boolean }) {
  const stats = [
    { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated',  sub: isTa ? 'IIT Madras முதல் Chennai வரை' : 'From IIT Madras to Chennai weddings' },
    { to: 120, suffix: '+', label: isTa ? 'KYC சரிபார்க்கப்பட்டவர்கள்' : 'Verified vendors', sub: isTa ? 'PAN சரிபார்க்கப்பட்டது' : 'PAN verified, security deposit held' },
    { to: 9,   suffix: '★', label: isTa ? 'சராசரி மதிப்பீடு' : 'Avg satisfaction',     sub: isTa ? '100+ மதிப்பாய்வுகள்' : 'Across 100+ completed events', prefix: '4.' },
    { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள்' : 'Cities active',          sub: isTa ? 'மேலும் விரைவில்' : 'More launching soon' },
  ]
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* warm gold wash */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${GOLD_8} 0%, transparent 70%)` }} />
      <div className="max-w-7xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="relative overflow-hidden group px-8 py-9" style={{ background: DEEP }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${GOLD_8}, transparent)` }} />
              <div className="font-display font-light leading-none mb-2 relative z-10" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: GOLD }}>
                {s.prefix ?? ''}<AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-[0.7rem] tracking-[0.14em] uppercase text-white/65 mb-1 relative z-10">{s.label}</div>
              <div className="text-[0.65rem] text-white/35 relative z-10">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── How It Works — 3D perspective cards ──────────────────────────────────────
function HowItWorksSection({ isTa }: { isTa: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className="py-28 px-6 relative overflow-hidden">
      {/* Warm bg wash */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${GOLD_8} 0%, transparent 70%)` }} />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <GoldDivider number="01" label={isTa ? 'நிகழ்வு பாதை' : 'How it works'} />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display font-light leading-tight mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              {isTa ? 'நான்கு படிகளில்\nதிட்டமிடுங்கள்.' : 'Plan your event\nin four steps.'}
            </h2>
            <p className="text-white/50 text-sm max-w-sm">
              {isTa ? 'WhatsApp அலைச்சல் இல்லை. கடைசி நிமிட பரபரப்பு இல்லை.' : 'No WhatsApp back-and-forth. No last-minute surprises.'}
            </p>
          </motion.div>
        </div>

        {/* 3D perspective container */}
        <div style={{ perspective: '1200px', perspectiveOrigin: '50% 30%' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => {
              const initialRotY = [18, 9, -9, -18][i]
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, rotateY: initialRotY, y: 50, scale: 0.92 }}
                  animate={isInView ? { opacity: 1, rotateY: 0, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.85, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ rotateY: i < 2 ? -7 : 7, scale: 1.03, z: 40 }}
                  style={{ transformStyle: 'preserve-3d', cursor: 'default' }}
                  className="relative group"
                >
                  {/* Ghost watermark step number */}
                  <div className="absolute -top-3 -right-1 font-display leading-none select-none pointer-events-none"
                    style={{ fontSize: 'clamp(5rem, 9vw, 8rem)', color: GOLD_8, transform: 'translateZ(15px)', zIndex: 0 }}
                  >
                    {step.n}
                  </div>

                  {/* Card */}
                  <div className="relative overflow-hidden h-full flex flex-col gap-5 p-7 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(145deg, rgba(12,32,54,0.95) 0%, rgba(5,20,38,0.98) 100%)',
                      border: `1px solid ${GOLD_20}`,
                      borderBottom: `1px solid rgba(0,0,0,0.4)`,
                      boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 1px 0 ${GOLD_12} inset`,
                      backdropFilter: 'blur(20px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Top corner glow */}
                    <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${GOLD_20} 0%, transparent 70%)` }} />

                    {/* Icon + step number */}
                    <div className="flex items-center justify-between relative z-10" style={{ transform: 'translateZ(8px)' }}>
                      <div className="w-11 h-11 flex items-center justify-center transition-all duration-300"
                        style={{
                          border: `1px solid ${GOLD_30}`,
                          background: GOLD_8,
                        }}
                      >
                        <Icon name={step.icon} size={19} strokeWidth={1.4} style={{ color: GOLD }} />
                      </div>
                      <span className="font-mono-hep text-[0.6rem] tracking-[0.25em]" style={{ color: GOLD_50 }}>{step.n}</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1" style={{ transform: 'translateZ(4px)' }}>
                      <h3 className="font-display text-[1.25rem] font-light leading-snug mb-2.5 text-white/90">
                        {isTa ? step.ta.title : step.en.title}
                      </h3>
                      <p className="text-[0.78rem] text-white/55 leading-relaxed">
                        {isTa ? step.ta.desc : step.en.desc}
                      </p>
                    </div>

                    {/* Bottom gold accent line */}
                    <div className="relative z-10 h-px transition-all duration-400"
                      style={{ background: `linear-gradient(to right, transparent, ${GOLD_30}, transparent)` }} />
                    {/* Shadow edge */}
                    <div className="h-px blur-sm" style={{ background: `linear-gradient(to right, transparent, ${GOLD_12}, transparent)` }} />
                  </div>

                  {/* Arrow connector — desktop only */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute top-[52px] -right-3 z-20 items-center">
                      <div className="w-6 h-px" style={{ background: GOLD_20 }} />
                      <div className="w-0 h-0" style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `5px solid ${GOLD_20}` }} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
          className="mt-8 h-px origin-left"
          style={{ background: `linear-gradient(to right, transparent, ${GOLD_20}, transparent)` }}
        />
      </div>
    </section>
  )
}

// ── Pain Points ───────────────────────────────────────────────────────────────
function PainPointsSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-28 px-6 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,81,255,0.05) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto">
        <GoldDivider number="02" label={isTa ? 'நாம் தீர்க்கும் பிரச்சினைகள்' : 'What we fix'} />
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-display font-light leading-tight mb-14" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          {isTa ? 'நிகழ்வு ஏற்பாட்டின்\nமிகப்பெரிய தலைவலிகள்.' : 'The real problems\nwith event planning.'}
        </motion.h2>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {PAIN_POINTS.map(p => (
            <motion.div key={p.en.pain} variants={fadeUp}>
              <SpotlightCard className="h-full p-7">
                <div style={{ background: DEEP }} className="absolute inset-0 -z-10" />
                <Icon name={p.icon} size={20} strokeWidth={1.3} className="mb-5 transition-colors duration-300" style={{ color: 'rgba(255,255,255,0.20)' }} />
                <div className="text-[0.58rem] tracking-[0.22em] uppercase text-white/25 mb-2">The problem</div>
                <h3 className="font-display text-xl font-light mb-3.5 text-white/80 leading-snug">{isTa ? p.ta.pain : p.en.pain}</h3>
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-5 h-px" style={{ background: GOLD_50 }} />
                  <Icon name="arrow-right" size={10} style={{ color: GOLD }} />
                </div>
                <p className="text-[0.78rem] text-white/55 leading-relaxed">{isTa ? p.ta.fix : p.en.fix}</p>
              </SpotlightCard>
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
      style={{ border: '1px solid rgba(255,255,255,0.10)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = GOLD_30; (e.currentTarget as HTMLDivElement).style.background = GOLD_8 }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.10)'; (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
    >
      <Icon name={c.icon} size={14} strokeWidth={1.5} style={{ color: GOLD_50 }} />
      <span className="text-[0.75rem] text-white/60 whitespace-nowrap tracking-wide">{isTa ? c.ta : c.en}</span>
    </div>
  ))
  return (
    <section className="py-28 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <GoldDivider number="03" label={isTa ? 'சேவை வகைகள்' : 'Service categories'} />
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-display font-light leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
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
    <section className="py-28 px-6 relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 80% at 80% 50%, ${GOLD_8} 0%, transparent 65%)` }} />
      <div className="max-w-7xl mx-auto">
        <GoldDivider number="04" label={isTa ? 'சேவையாளர்களுக்கு' : 'For vendors'} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="font-display font-light leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)' }}
            >
              {isTa ? 'வேலை தேடுவது நிறுத்துங்கள்.\nவேலை உங்களை தேடட்டும்.' : "Stop hunting for clients.\nLet them find you."}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm"
            >
              {isTa
                ? 'உங்கள் பகுதியில் நிகழ்வு பதிவிடப்பட்டவுடன் அறிவிப்பு. ஏலம் போடுங்கள், வேலை கிடைக்கும்.'
                : 'The moment an event posts in your area, you get notified. Bid, get accepted, do the work, get paid. No middlemen.'}
            </motion.p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4 mb-10">
              {VENDOR_BENEFITS.map(b => (
                <motion.div key={b.en} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ border: `1px solid ${GOLD_30}`, background: GOLD_8 }}
                  >
                    <Icon name={b.icon} size={14} strokeWidth={1.5} style={{ color: GOLD }} />
                  </div>
                  <span className="text-[0.8rem] text-white/60 leading-relaxed">{isTa ? b.ta : b.en}</span>
                </motion.div>
              ))}
            </motion.div>
            <Link to="/login" className="no-underline inline-block">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-white/60 cursor-pointer transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = GOLD_50; (e.currentTarget as HTMLDivElement).style.color = GOLD_LIGHT }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.6)' }}
              >
                {isTa ? 'சேவையாளராக சேருக' : 'Join as a vendor'}
                <Icon name="arrow-right" size={14} />
              </motion.div>
            </Link>
          </div>

          {/* Pro plan card */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="relative p-8 overflow-hidden"
              style={{ border: `1px solid ${GOLD_30}`, background: 'linear-gradient(145deg, rgba(12,32,54,0.9) 0%, rgba(5,20,38,0.95) 100%)' }}
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${GOLD_20} 0%, transparent 70%)`, filter: 'blur(40px)' }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[0.58rem] tracking-[0.28em] uppercase mb-1" style={{ color: GOLD_50 }}>Pro Plan</div>
                    <div className="font-display text-4xl font-light" style={{ color: GOLD }}>₹2,499</div>
                    <div className="text-[0.65rem] text-white/40">per month</div>
                  </div>
                  <div className="px-3 py-1.5" style={{ border: `1px solid ${GOLD_30}`, background: GOLD_8 }}>
                    <span className="text-[0.6rem] tracking-[0.18em] uppercase" style={{ color: GOLD }}>Popular</span>
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
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ border: `1px solid ${GOLD_30}` }}>
                        <Icon name="check" size={10} strokeWidth={2} style={{ color: GOLD }} />
                      </div>
                      <span className="text-[0.78rem] text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/login" className="no-underline block">
                  <motion.div whileHover={{ y: -2, boxShadow: `0 8px 40px ${GOLD_30}` }} whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden text-[0.7rem] font-bold tracking-[0.16em] uppercase py-3.5 text-center cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, ${GOLD_LIGHT} 100%)`, color: DEEP }}
                  >
                    <motion.span className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)', width: '60%' }}
                      animate={{ x: ['-100%', '280%'] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.4 }} />
                    <span className="relative">{isTa ? 'Pro ஆக தொடங்குங்கள்' : 'Get Started with Pro'}</span>
                  </motion.div>
                </Link>
                <p className="text-[0.6rem] text-white/25 text-center mt-3">
                  {isTa ? 'கமிஷன் இல்லை முதல் 3 மாதங்களுக்கு' : 'No commission for the first 3 months'}
                </p>
              </div>
            </div>
            <div className="mt-4 p-5 flex items-center justify-between transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = GOLD_20)}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <div>
                <div className="text-[0.62rem] tracking-[0.18em] uppercase text-white/30 mb-0.5">Free tier</div>
                <div className="text-[0.78rem] text-white/55">{isTa ? '5 ஏலங்கள் / மாதம், 10 படங்கள்' : '5 bids/month, 10 portfolio images'}</div>
              </div>
              <Link to="/login" className="no-underline">
                <span className="text-[0.65rem] tracking-widest uppercase transition-colors" style={{ color: GOLD_50 }}
                  onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.color = GOLD)}
                  onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.color = GOLD_50)}
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
    <section className="py-32 px-6 relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 70% at 50% 55%, ${GOLD_8} 0%, rgba(34,81,255,0.03) 40%, transparent 70%)` }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ border: `1px solid ${GOLD_8}`, animation: 'spotlight-rotate 30s linear infinite' }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ border: `1px solid ${GOLD_12}`, animation: 'spotlight-rotate 20s linear infinite reverse' }} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-5 mb-12">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD_20})` }} />
          <span className="font-mono-hep text-[0.55rem] tracking-[0.35em]" style={{ color: GOLD_30 }}>HE&P</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD_20})` }} />
        </div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="font-display font-light leading-tight mb-6" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
        >
          {isTa ? 'உங்கள் அடுத்த நிகழ்வை\nஏற்பாடு செய்வோம்.' : 'Ready to plan your\nnext event?'}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.15 }}
          className="text-white/45 text-sm mb-12 max-w-lg mx-auto leading-relaxed"
        >
          {isTa
            ? 'IIT Madras நிகழ்வுகளிலிருந்து Chennai திருமணங்கள் வரை — HE&P-ல் இப்போதே தொடங்குங்கள்.'
            : 'From IIT Madras fests to Chennai weddings. No commission for the first 3 months.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/login" className="no-underline">
            <motion.div whileHover={{ y: -3, boxShadow: '0 12px 55px rgba(34,81,255,0.55)' }} whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden bg-vivid-gradient text-white text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-12 py-4 cursor-pointer flex items-center justify-center gap-2"
            >
              <motion.span className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%)', width: '60%' }}
                animate={{ x: ['-100%', '280%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
              <Icon name="zap" size={14} />
              <span className="relative">{isTa ? 'நிகழ்வை பதிவிடுக — இலவசம்' : 'Post an Event — Free'}</span>
            </motion.div>
          </Link>
          <Link to="/login" className="no-underline">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              className="text-white/55 text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-12 py-4 cursor-pointer flex items-center justify-center gap-2 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = GOLD_50; (e.currentTarget as HTMLDivElement).style.color = GOLD_LIGHT }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.55)' }}
            >
              <Icon name="briefcase" size={14} />
              {isTa ? 'சேவையாளராக சேருக' : 'Join as a Vendor'}
            </motion.div>
          </Link>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="text-[0.58rem] text-white/20 mt-10 tracking-wide"
        >
          {isTa ? 'Razorpay மூலம் பாதுகாக்கப்பட்டது · GSTIN: 33AAICH6273M1Z6 · Chennai, Tamil Nadu' : 'Secured by Razorpay · GSTIN: 33AAICH6273M1Z6 · Built in Chennai, Tamil Nadu'}
        </motion.p>
      </div>
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
