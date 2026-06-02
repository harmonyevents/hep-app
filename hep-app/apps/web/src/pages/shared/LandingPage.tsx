import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/ui/Icon'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Marquee } from '@/components/ui/Marquee'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

// ── Data ────────────────────────────────────────────────────────────────────
const EN_WORDS = ['wedding', 'conference', 'birthday', 'festival', 'launch', 'concert']
const TA_WORDS = ['திருமணம்', 'மாநாடு', 'பிறந்தநாள்', 'விழா', 'அறிமுகம்', 'கச்சேரி']

const STEPS = [
  {
    n: '01', icon: 'clipboard' as const,
    en: { title: 'Post your event', desc: 'Describe the event, set your budget and date. AI fills in the services you need.' },
    ta: { title: 'நிகழ்வை பதிவிடுங்கள்', desc: 'நிகழ்வை விவரிக்கவும். AI தேவையான சேவைகளை பரிந்துரைக்கும்.' },
  },
  {
    n: '02', icon: 'zap' as const,
    en: { title: 'Vendors bid for you', desc: 'Vendors within 5 km are notified first. You get transparent, comparable bids — no calls needed.' },
    ta: { title: 'சேவையாளர்கள் ஏலம் போடுவார்கள்', desc: '5 கி.மீ. சேவையாளர்களுக்கு அறிவிக்கப்படும். தெளிவான ஏலங்கள் கிடைக்கும்.' },
  },
  {
    n: '03', icon: 'file-text' as const,
    en: { title: 'Agree & pay securely', desc: 'Accept the best bid. Digital agreement auto-generated. Pay via Razorpay.' },
    ta: { title: 'ஒப்புக்கொண்டு செலுத்துங்கள்', desc: 'சிறந்த ஏலத்தை ஏற்றுக்கொள்ளுங்கள். டிஜிட்டல் ஒப்பந்தம் தானாக தயாரிக்கப்படும்.' },
  },
  {
    n: '04', icon: 'check-circle' as const,
    en: { title: 'Event done. Vendor paid.', desc: 'Confirm completion in the app. Vendor receives payout within 2 days.' },
    ta: { title: 'நிகழ்வு முடிந்தது. பணம் கிடைத்தது.', desc: 'பயன்பாட்டில் முடிவை உறுதிப்படுத்துங்கள். 2 நாட்களில் பணம் கிடைக்கும்.' },
  },
]

const PAIN_POINTS = [
  {
    icon: 'shield' as const,
    en: { pain: 'Vendor no-shows', fix: 'Security deposit held. Backup pool activated in 4 hours if they cancel.' },
    ta: { pain: 'சேவையாளர் வராமல் போவது', fix: 'பாதுகாப்பு வைப்பு வைக்கப்படும். 4 மணி நேரத்தில் மாற்று குழு.' },
  },
  {
    icon: 'eye' as const,
    en: { pain: '"Quote on call" pricing', fix: 'Every bid is visible, detailed, and comparable in one place.' },
    ta: { pain: '"அழைப்பில் மேற்கோள்" விலை', fix: 'ஒவ்வொரு ஏலமும் ஒரே இடத்தில் தெளிவாக ஒப்பிடலாம்.' },
  },
  {
    icon: 'file-text' as const,
    en: { pain: 'No invoice, no GST trail', fix: 'Auto-generated GST invoices, PDFs on WhatsApp. 3-year records.' },
    ta: { pain: 'இன்வாய்ஸ் இல்லை, GST பதிவு இல்லை', fix: 'தானாக GST இன்வாய்ஸ். 3 ஆண்டு பதிவு.' },
  },
  {
    icon: 'lock' as const,
    en: { pain: 'Cash payments, no record', fix: 'Razorpay — RBI-licensed. Money released only after event confirmation.' },
    ta: { pain: 'பண கொடுப்பனவு, பதிவு இல்லை', fix: 'RBI அங்கீகரிக்கப்பட்ட Razorpay. நிகழ்வு உறுதிப்பட்ட பிறகே பணம்.' },
  },
  {
    icon: 'users' as const,
    en: { pain: 'WhatsApp thread chaos', fix: 'One dashboard for all vendors, bids, agreements, and payments.' },
    ta: { pain: 'WhatsApp நூல் குழப்பம்', fix: 'அனைத்திற்கும் ஒரே டாஷ்போர்டு.' },
  },
  {
    icon: 'clock' as const,
    en: { pain: 'Last-minute crises', fix: 'HE&P Emergency Response. Replacement in 4 hrs or full refund.' },
    ta: { pain: 'கடைசி நிமிட நெருக்கடி', fix: '4 மணி நேரத்தில் மாற்று அல்லது முழு திரும்பல்.' },
  },
]

const TRUST_ITEMS = [
  { icon: 'shield' as const,   en: 'Vendor security deposits',     ta: 'சேவையாளர் பாதுகாப்பு வைப்பு' },
  { icon: 'lock' as const,     en: 'Razorpay — RBI-licensed PA',   ta: 'RBI அங்கீகரிக்கப்பட்ட Razorpay' },
  { icon: 'file-text' as const, en: 'Auto GST invoices + Form 16A', ta: 'தானியங்கி GST இன்வாய்ஸ்கள்' },
  { icon: 'check-circle' as const, en: 'KYC verified vendors only', ta: 'KYC சரிபார்க்கப்பட்ட சேவையாளர்கள்' },
  { icon: 'award' as const,    en: 'IIT Madras-backed startup',    ta: 'IIT Madras ஆதரவு' },
  { icon: 'star' as const,     en: '4.9★ avg satisfaction',        ta: '4.9★ சராசரி திருப்தி' },
]

const CATEGORIES = [
  { icon: 'camera' as const,    en: 'Photography & Video', ta: 'புகைப்படம் & வீடியோ' },
  { icon: 'music' as const,     en: 'Entertainment',       ta: 'பொழுதுபோக்கு' },
  { icon: 'users' as const,     en: 'Catering',            ta: 'சிற்றுண்டி சேவை' },
  { icon: 'building' as const,  en: 'Venue',               ta: 'நிகழ்விடம்' },
  { icon: 'cpu' as const,       en: 'AV & Stage',          ta: 'ஒலி & மேடை' },
  { icon: 'truck' as const,     en: 'Logistics',           ta: 'தளவாட சேவை' },
  { icon: 'mic' as const,       en: 'Anchoring & MC',      ta: 'நிகழ்ச்சி தொகுப்பாளர்' },
  { icon: 'award' as const,     en: 'Decor & Florals',     ta: 'அலங்காரம்' },
  { icon: 'scissors' as const,  en: 'Bridal & Makeup',     ta: 'மணமகள் & மேக்கப்' },
  { icon: 'printer' as const,   en: 'Print & Invites',     ta: 'அழைப்பிதழ்கள்' },
]

const VENDOR_BENEFITS = [
  { icon: 'trending-up' as const, en: 'Revenue analytics — bid win rate, monthly earnings', ta: 'வருவாய் பகுப்பாய்வு — ஏல வெற்றி விகிதம்' },
  { icon: 'award' as const,       en: 'Build a reputation. Reviews and ratings stay with you.', ta: 'நற்பெயர் கட்டுங்கள். மதிப்பீடுகள் தங்கும்.' },
  { icon: 'file-text' as const,   en: 'GST invoices, TDS certificates auto-generated',       ta: 'GST இன்வாய்ஸ், TDS சான்றிதழ்கள் தானாக.' },
  { icon: 'shield' as const,      en: 'Emergency backup pool — earn even when others fail',   ta: 'அவசர காப்பு குழு — மற்றவர்கள் தோல்வியில்லை.' },
]

// ── Animation variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
}
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
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
    <span
      className="inline-block relative overflow-hidden align-bottom"
      style={{ minWidth: isTa ? '7ch' : '6.5ch' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[idx]}
          className="block text-gradient"
          initial={{ y: '105%', opacity: 0,  filter: 'blur(8px)' }}
          animate={{ y: '0%',   opacity: 1,  filter: 'blur(0px)' }}
          exit={{   y: '-105%', opacity: 0,  filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <span className="font-mono-hep text-[0.58rem] text-vivid/60 tracking-[0.35em]">{number}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-vivid/20 via-white/8 to-transparent" />
      <span className="text-[0.58rem] tracking-[0.28em] uppercase text-white/25">{label}</span>
    </div>
  )
}

function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ref.current?.style.setProperty('--mx', `${x}px`)
    ref.current?.style.setProperty('--my', `${y}px`)
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`group relative overflow-hidden ${className}`}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
        } as React.CSSProperties
      }
    >
      {/* Spotlight layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            'radial-gradient(280px circle at var(--mx) var(--my), rgba(34,81,255,0.1), transparent 70%)',
        }}
      />
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vivid/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {children}
    </div>
  )
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ isTa }: { isTa: boolean }) {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Aurora shader — fixed canvas */}
      <AuroraBackground className="fixed inset-0 w-full h-full" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse 80% 65% at 8% 38%, rgba(5,28,44,0.65) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to bottom, transparent 60%, #051C2C 100%)',
        }}
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 10 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[88vh] py-24">

          {/* ── Left: hero text ── */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px bg-vivid" />
              <span className="text-[0.6rem] tracking-[0.32em] uppercase text-white/40">
                {isTa ? 'இந்தியாவின் நிகழ்வு மேடை' : "India's event management platform"}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-success"
                style={{ animation: 'ping-dot 2s ease-in-out infinite' }}
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="font-display font-light leading-[0.9] mb-8 tracking-tight"
              style={{ fontSize: 'clamp(3.8rem, 8.5vw, 8.5rem)' }}
            >
              {isTa ? 'உங்கள்' : 'Your'}<br />
              {isTa ? 'அடுத்த' : 'next'}<br />
              <CyclicWord isTa={isTa} /><br />
              <span className="text-white/40 italic">{isTa ? 'சரியாக.' : 'done right.'}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-white/45 text-base leading-relaxed max-w-lg mb-10 font-light"
            >
              {isTa
                ? 'நிகழ்வை பதிவிடுங்கள். சேவையாளர்கள் ஏலம் போடுவார்கள். சிறந்ததை தேர்ந்தெடுங்கள். ஒப்பந்தங்கள், இன்வாய்ஸ்கள், கட்டணங்கள் — எல்லாம் தாமாகவே.'
                : 'Post your event. Vendors bid. You pick the best. Contracts, invoices, and payments — all handled.'}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/login" className="no-underline">
                <motion.div
                  whileHover={{ y: -3, boxShadow: '0 12px 50px rgba(34,81,255,0.55)' }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden bg-vivid-gradient text-white text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-9 py-4 text-center cursor-pointer transition-all duration-200 flex items-center justify-center gap-2.5"
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <motion.span
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%)', width: '60%' }}
                      animate={{ x: ['-100%', '280%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                    />
                  </span>
                  <Icon name="plus-circle" size={15} />
                  {isTa ? 'நிகழ்வை பதிவிடுக' : 'Post an Event'}
                </motion.div>
              </Link>

              <Link to="/login" className="no-underline">
                <motion.div
                  whileHover={{ y: -2, borderColor: 'rgba(34,81,255,0.6)', color: 'rgba(255,255,255,0.9)' }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-white/18 text-white/65 text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-9 py-4 text-center cursor-pointer transition-all duration-200 flex items-center justify-center gap-2.5"
                >
                  <Icon name="briefcase" size={15} />
                  {isTa ? 'சேவையாளராக சேருக' : 'Join as Vendor'}
                </motion.div>
              </Link>
            </motion.div>

            {/* Mini trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-5 mt-10"
            >
              <div className="flex -space-x-1.5">
                {['#2251FF', '#4D70FF', '#BDD7EE', '#2251FF'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-deep flex items-center justify-center"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${c}cc, ${c}66)` }}
                  />
                ))}
              </div>
              <span className="text-[0.65rem] text-white/35">
                {isTa ? '500+ நிகழ்வுகள் முடிந்தன' : '500+ events successfully managed'}
              </span>
            </motion.div>
          </div>

          {/* ── Right: floating stat cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-5 items-end"
          >
            {[
              { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated',  delay: 0, floatClass: 'animate-float' },
              { to: 120, suffix: '+', label: isTa ? 'சரிபார்க்கப்பட்ட சேவையாளர்கள்' : 'KYC-verified vendors',  delay: 0.2, floatClass: 'animate-float-slow' },
              { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள் — வளர்கிறோம்' : 'Cities — growing fast', delay: 0.4, floatClass: 'animate-float' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + s.delay, duration: 0.5 }}
                className={`glass border border-white/10 px-7 py-5 min-w-[200px] ${s.floatClass}`}
                style={{ animationDelay: `${s.delay}s` }}
              >
                <div className="font-display text-5xl font-light leading-none text-white mb-1">
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[0.62rem] tracking-[0.18em] uppercase text-white/30 mt-1">{s.label}</div>
              </motion.div>
            ))}

            {/* GST badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="border border-white/8 px-4 py-2.5 text-right mt-2"
            >
              <div className="text-[0.5rem] tracking-[0.22em] uppercase text-white/20 mb-0.5">GST Registered</div>
              <div className="font-mono-hep text-[0.6rem] text-white/30">33AAICH6273M1Z6</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-0.5 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
        <span className="text-[0.52rem] tracking-[0.28em] uppercase text-white/20">scroll</span>
      </motion.div>
    </section>
  )
}

// ── Marquee Ticker ─────────────────────────────────────────────────────────
function MarqueeTicker({ isTa }: { isTa: boolean }) {
  const items = TRUST_ITEMS.map(t => (
    <div key={t.en} className="flex items-center gap-2.5 flex-shrink-0 text-white/40 hover:text-white/65 transition-colors duration-200">
      <Icon name={t.icon} size={13} strokeWidth={1.5} className="text-vivid/60" />
      <span className="text-[0.63rem] tracking-[0.1em] whitespace-nowrap">{isTa ? t.ta : t.en}</span>
    </div>
  ))

  const itemsWithSeps = items.flatMap((item, i) => (i < items.length - 1 ? [item, <span key={`sep-${i}`} className="w-px h-3 bg-white/10 flex-shrink-0" />] : [item]))

  return (
    <div className="border-y border-white/6 py-3.5 overflow-hidden bg-deep/60 backdrop-blur-sm">
      <Marquee speed={35} gap="2.5rem">
        {itemsWithSeps}
      </Marquee>
    </div>
  )
}

// ── Stats Section ─────────────────────────────────────────────────────────
function StatsSection({ isTa }: { isTa: boolean }) {
  const stats = [
    { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated',   sub: isTa ? 'IIT Madras முதல் Chennai வரை' : 'From IIT Madras to Chennai weddings' },
    { to: 120, suffix: '+', label: isTa ? 'KYC சரிபார்க்கப்பட்டவர்கள்' : 'Verified vendors',  sub: isTa ? 'PAN சரிபார்க்கப்பட்டது' : 'PAN verified, security deposit held' },
    { to: 9,   suffix: '★', label: isTa ? 'சராசரி மதிப்பீடு' : 'Avg satisfaction',      sub: isTa ? '100+ மதிப்பாய்வுகள்' : 'Across 100+ completed events', prefix: '4.' },
    { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள்' : 'Cities active',           sub: isTa ? 'மேலும் விரைவில்' : 'More launching soon' },
  ]

  return (
    <section className="py-20 px-6 border-b border-white/6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="bg-deep px-8 py-9">
              <div
                className="font-display font-light text-white leading-none mb-2"
                style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}
              >
                {s.prefix ?? ''}
                <AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-[0.7rem] tracking-[0.14em] uppercase text-white/55 mb-1">{s.label}</div>
              <div className="text-[0.65rem] text-white/25">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── How it Works ──────────────────────────────────────────────────────────
function HowItWorksSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionLabel number="01" label={isTa ? 'நிகழ்வு பாதை' : 'How it works'} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2
            className="font-display font-light leading-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
          >
            {isTa ? 'நான்கு படிகளில்\nதிட்டமிடுங்கள்.' : 'Plan your event\nin four steps.'}
          </h2>
          <p className="text-white/35 text-sm max-w-sm">
            {isTa ? 'WhatsApp அலைச்சல் இல்லை. கடைசி நிமிட பரபரப்பு இல்லை.' : 'No WhatsApp back-and-forth. No last-minute surprises.'}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-vivid/30 to-transparent" style={{ zIndex: 0 }} />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                variants={fadeUp}
                className="relative group"
              >
                <div className="glass border border-white/8 p-7 flex flex-col gap-5 hover:border-vivid/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,81,255,0.1)]">
                  {/* Number + icon row */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 border border-white/10 flex items-center justify-center group-hover:border-vivid/40 group-hover:bg-vivid/5 transition-all duration-300">
                      <Icon name={step.icon} size={19} strokeWidth={1.4} className="text-white/45 group-hover:text-vivid/80 transition-colors duration-300" />
                    </div>
                    <span className="font-mono-hep text-[0.6rem] text-vivid/40 tracking-[0.25em]">{step.n}</span>
                  </div>
                  {/* Content */}
                  <div>
                    <h3 className="font-display text-[1.25rem] font-light leading-snug mb-2.5">
                      {isTa ? step.ta.title : step.en.title}
                    </h3>
                    <p className="text-[0.78rem] text-white/38 leading-relaxed">
                      {isTa ? step.ta.desc : step.en.desc}
                    </p>
                  </div>
                  {/* Bottom accent */}
                  <div className="h-px bg-gradient-to-r from-vivid/0 via-vivid/20 to-vivid/0 group-hover:via-vivid/50 transition-all duration-300" />
                </div>
                {/* Arrow connector — desktop */}
                {i < 3 && (
                  <div className="hidden lg:flex absolute top-[52px] -right-3 z-10 items-center">
                    <div className="w-6 h-px bg-vivid/25" />
                    <div
                      className="w-0 h-0"
                      style={{
                        borderTop: '5px solid transparent',
                        borderBottom: '5px solid transparent',
                        borderLeft: '6px solid rgba(34,81,255,0.25)',
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Pain Points ───────────────────────────────────────────────────────────
function PainPointsSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-28 px-6 border-t border-white/6">
      <div className="max-w-7xl mx-auto">
        <SectionLabel number="02" label={isTa ? 'நாம் தீர்க்கும் பிரச்சினைகள்' : 'What we fix'} />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-light leading-tight mb-14"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          {isTa ? 'நிகழ்வு ஏற்பாட்டின்\nமிகப்பெரிய தலைவலிகள்.' : 'The real problems\nwith event planning.'}
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5"
        >
          {PAIN_POINTS.map(p => (
            <motion.div key={p.en.pain} variants={fadeUp}>
              <SpotlightCard className="bg-deep p-7 h-full">
                <Icon
                  name={p.icon}
                  size={20}
                  strokeWidth={1.3}
                  className="text-white/18 mb-5 group-hover:text-vivid/60 transition-colors duration-300"
                />
                <div className="text-[0.58rem] tracking-[0.22em] uppercase text-white/22 mb-2">The problem</div>
                <h3 className="font-display text-xl font-light mb-3.5 text-white/65 leading-snug">
                  {isTa ? p.ta.pain : p.en.pain}
                </h3>
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-5 h-px bg-vivid/40" />
                  <Icon name="arrow-right" size={10} className="text-vivid/50" />
                </div>
                <p className="text-[0.78rem] text-white/38 leading-relaxed">
                  {isTa ? p.ta.fix : p.en.fix}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Categories Marquee Section ─────────────────────────────────────────────
function CategoriesSection({ isTa }: { isTa: boolean }) {
  const pills = CATEGORIES.map(c => (
    <div
      key={c.en}
      className="flex items-center gap-2.5 px-5 py-2.5 border border-white/10 hover:border-vivid/45 hover:bg-vivid/6 transition-all duration-200 cursor-default flex-shrink-0"
    >
      <Icon name={c.icon} size={14} strokeWidth={1.5} className="text-white/40" />
      <span className="text-[0.75rem] text-white/55 whitespace-nowrap tracking-wide">
        {isTa ? c.ta : c.en}
      </span>
    </div>
  ))

  return (
    <section className="py-28 border-t border-white/6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <SectionLabel number="03" label={isTa ? 'சேவை வகைகள்' : 'Service categories'} />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-light leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          {isTa ? 'எல்லா வகை\nசேவைகளும் ஒரே இடத்தில்.' : 'Every vendor category,\ncovered.'}
        </motion.h2>
      </div>

      <div className="flex flex-col gap-4">
        <Marquee speed={28} gap="1rem" className="py-1">
          {pills}
        </Marquee>
        <Marquee speed={22} reverse gap="1rem" className="py-1">
          {pills}
        </Marquee>
      </div>
    </section>
  )
}

// ── Vendor Section ─────────────────────────────────────────────────────────
function VendorSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-28 px-6 border-t border-white/6">
      <div className="max-w-7xl mx-auto">
        <SectionLabel number="04" label={isTa ? 'சேவையாளர்களுக்கு' : 'For vendors'} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display font-light leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)' }}
            >
              {isTa ? 'வேலை தேடுவது நிறுத்துங்கள்.\nவேலை உங்களை தேடட்டும்.' : "Stop hunting for clients.\nLet them find you."}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm"
            >
              {isTa
                ? 'உங்கள் பகுதியில் நிகழ்வு பதிவிடப்பட்டவுடன் WhatsApp அறிவிப்பு. ஏலம் போடுங்கள், ஒப்புக்கொள்ளுங்கள், வேலை கிடைக்கும். இடைத்தரகர்கள் இல்லை.'
                : 'The moment an event posts in your area, you get a WhatsApp ping. Bid, get accepted, do the work, get paid. No middlemen.'}
            </motion.p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 mb-10"
            >
              {VENDOR_BENEFITS.map(b => (
                <motion.div key={b.en} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-7 h-7 border border-vivid/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={b.icon} size={14} strokeWidth={1.5} className="text-vivid/70" />
                  </div>
                  <span className="text-[0.8rem] text-white/50 leading-relaxed">{isTa ? b.ta : b.en}</span>
                </motion.div>
              ))}
            </motion.div>

            <Link to="/login" className="no-underline inline-block">
              <motion.div
                whileHover={{ y: -2, borderColor: 'rgba(34,81,255,0.55)', color: 'rgba(255,255,255,0.9)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 border border-white/18 px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-white/60 hover:text-white transition-all cursor-pointer"
              >
                {isTa ? 'சேவையாளராக சேருக' : 'Join as a vendor'}
                <Icon name="arrow-right" size={14} />
              </motion.div>
            </Link>
          </div>

          {/* Right: Pro plan card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative glass border border-vivid/20 p-8 overflow-hidden">
              {/* Glow orb behind card */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(34,81,255,0.2) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[0.58rem] tracking-[0.28em] uppercase text-vivid mb-1">Pro Plan</div>
                    <div className="font-display text-4xl font-light text-white">₹2,499</div>
                    <div className="text-[0.65rem] text-white/35">per month</div>
                  </div>
                  <div className="border border-vivid/30 px-3 py-1.5">
                    <span className="text-[0.6rem] tracking-[0.18em] uppercase text-vivid/80">Popular</span>
                  </div>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    isTa ? 'முன்னுரிமை தேடல் பட்டியல்'          : 'Priority search listing',
                    isTa ? '30 போர்ட்ஃபோலியோ படங்கள்'           : '30 portfolio images',
                    isTa ? 'முன்னமே நிகழ்வு அணுகல்'              : 'Early event access (24hr)',
                    isTa ? 'அவசர காப்பு குழு தகுதி'              : 'Emergency backup pool eligibility',
                    isTa ? 'மேம்பட்ட வருவாய் பகுப்பாய்வு'         : 'Advanced revenue analytics',
                    isTa ? 'அர்ப்பணிக்கப்பட்ட ஆதரவு'             : 'Dedicated support line',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-4 h-4 border border-vivid/30 flex items-center justify-center flex-shrink-0">
                        <Icon name="check" size={10} strokeWidth={2} className="text-vivid/80" />
                      </div>
                      <span className="text-[0.78rem] text-white/50">{f}</span>
                    </div>
                  ))}
                </div>

                <Link to="/login" className="no-underline block">
                  <motion.div
                    whileHover={{ y: -2, boxShadow: '0 8px 40px rgba(34,81,255,0.45)' }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden bg-vivid-gradient text-white text-[0.7rem] font-semibold tracking-[0.16em] uppercase py-3.5 text-center cursor-pointer"
                  >
                    <motion.span
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)', width: '60%' }}
                      animate={{ x: ['-100%', '280%'] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.4 }}
                    />
                    <span className="relative">{isTa ? 'Pro ஆக தொடங்குங்கள்' : 'Get Started with Pro'}</span>
                  </motion.div>
                </Link>

                <p className="text-[0.6rem] text-white/20 text-center mt-3">
                  {isTa ? 'கமிஷன் இல்லை முதல் 3 மாதங்களுக்கு' : 'No commission for the first 3 months'}
                </p>
              </div>
            </div>

            {/* Free tier below */}
            <div className="mt-4 border border-white/8 p-5 flex items-center justify-between">
              <div>
                <div className="text-[0.62rem] tracking-[0.18em] uppercase text-white/30 mb-0.5">Free tier</div>
                <div className="text-[0.78rem] text-white/50">
                  {isTa ? '5 ஏலங்கள் / மாதம், 10 படங்கள்' : '5 bids/month, 10 portfolio images'}
                </div>
              </div>
              <Link to="/login" className="no-underline">
                <span className="text-[0.65rem] tracking-widest uppercase text-vivid/70 hover:text-vivid transition-colors">
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

// ── CTA Section ───────────────────────────────────────────────────────────
function CTASection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-32 px-6 border-t border-white/6 relative overflow-hidden">
      {/* Beam / spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 50% 55%, rgba(34,81,255,0.1) 0%, rgba(34,81,255,0.04) 40%, transparent 70%)',
        }}
      />
      {/* Rotating ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-vivid/5 pointer-events-none"
        style={{ animation: 'spotlight-rotate 30s linear infinite' }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-vivid/8 pointer-events-none"
        style={{ animation: 'spotlight-rotate 20s linear infinite reverse' }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Divider */}
        <div className="flex items-center justify-center gap-5 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/8" />
          <span className="font-mono-hep text-[0.55rem] text-white/20 tracking-[0.35em]">HE&P</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/8" />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="font-display font-light leading-tight mb-6"
          style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
        >
          {isTa ? 'உங்கள் அடுத்த நிகழ்வை\nஏற்பாடு செய்வோம்.' : 'Ready to plan your\nnext event?'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-white/32 text-sm mb-12 max-w-lg mx-auto leading-relaxed"
        >
          {isTa
            ? 'IIT Madras நிகழ்வுகளிலிருந்து Chennai திருமணங்கள் வரை — HE&P-ல் இப்போதே தொடங்குங்கள். முதல் 3 மாதங்கள் கமிஷன் இல்லை.'
            : 'From IIT Madras fests to Chennai weddings. No commission for the first 3 months.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/login" className="no-underline">
            <motion.div
              whileHover={{ y: -3, boxShadow: '0 12px 55px rgba(34,81,255,0.55)' }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden bg-vivid-gradient text-white text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-12 py-4 cursor-pointer flex items-center justify-center gap-2"
            >
              <motion.span
                className="absolute inset-0"
                style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%)', width: '60%' }}
                animate={{ x: ['-100%', '280%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              <Icon name="zap" size={14} />
              <span className="relative">{isTa ? 'நிகழ்வை பதிவிடுக — இலவசம்' : 'Post an Event — Free'}</span>
            </motion.div>
          </Link>
          <Link to="/login" className="no-underline">
            <motion.div
              whileHover={{ y: -2, borderColor: 'rgba(34,81,255,0.5)', color: 'rgba(255,255,255,0.88)' }}
              whileTap={{ scale: 0.97 }}
              className="border border-white/15 text-white/55 text-[0.72rem] font-semibold tracking-[0.16em] uppercase px-12 py-4 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Icon name="briefcase" size={14} />
              {isTa ? 'சேவையாளராக சேருக' : 'Join as a Vendor'}
            </motion.div>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-[0.58rem] text-white/18 mt-10 tracking-wide"
        >
          {isTa
            ? 'Razorpay மூலம் பாதுகாக்கப்பட்டது · GSTIN: 33AAICH6273M1Z6 · Chennai, Tamil Nadu'
            : 'Secured by Razorpay · GSTIN: 33AAICH6273M1Z6 · Built in Chennai, Tamil Nadu'}
        </motion.p>
      </div>
    </section>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────
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
