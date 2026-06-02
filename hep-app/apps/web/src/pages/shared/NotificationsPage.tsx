import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'

const stagger: Variants = { visible: { transition: { staggerChildren: 0.05 } } }
const fadeUp: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

type NotifCategory = 'all' | 'bids' | 'payments' | 'system'

interface Notif {
  id: string
  type: NotifCategory
  icon: string
  title: string
  titleTa: string
  body: string
  bodyTa: string
  time: string
  read: boolean
  actionLabel?: string
  actionPath?: string
  variant: 'vivid' | 'success' | 'warn' | 'error' | 'sky' | 'ghost'
}

const MOCK_NOTIFS: Notif[] = [
  {
    id: 'n1',
    type: 'bids',
    icon: '⚡',
    title: 'New bid received',
    titleTa: 'புதிய ஏலம் வந்தது',
    body: 'Sree Caterers submitted a bid of ₹2,10,000 on your wedding event.',
    bodyTa: 'Sree Caterers உங்கள் திருமண நிகழ்வில் ₹2,10,000 ஏலம் வைத்துள்ளார்.',
    time: '2 hours ago',
    read: false,
    actionLabel: 'View Bid',
    actionPath: '/consumer/events',
    variant: 'vivid',
  },
  {
    id: 'n2',
    type: 'bids',
    icon: '🎯',
    title: 'Bid accepted!',
    titleTa: 'ஏலம் ஏற்கப்பட்டது!',
    body: 'Congratulations! Your bid for Priya & Karthik\'s wedding has been accepted.',
    bodyTa: 'வாழ்த்துகள்! Priya & Karthik திருமணத்திற்கான உங்கள் ஏலம் ஏற்கப்பட்டது.',
    time: '4 hours ago',
    read: false,
    actionLabel: 'View Booking',
    actionPath: '/vendor/bids',
    variant: 'success',
  },
  {
    id: 'n3',
    type: 'payments',
    icon: '💰',
    title: 'Advance payment received',
    titleTa: 'முன்பணம் பெறப்பட்டது',
    body: '₹63,000 advance payment confirmed via Razorpay for the wedding event.',
    bodyTa: 'திருமண நிகழ்விற்காக Razorpay மூலம் ₹63,000 முன்பணம் உறுதிப்படுத்தப்பட்டது.',
    time: '5 hours ago',
    read: true,
    actionLabel: 'View Invoice',
    actionPath: '/vendor/dashboard',
    variant: 'success',
  },
  {
    id: 'n4',
    type: 'system',
    icon: '🛡️',
    title: 'KYC Approved',
    titleTa: 'KYC அங்கீகரிக்கப்பட்டது',
    body: 'Your business identity has been verified. You now have full access to the platform.',
    bodyTa: 'உங்கள் வணிக அடையாளம் சரிபார்க்கப்பட்டது. இப்போது தளத்தில் முழு அணுகல் உள்ளது.',
    time: '1 day ago',
    read: true,
    variant: 'vivid',
  },
  {
    id: 'n5',
    type: 'bids',
    icon: '⏰',
    title: 'Bid expiring soon',
    titleTa: 'ஏலம் விரைவில் காலாவதியாகும்',
    body: 'Your bid on "TechCorp Annual Awards Night" expires in 4 hours. Consider updating it.',
    bodyTa: '"TechCorp Annual Awards Night"-ல் உங்கள் ஏலம் 4 மணி நேரத்தில் காலாவதியாகும்.',
    time: '1 day ago',
    read: true,
    actionLabel: 'View',
    actionPath: '/vendor/bids',
    variant: 'warn',
  },
  {
    id: 'n6',
    type: 'payments',
    icon: '📄',
    title: 'Invoice generated',
    titleTa: 'இன்வாய்ஸ் தயாரிக்கப்பட்டது',
    body: 'GST invoice #HEP-2025-0042 has been generated and sent to your email.',
    bodyTa: 'GST இன்வாய்ஸ் #HEP-2025-0042 உருவாக்கப்பட்டு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது.',
    time: '2 days ago',
    read: true,
    variant: 'sky',
  },
  {
    id: 'n7',
    type: 'system',
    icon: '🔔',
    title: 'New event in your area',
    titleTa: 'உங்கள் பகுதியில் புதிய நிகழ்வு',
    body: 'A birthday party (budget ₹50k–₹1L) was posted 3.2 km from you.',
    bodyTa: 'உங்களிடமிருந்து 3.2 கி.மீ தூரத்தில் ஒரு பிறந்தநாள் விழா (பட்ஜெட் ₹50k–₹1L) பதிவிடப்பட்டது.',
    time: '3 days ago',
    read: true,
    actionLabel: 'Browse',
    actionPath: '/vendor/events',
    variant: 'vivid',
  },
]

const CATEGORY_TABS: { key: NotifCategory; label: string; labelTa: string }[] = [
  { key: 'all', label: 'All', labelTa: 'அனைத்தும்' },
  { key: 'bids', label: 'Bids', labelTa: 'ஏலங்கள்' },
  { key: 'payments', label: 'Payments', labelTa: 'கொடுப்பனவு' },
  { key: 'system', label: 'System', labelTa: 'கணினி' },
]

export function NotificationsPage() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const isTa = i18n.language === 'ta'

  const [category, setCategory] = useState<NotifCategory>('all')
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS)

  const filtered = category === 'all' ? notifs : notifs.filter(n => n.type === category)
  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function dismiss(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <SectionLabel>{isTa ? 'அறிவிப்புகள்' : 'Notifications'}</SectionLabel>
            <h1 className="font-display text-4xl font-light">
              {isTa ? 'உங்கள் புதுப்பிப்புகள்' : 'Your Updates'}
            </h1>
            {unreadCount > 0 && (
              <p className="text-vivid text-sm mt-1">
                {unreadCount} {isTa ? 'படிக்கப்படாத அறிவிப்புகள்' : 'unread notifications'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              {isTa ? 'அனைத்தையும் படித்ததாக குறி' : 'Mark all read'}
            </Button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-0 border border-vivid/15 mb-6 overflow-hidden">
          {CATEGORY_TABS.map(tab => {
            const count = tab.key === 'all'
              ? notifs.filter(n => !n.read).length
              : notifs.filter(n => n.type === tab.key && !n.read).length
            return (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`flex-1 py-2.5 text-[0.65rem] tracking-[0.12em] uppercase font-semibold flex items-center justify-center gap-1.5 transition-all
                  ${category === tab.key ? 'bg-vivid text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                {isTa ? tab.labelTa : tab.label}
                {count > 0 && (
                  <span className={`text-[0.55rem] px-1.5 py-0.5 rounded-full font-mono-hep
                    ${category === tab.key ? 'bg-white/20 text-white' : 'bg-vivid/30 text-vivid'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Notification list */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass border-vivid-subtle p-12 text-center"
              >
                <div className="text-4xl mb-4">🔕</div>
                <h3 className="font-display text-xl font-light">
                  {isTa ? 'அறிவிப்புகள் இல்லை' : 'All clear!'}
                </h3>
                <p className="text-muted-hep text-sm mt-2">
                  {isTa ? 'இந்த வகையில் அறிவிப்புகள் இல்லை.' : 'No notifications in this category.'}
                </p>
              </motion.div>
            ) : (
              filtered.map(notif => (
                <motion.div
                  key={notif.id}
                  variants={fadeUp}
                  layout
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  className={`glass border p-4 flex gap-3 transition-all cursor-pointer group
                    ${notif.read ? 'border-white/8' : 'border-vivid/30 bg-vivid/4'}`}
                  onClick={() => markRead(notif.id)}
                >
                  {/* Unread dot */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                    <span className="text-xl">{notif.icon}</span>
                    {!notif.read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-vivid animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className={`text-sm font-semibold ${notif.read ? 'text-white/70' : 'text-white'}`}>
                        {isTa ? notif.titleTa : notif.title}
                      </span>
                      <span className="text-muted-hep text-[0.6rem] flex-shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-muted-hep text-xs leading-relaxed mb-2">
                      {isTa ? notif.bodyTa : notif.body}
                    </p>
                    {notif.actionLabel && (
                      <button
                        onClick={e => { e.stopPropagation(); markRead(notif.id); navigate(notif.actionPath!) }}
                        className="text-vivid text-xs hover:text-vlight transition-colors font-semibold"
                      >
                        {notif.actionLabel} →
                      </button>
                    )}
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); dismiss(notif.id) }}
                    className="flex-shrink-0 text-white/20 hover:text-white/60 text-lg leading-none opacity-0 group-hover:opacity-100 transition-all self-start"
                    title="Dismiss"
                  >
                    ×
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {notifs.length > 0 && filtered.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="ghost" size="sm" onClick={() => setNotifs([])}>
              {isTa ? 'அனைத்தையும் அழி' : 'Clear all notifications'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
