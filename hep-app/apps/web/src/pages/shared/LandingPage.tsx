import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Marquee } from '@/components/ui/Marquee'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

// ── Design tokens ──────────────────────────────────────────────────────────────
const NAVY = '#031635'
const NAVY_MID = '#1a2b4b'
const GOLD = '#D4AF37'
const GOLD_15 = 'rgba(212,175,55,0.15)'
const GOLD_25 = 'rgba(212,175,55,0.25)'
const INK = '#0A0A0A'
const INK_2 = '#3D3D3D'
const INK_3 = '#858585'
const BG = '#F5F5F5'
const BG_ALT = '#EFEFEF'
const WHITE = '#FFFFFF'
const BORDER = '#E4E4E4'

// ── Data ───────────────────────────────────────────────────────────────────────
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

// ── Sub-components ─────────────────────────────────────────────────────────────
function CyclicWord({ isTa }: { isTa: boolean }) {
  const [idx, setIdx] = useState(0)
  const words = isTa ? TA_WORDS : EN_WORDS
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % words.length), 2800)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span className="inline-block relative overflow-hidden align-bottom" style={{ minWidth: isTa ? '7ch' : '6.5ch', color: GOLD }}>
      <AnimatePresence mode="wait">
        <motion.span key={words[idx]}
          className="block"
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: '0%',   opacity: 1 }}
          exit={{   y: '-105%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >{words[idx]}</motion.span>
      </AnimatePresence>
    </span>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection({ isTa }: { isTa: boolean }) {
  return (
    <div className="flex-1 px-6 pb-6 pt-3 flex">
      <div
        className="relative w-full rounded-2xl overflow-hidden flex flex-col"
        style={{
          height: 'calc(100vh - 36px)',
          background: 'linear-gradient(160deg, #031635 0%, #0F2340 55%, #031635 100%)',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg pointer-events-none" style={{ opacity: 0.20, zIndex: 1 }} />

        {/* Floating stat cards top-right */}
        <div className="absolute top-12 right-8 flex flex-col gap-4 z-10 hidden lg:flex">
          {[
            { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated', delay: 0 },
            { to: 120, suffix: '+', label: isTa ? 'KYC சரிபார்க்கப்பட்டவர்கள்' : 'KYC-verified vendors', delay: 0.2 },
            { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள்' : 'Cities — growing fast', delay: 0.4 },
          ].map((s) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + s.delay, duration: 0.5 }}
              className="animate-float px-6 py-4"
              style={{
                animationDelay: `${s.delay}s`,
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                minWidth: 180,
              }}
            >
              <div className="font-medium leading-none mb-1" style={{ fontSize: '2.5rem', color: GOLD }}>
                <AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-xs tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-10 md:p-14 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-px" style={{ background: GOLD }} />
            <span style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
              {isTa ? 'இந்தியாவின் நிகழ்வு மேடை' : "India's event management platform"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e', animation: 'ping-dot 2s ease-in-out infinite' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="font-medium text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            {isTa ? 'உங்கள்' : 'Your'}<br />
            {isTa ? 'அடுத்த' : 'next'}<br />
            <CyclicWord isTa={isTa} /><br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>{isTa ? 'சரியாக.' : 'done right.'}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.60)', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.6 }}
          >
            {isTa
              ? 'நிகழ்வை பதிவிடுங்கள். சேவையாளர்கள் ஏலம் போடுவார்கள். சிறந்ததை தேர்ந்தெடுங்கள்.'
              : 'Post your event. Vendors bid. You pick the best. Contracts, invoices, and payments — all handled.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Link to="/login" className="no-underline">
              <motion.div
                whileHover={{ y: -3, boxShadow: `0 12px 40px ${GOLD_25}` }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden flex items-center justify-center gap-2.5 cursor-pointer"
                style={{ background: GOLD, color: NAVY, borderRadius: 9999, fontWeight: 600, padding: '0.75rem 2rem', fontSize: '0.9375rem' }}
              >
                <motion.span className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.3) 50%,transparent 65%)', width: '60%' }}
                  animate={{ x: ['-100%', '280%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
                <Icon name="plus-circle" size={16} />
                <span className="relative">{isTa ? 'நிகழ்வை பதிவிடுக' : 'Post an Event'}</span>
                <div className="relative w-6 h-6 rounded-full flex items-center justify-center" style={{ background: NAVY }}>
                  <ArrowRight size={12} color={GOLD} />
                </div>
              </motion.div>
            </Link>
            <Link to="/login" className="no-underline">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.75)', borderRadius: 9999, padding: '0.75rem 2rem', fontSize: '0.9375rem' }}
              >
                <Icon name="briefcase" size={15} />
                {isTa ? 'சேவையாளராக சேருக' : 'Join as Vendor'}
              </motion.div>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-1.5">
              {[GOLD, NAVY_MID, GOLD_15, 'rgba(212,175,55,0.6)'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2"
                  style={{ borderColor: NAVY, background: `radial-gradient(circle at 35% 35%, ${c}cc, ${c}66)` }} />
              ))}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>
              {isTa ? '500+ நிகழ்வுகள் முடிந்தன' : '500+ events successfully managed'}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── Trust Ticker ───────────────────────────────────────────────────────────────
function TrustTicker({ isTa }: { isTa: boolean }) {
  const items = TRUST_ITEMS.map(t => (
    <div key={t.en} className="flex items-center gap-2.5 flex-shrink-0 transition-colors duration-200"
      style={{ color: INK_3 }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.color = GOLD)}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.color = INK_3)}
    >
      <Icon name={t.icon} size={13} strokeWidth={1.5} style={{ color: GOLD }} />
      <span className="whitespace-nowrap" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{isTa ? t.ta : t.en}</span>
    </div>
  ))
  const withSeps = items.flatMap((item, i) =>
    i < items.length - 1 ? [item, <span key={`s${i}`} className="w-px h-3 flex-shrink-0" style={{ background: GOLD_25 }} />] : [item]
  )
  return (
    <div className="py-3.5 overflow-hidden" style={{ background: BG, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <Marquee speed={35} gap="2.5rem">{withSeps}</Marquee>
    </div>
  )
}

// ── Stats ──────────────────────────────────────────────────────────────────────
function StatsSection({ isTa }: { isTa: boolean }) {
  const stats = [
    { to: 500, suffix: '+', label: isTa ? 'நிகழ்வுகள் முடிந்தன' : 'Events facilitated',    sub: isTa ? 'IIT Madras முதல் Chennai வரை' : 'From IIT Madras to Chennai weddings' },
    { to: 120, suffix: '+', label: isTa ? 'KYC சரிபார்க்கப்பட்டவர்கள்' : 'Verified vendors', sub: isTa ? 'PAN சரிபார்க்கப்பட்டது' : 'PAN verified, security deposit held' },
    { to: 9,   suffix: '★', label: isTa ? 'சராசரி மதிப்பீடு' : 'Avg satisfaction',      sub: isTa ? '100+ மதிப்பாய்வுகள்' : 'Across 100+ completed events', prefix: '4.' },
    { to: 3,   suffix: '',  label: isTa ? 'நகரங்கள்' : 'Cities active',           sub: isTa ? 'மேலும் விரைவில்' : 'More launching soon' },
  ]
  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-[88rem] mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} className="px-8 py-10"
              style={{ borderRight: i < stats.length - 1 ? `1px solid ${BORDER}` : 'none' }}
            >
              <div className="font-medium leading-none mb-2" style={{ fontSize: '3rem', color: GOLD }}>
                {s.prefix ?? ''}<AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="mb-1" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK_3 }}>{s.label}</div>
              <div style={{ fontSize: '0.875rem', color: INK_2 }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── How It Works ───────────────────────────────────────────────────────────────
function HowItWorksSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-24 px-6" style={{ background: BG_ALT }}>
      <div className="max-w-[88rem] mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
              {isTa ? 'நிகழ்வு பாதை' : 'How it works'}
            </span>
          </div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-medium" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: INK }}
          >
            {isTa ? 'நான்கு படிகளில் திட்டமிடுங்கள்.' : 'Plan your event in four steps.'}
          </motion.h2>
          <p className="mt-3" style={{ color: INK_2, fontSize: '1rem' }}>
            {isTa ? 'WhatsApp அலைச்சல் இல்லை. கடைசி நிமிட பரபரப்பு இல்லை.' : 'No WhatsApp back-and-forth. No last-minute surprises.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STEPS.map((step, i) => (
            <motion.div key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: '2rem' }}>
                <div className="flex items-center gap-4 mb-4">
                  <span style={{ fontSize: '2rem', fontWeight: 600, color: GOLD, borderLeft: `3px solid ${GOLD}`, paddingLeft: '1rem', lineHeight: 1 }}>{step.n}</span>
                  <div className="flex items-center justify-center" style={{ background: BG_ALT, borderRadius: 8, width: 40, height: 40, flexShrink: 0 }}>
                    <Icon name={step.icon} size={17} strokeWidth={1.5} style={{ color: GOLD }} />
                  </div>
                </div>
                <h3 className="font-medium mb-2" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', color: INK }}>
                  {isTa ? step.ta.title : step.en.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: INK_2, lineHeight: 1.6 }}>
                  {isTa ? step.ta.desc : step.en.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pain Points ────────────────────────────────────────────────────────────────
function PainPointsSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-[88rem] mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
              {isTa ? 'நாம் தீர்க்கும் பிரச்சினைகள்' : 'What we fix'}
            </span>
          </div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-medium" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: INK }}
          >
            {isTa ? 'நிகழ்வு ஏற்பாட்டின் மிகப்பெரிய தலைவலிகள்.' : 'The real problems with event planning.'}
          </motion.h2>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PAIN_POINTS.map(p => (
            <motion.div key={p.en.pain} variants={fadeUp}
              style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: '1.75rem' }}
            >
              <div className="mb-4">
                <Icon name={p.icon} size={20} strokeWidth={1.4} style={{ color: GOLD }} />
              </div>
              <div className="mb-1" style={{ color: INK_3, fontSize: '0.875rem' }}>The problem</div>
              <h3 className="font-medium mb-3" style={{ fontSize: '1.125rem', color: INK, letterSpacing: '-0.01em' }}>
                {isTa ? p.ta.pain : p.en.pain}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-px" style={{ background: GOLD }} />
                <Icon name="arrow-right" size={10} style={{ color: GOLD }} />
              </div>
              <p style={{ color: INK_2, fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {isTa ? p.ta.fix : p.en.fix}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Categories ─────────────────────────────────────────────────────────────────
function CategoriesSection({ isTa }: { isTa: boolean }) {
  const pills = CATEGORIES.map(c => (
    <div key={c.en}
      className="flex items-center gap-2.5 flex-shrink-0 cursor-default transition-all duration-200"
      style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 9999, padding: '0.5rem 1.25rem' }}
      onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = GOLD_25; d.style.background = GOLD_15 }}
      onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = BORDER; d.style.background = WHITE }}
    >
      <Icon name={c.icon} size={14} strokeWidth={1.5} style={{ color: GOLD }} />
      <span className="whitespace-nowrap" style={{ fontSize: '0.875rem', fontWeight: 500, color: INK_2 }}>{isTa ? c.ta : c.en}</span>
    </div>
  ))
  return (
    <section className="py-16 px-6 overflow-hidden" style={{ background: BG_ALT }}>
      <div className="max-w-[88rem] mx-auto mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            {isTa ? 'சேவை வகைகள்' : 'Service categories'}
          </span>
        </div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-medium" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: INK }}
        >
          {isTa ? 'எல்லா வகை சேவைகளும் ஒரே இடத்தில்.' : 'Every vendor category, covered.'}
        </motion.h2>
      </div>
      <div className="flex flex-col gap-4">
        <Marquee speed={28} gap="1rem" className="py-1">{pills}</Marquee>
        <Marquee speed={22} reverse gap="1rem" className="py-1">{pills}</Marquee>
      </div>
    </section>
  )
}

// ── Vendor Section ─────────────────────────────────────────────────────────────
function VendorSection({ isTa }: { isTa: boolean }) {
  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-[88rem] mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <span style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            {isTa ? 'சேவையாளர்களுக்கு' : 'For vendors'}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-medium mb-6" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.03em', color: INK }}
            >
              {isTa ? 'வேலை தேடுவது நிறுத்துங்கள்.\nவேலை உங்களை தேடட்டும்.' : "Stop hunting for clients.\nLet them find you."}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="mb-8 max-w-sm" style={{ fontSize: '1rem', color: INK_2, lineHeight: 1.7 }}
            >
              {isTa
                ? 'உங்கள் பகுதியில் நிகழ்வு பதிவிடப்பட்டவுடன் அறிவிப்பு. ஏலம் போடுங்கள், வேலை கிடைக்கும்.'
                : 'The moment an event posts in your area, you get notified. Bid, get accepted, do the work, get paid. No middlemen.'}
            </motion.p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4 mb-10">
              {VENDOR_BENEFITS.map(b => (
                <motion.div key={b.en} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ border: `1px solid ${GOLD_25}`, background: GOLD_15, borderRadius: 8 }}
                  >
                    <Icon name={b.icon} size={14} strokeWidth={1.5} style={{ color: GOLD }} />
                  </div>
                  <span style={{ fontSize: '0.9375rem', color: INK_2, lineHeight: 1.6 }}>{isTa ? b.ta : b.en}</span>
                </motion.div>
              ))}
            </motion.div>
            <Link to="/login" className="no-underline inline-block">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 cursor-pointer transition-all"
                style={{ background: NAVY_MID, color: WHITE, borderRadius: 9999, padding: '0.75rem 2rem', fontSize: '0.9375rem', fontWeight: 600 }}
              >
                {isTa ? 'சேவையாளராக சேருக' : 'Join as a vendor'}
                <ArrowRight size={14} />
              </motion.div>
            </Link>
          </div>

          {/* Vendor pro card */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <div style={{ background: NAVY, borderRadius: 16, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${GOLD_15} 0%, transparent 70%)`, filter: 'blur(30px)' }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.6)', marginBottom: 4 }}>Pro Plan</div>
                    <div className="font-medium" style={{ fontSize: '2.5rem', color: GOLD }}>₹2,499</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.40)' }}>per month</div>
                  </div>
                  <div style={{ padding: '0.375rem 0.75rem', border: `1px solid ${GOLD_25}`, background: GOLD_15, borderRadius: 9999 }}>
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>Popular</span>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  {[
                    isTa ? 'முன்னுரிமை தேடல் பட்டியல்' : 'Priority search listing',
                    isTa ? '30 போர்ட்ஃபோலியோ படங்கள்'  : '30 portfolio images',
                    isTa ? 'முன்னமே நிகழ்வு அணுகல்'     : 'Early event access (24hr)',
                    isTa ? 'அவசர காப்பு குழு தகுதி'     : 'Emergency backup pool eligibility',
                    isTa ? 'மேம்பட்ட வருவாய் பகுப்பாய்வு' : 'Advanced revenue analytics',
                    isTa ? 'அர்ப்பணிக்கப்பட்ட ஆதரவு'    : 'Dedicated support line',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ border: `1px solid ${GOLD_25}`, borderRadius: 4 }}>
                        <Icon name="check" size={10} strokeWidth={2} style={{ color: GOLD }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/login" className="no-underline block">
                  <motion.div whileHover={{ y: -2, boxShadow: `0 8px 30px ${GOLD_25}` }} whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden font-semibold py-3.5 text-center cursor-pointer"
                    style={{ background: GOLD, color: NAVY, borderRadius: 9999, fontSize: '0.9375rem' }}
                  >
                    <motion.span className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)', width: '60%' }}
                      animate={{ x: ['-100%', '280%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.4 }} />
                    <span className="relative">{isTa ? 'Pro ஆக தொடங்குங்கள்' : 'Get Started with Pro'}</span>
                  </motion.div>
                </Link>
                <p className="text-center mt-3" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                  {isTa ? 'கமிஷன் இல்லை முதல் 3 மாதங்களுக்கு' : 'No commission for the first 3 months'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTASection({ isTa }: { isTa: boolean }) {
  return (
    <section className="px-6 pb-6" style={{ background: BG }}>
      <div style={{ background: NAVY, borderRadius: 16, padding: '4rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 70% at 50% 55%, rgba(212,175,55,0.08) 0%, transparent 70%)` }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1.5rem' }}>HE&amp;P</div>
            <h2 className="font-medium text-white mb-5" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {isTa ? 'உங்கள் அடுத்த நிகழ்வை ஏற்பாடு செய்வோம்.' : 'Ready to plan your next event?'}
            </h2>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="mb-10 max-w-lg mx-auto" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.50)', lineHeight: 1.7 }}
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
                className="relative overflow-hidden font-semibold cursor-pointer flex items-center justify-center gap-2"
                style={{ background: GOLD, color: NAVY, borderRadius: 9999, padding: '0.875rem 2.5rem', fontSize: '0.9375rem' }}
              >
                <motion.span className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)', width: '60%' }}
                  animate={{ x: ['-100%', '280%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
                <Icon name="zap" size={15} />
                <span className="relative">{isTa ? 'நிகழ்வை பதிவிடுக — இலவசம்' : 'Post an Event — Free'}</span>
              </motion.div>
            </Link>
            <Link to="/login" className="no-underline">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="font-medium cursor-pointer flex items-center justify-center gap-2 transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.70)', borderRadius: 9999, padding: '0.875rem 2.5rem', fontSize: '0.9375rem' }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = GOLD_25; d.style.color = GOLD }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = 'rgba(255,255,255,0.20)'; d.style.color = 'rgba(255,255,255,0.70)' }}
              >
                <Icon name="briefcase" size={15} />
                {isTa ? 'சேவையாளராக சேருக' : 'Join as a Vendor'}
              </motion.div>
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-10" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.20)' }}
          >
            {isTa ? 'Razorpay மூலம் பாதுகாக்கப்பட்டது · GSTIN: 33AAICH6273M1Z6 · Chennai, Tamil Nadu'
              : 'Secured by Razorpay · GSTIN: 33AAICH6273M1Z6 · Built in Chennai, Tamil Nadu'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  return (
    <div className="flex flex-col overflow-x-hidden" style={{ background: BG }}>
      <div className="h-screen flex flex-col overflow-hidden">
        <HeroSection isTa={isTa} />
      </div>
      <TrustTicker isTa={isTa} />
      <StatsSection isTa={isTa} />
      <HowItWorksSection isTa={isTa} />
      <PainPointsSection isTa={isTa} />
      <CategoriesSection isTa={isTa} />
      <VendorSection isTa={isTa} />
      <CTASection isTa={isTa} />
    </div>
  )
}
