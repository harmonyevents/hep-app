import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MOCK_EVENTS, MOCK_BIDS } from '@/lib/mock-data'
import { EVENT_TYPES } from '@/lib/constants'

const stagger: Variants = { visible: { transition: { staggerChildren: 0.07 } } }
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function ConsumerDashboardPage() {
  const { user } = useAuthStore()
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'

  const stats = [
    { label: isTa ? 'மொத்த நிகழ்வுகள்' : 'Total Events', value: '3', icon: '🎉' },
    { label: isTa ? 'செயலில் ஏலங்கள்' : 'Active Bids', value: '9', icon: '⚡', highlight: true },
    { label: isTa ? 'முடிந்த நிகழ்வுகள்' : 'Completed', value: '0', icon: '✅' },
    { label: isTa ? 'சேமிக்கப்பட்ட சேவையாளர்கள்' : 'Saved Vendors', value: '4', icon: '❤️' },
  ]

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh' }} className="pt-24 pb-16 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <SectionLabel>{isTa ? 'டாஷ்போர்டு' : 'Dashboard'}</SectionLabel>
            <h1 className="font-medium" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', letterSpacing: '-0.03em', color: '#0A0A0A' }}>
              {isTa ? `வணக்கம், ${user?.name}` : `Hey, ${user?.name?.split(' ')[0]}.`}
            </h1>
            <p className="mt-2 text-sm" style={{ color: '#858585' }}>
              {isTa ? 'உங்கள் நிகழ்வுகளை நிர்வகிக்கவும்.' : "Here's what's happening with your events."}
            </p>
          </div>
          <Link to="/consumer/post">
            <Button icon="➕">{isTa ? 'புதிய நிகழ்வு' : 'Post Event'}</Button>
          </Link>
        </div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
        >
          {stats.map(stat => (
            <motion.div key={stat.label} variants={fadeUp}>
              <Card style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E4E4E4', padding: '1.5rem' }}>
                <div className="text-2xl mb-3">{stat.icon}</div>
                <div className="font-medium mb-1" style={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 600 }}>
                  {stat.value}
                </div>
                <div style={{ color: '#858585', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active events */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-2xl font-light">{isTa ? 'செயலில் நிகழ்வுகள்' : 'Active Events'}</h2>
              <Link to="/consumer/events" className="text-vivid text-sm hover:text-vlight transition-colors no-underline">
                {isTa ? 'அனைத்தும் காண்க' : 'View all'} →
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_EVENTS.filter(e => e.status === 'open' || e.status === 'bids_received').map(event => {
                const typeInfo = EVENT_TYPES.find(t => t.value === event.type)
                const bids = MOCK_BIDS.filter(b => b.event_id === event.id)
                return (
                  <Link key={event.id} to="/consumer/events" className="no-underline block">
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="glass border-vivid-subtle p-5 hover:border-vivid/35 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{typeInfo?.icon}</span>
                          <div>
                            <h3 className="font-semibold text-sm">{event.title}</h3>
                            <p className="text-muted-hep text-xs mt-0.5">
                              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} · {event.guest_count} {isTa ? 'விருந்தினர்கள்' : 'guests'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.bids_count > 0 && (
                            <Badge variant="warn">{event.bids_count} {isTa ? 'ஏலங்கள்' : 'bids'}</Badge>
                          )}
                          <Badge variant="vivid" dot>{isTa ? 'திறந்திருக்கிறது' : 'Open'}</Badge>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick actions + notifications */}
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-2xl font-light mb-4">{isTa ? 'விரைவு நடவடிக்கைகள்' : 'Quick Actions'}</h2>
              <div className="space-y-2">
                {[
                  { to: '/consumer/post', icon: '📋', label: isTa ? 'நிகழ்வை பதிவிடுக' : 'Post New Event', desc: isTa ? 'AI உதவியுடன்' : 'With AI assistance' },
                  { to: '/consumer/events', icon: '⚡', label: isTa ? 'ஏலங்களை பார்க்க' : 'View Incoming Bids', desc: `9 ${isTa ? 'புதிய ஏலங்கள்' : 'new bids waiting'}` },
                ].map(action => (
                  <Link key={action.to} to={action.to} className="no-underline">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="glass border-vivid-subtle p-4 flex items-center gap-3 hover:border-vivid/40 transition-colors"
                    >
                      <span className="text-xl">{action.icon}</span>
                      <div>
                        <div className="text-sm font-semibold">{action.label}</div>
                        <div className="text-muted-hep text-xs">{action.desc}</div>
                      </div>
                      <span className="ml-auto text-vivid text-lg">→</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3">{isTa ? 'HE&P உத்தரவாதம்' : 'HE&P Guarantee'}</h3>
              <div className="space-y-2.5">
                {[
                  isTa ? '✅ சரிபார்க்கப்பட்ட சேவையாளர்கள் மட்டும்' : '✅ Only verified vendors bid on your event',
                  isTa ? '🛡️ 48-மணி நேர அவசர மாற்றீடு' : '🛡️ Emergency replacement within 48 hrs',
                  isTa ? '🔒 Razorpay மூலம் பாதுகாப்பான கொடுப்பனவு' : '🔒 Secure payments via Razorpay',
                  isTa ? '📋 தானாக உருவாகும் GST இன்வாய்ஸ்' : '📋 Auto-generated GST invoices',
                ].map(item => (
                  <p key={item} className="text-muted-hep text-xs">{item}</p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
