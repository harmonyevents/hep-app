import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Stars } from '@/components/ui/Stars'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MOCK_VENDORS, MOCK_BIDS } from '@/lib/mock-data'
import { VENDOR_CATEGORIES } from '@/lib/constants'

const stagger: Variants = { visible: { transition: { staggerChildren: 0.07 } } }
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function VendorDashboardPage() {
  const { user } = useAuthStore()
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const vendor = MOCK_VENDORS[0]

  const stats = [
    { label: isTa ? 'மொத்த வருவாய் (இம்மாதம்)' : 'Revenue (This Month)', value: '₹1.2L', icon: '💰', highlight: true },
    { label: isTa ? 'ஏலம் வெற்றி விகிதம்' : 'Bid Win Rate', value: '34%', icon: '🎯' },
    { label: isTa ? 'மீண்டும் பதிவுகள்' : 'Repeat Bookings', value: '89', icon: '🔄' },
    { label: isTa ? 'மதிப்பீடு' : 'Avg Rating', value: '4.8★', icon: '⭐', highlight: true },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <SectionLabel>{isTa ? 'விற்பனையாளர் டாஷ்போர்டு' : 'Vendor Dashboard'}</SectionLabel>
            <h1 className="font-display text-5xl font-light">
              {vendor.business_name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Stars value={vendor.avg_rating} showValue />
              <span className="text-muted-hep text-sm">({vendor.total_reviews} {isTa ? 'மதிப்பாய்வுகள்' : 'reviews'})</span>
              {vendor.is_kyc_verified && <Badge variant="success" dot>{isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</Badge>}
              <Badge variant={vendor.subscription_tier === 'pro' ? 'vivid' : 'sky'}>{vendor.subscription_tier.toUpperCase()}</Badge>
            </div>
          </div>
          <Link to="/vendor/events">
            <Button icon="🔍">{isTa ? 'நிகழ்வுகளை தேடுக' : 'Browse Events'}</Button>
          </Link>
        </div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          {stats.map(stat => (
            <motion.div key={stat.label} variants={fadeUp}>
              <Card className={`p-5 ${stat.highlight ? 'border-vivid/35' : ''}`}>
                <div className="text-2xl mb-3">{stat.icon}</div>
                <div className={`font-display text-3xl font-light mb-1 ${stat.highlight ? 'text-vivid' : ''}`}>
                  {stat.value}
                </div>
                <div className="text-muted-hep text-xs tracking-wide">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance bar */}
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">{isTa ? 'நம்பகத்தன்மை மதிப்பெண்' : 'Reliability Score'}</h3>
            <span className="font-mono-hep text-vivid text-lg font-bold">{vendor.reliability_score}%</span>
          </div>
          <div className="w-full bg-white/5 h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${vendor.reliability_score}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-vivid to-success"
            />
          </div>
          <div className="flex justify-between text-[0.65rem] text-muted-hep mt-2">
            <span>{isTa ? 'ஒப்பந்தம் முடிவு விகிதம்' : 'Completion rate'}:  {vendor.reliability_score}%</span>
            <span>{isTa ? 'சராசரி பதில் நேரம்' : 'Avg response'}: {vendor.response_time_hours}h</span>
            <span>{isTa ? 'முடிந்த நிகழ்வுகள்' : 'Events done'}: {vendor.total_events}</span>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent bids */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-light">{isTa ? 'என் சமீபத்திய ஏலங்கள்' : 'Recent Bids'}</h2>
              <Link to="/vendor/bids" className="text-vivid text-sm hover:text-vlight no-underline">
                {isTa ? 'அனைத்தும்' : 'View all'} →
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_BIDS.slice(0, 3).map(bid => (
                <motion.div
                  key={bid.id}
                  whileHover={{ x: 3 }}
                  className="glass border-vivid-subtle p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold text-sm mb-0.5">Wedding Photography Bid</div>
                    <div className="text-muted-hep text-xs">Submitted 2 hours ago · Awaiting response</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display text-xl font-light">₹{bid.price.toLocaleString('en-IN')}</div>
                    <Badge variant="warn">{isTa ? 'காத்திருக்கிறது' : 'Pending'}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Profile completion + tips */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3">{isTa ? 'சுயவிவர முழுமை' : 'Profile Completeness'}</h3>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2251FF" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.78)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono-hep text-vivid font-bold text-xl">78%</span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: isTa ? 'KYC சரிபார்ப்பு' : 'KYC Verification', done: true },
                  { label: isTa ? 'போர்ட்ஃபோலியோ படங்கள்' : 'Portfolio Photos (2/20)', done: true },
                  { label: isTa ? 'சேவை பகுதி வரைபடம்' : 'Service Area Map', done: false },
                  { label: isTa ? 'கிடைக்கும் நேரம் அட்டவணை' : 'Availability Calendar', done: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <span className={item.done ? 'text-success' : 'text-muted-hep'}>
                      {item.done ? '✓' : '○'}
                    </span>
                    <span className={item.done ? 'text-white/70' : 'text-muted-hep'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3">{isTa ? 'சந்தா திட்டம்' : 'Subscription'}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="vivid">PRO</Badge>
                <span className="text-muted-hep text-xs">₹2,499 / month</span>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-hep">
                {[
                  isTa ? '✓ வரம்பற்ற ஏலங்கள்' : '✓ Unlimited bids',
                  isTa ? '✓ முன்னுரிமை பட்டியல்' : '✓ Priority listing',
                  isTa ? '✓ முகப்பு சேவையாளர் தொகுப்பு' : '✓ Emergency backup pool',
                  isTa ? '✓ விரிவான பகுப்பாய்வு' : '✓ Advanced analytics',
                ].map(f => <li key={f}>{f}</li>)}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
