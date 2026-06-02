import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { MOCK_EVENTS } from '@/lib/mock-data'
import { EVENT_TYPES, VENDOR_CATEGORIES, calcCommission } from '@/lib/constants'
import type { Event } from '@/types'

export function VendorEventsPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [bidModalOpen, setBidModalOpen] = useState(false)
  const [bidSubmitted, setBidSubmitted] = useState<string[]>([])
  const [bidPrice, setBidPrice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [_filterCat, _setFilterCat] = useState<string>('all')

  const events = MOCK_EVENTS

  const handleSubmitBid = async () => {
    if (!selectedEvent) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    setBidSubmitted(prev => [...prev, selectedEvent.id])
    setBidModalOpen(false)
    setIsSubmitting(false)
    setSelectedEvent(null)
  }

  const commission = bidPrice ? calcCommission(Number(bidPrice)) : 0
  const payout = bidPrice ? Number(bidPrice) - commission : 0

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <SectionLabel>{isTa ? 'உங்கள் பகுதியில் நிகழ்வுகள்' : 'Events Near You'}</SectionLabel>
          <h1 className="font-display text-5xl font-light">
            {isTa ? 'ஏலம் போட தயாரா?' : 'Ready to bid?'}
          </h1>
          <p className="text-muted-hep mt-2 text-sm">
            {isTa
              ? 'உங்கள் சேவை பகுதியில் உள்ள நிகழ்வுகள் — உங்களுக்கு பொருந்தியவற்றை ஏலம் போடுங்கள்.'
              : 'Events within your service area. Bid on the ones that match your expertise.'}
          </p>
        </div>

        {/* Notification strip */}
        <div className="glass border border-vivid/20 p-4 mb-6 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-success animate-[ping-dot_2s_ease-in-out_infinite] flex-shrink-0" />
          <p className="text-sm">
            <span className="text-success font-semibold">3 new events</span>
            <span className="text-muted-hep"> within 5km were posted in the last 24 hours. WhatsApp alerts sent.</span>
          </p>
          <Badge variant="vivid" className="ml-auto flex-shrink-0">{isTa ? 'புதியது' : 'New'}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event list */}
          <div className="lg:col-span-1 space-y-3">
            {events.map(event => {
              const typeInfo = EVENT_TYPES.find(t => t.value === event.type)
              const alreadyBid = bidSubmitted.includes(event.id)
              const distKm = (Math.random() * 8 + 1).toFixed(1)
              return (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                  className={`glass border p-5 cursor-pointer transition-all duration-200
                    ${selectedEvent?.id === event.id ? 'border-vivid bg-vivid/8' : 'border-vivid/15 hover:border-vivid/35'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeInfo?.icon}</span>
                      <h3 className="font-semibold text-sm leading-tight">{event.title}</h3>
                    </div>
                    {alreadyBid
                      ? <Badge variant="success" dot>Bid Sent</Badge>
                      : <Badge variant="vivid">{isTa ? 'திறந்திருக்கிறது' : 'Open'}</Badge>
                    }
                  </div>
                  <div className="flex flex-wrap gap-3 text-[0.67rem] text-muted-hep">
                    <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span>👥 {event.guest_count.toLocaleString('en-IN')}</span>
                    <span>💰 ₹{(event.budget_min / 1000).toFixed(0)}k–{(event.budget_max / 1000).toFixed(0)}k</span>
                    <span className="text-vivid">📍 {distKm} km</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Event detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass border-vivid-subtle p-6 space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{EVENT_TYPES.find(t => t.value === selectedEvent.type)?.icon}</span>
                        <h2 className="font-display text-3xl font-light">{selectedEvent.title}</h2>
                      </div>
                      <p className="text-muted-hep text-sm">{selectedEvent.venue_address}</p>
                    </div>
                    <Badge variant="vivid" dot>{isTa ? 'ஏலங்களுக்கு திறந்திருக்கிறது' : 'Open for Bids'}</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: isTa ? 'தேதி' : 'Date', value: new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                      { label: isTa ? 'விருந்தினர்கள்' : 'Guests', value: selectedEvent.guest_count.toLocaleString('en-IN') },
                      { label: isTa ? 'பட்ஜெட்' : 'Budget', value: `₹${(selectedEvent.budget_min / 1000).toFixed(0)}k–${(selectedEvent.budget_max / 1000).toFixed(0)}k` },
                      { label: isTa ? 'ஏல காலக்கெடு' : 'Bid Deadline', value: new Date(selectedEvent.bid_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
                    ].map(item => (
                      <div key={item.label} className="bg-mid/30 border border-white/5 p-3">
                        <div className="text-[0.6rem] tracking-widest uppercase text-muted-hep mb-1">{item.label}</div>
                        <div className="font-semibold text-sm">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-[0.65rem] tracking-widest uppercase text-sky/50 mb-2">{isTa ? 'தேவையான சேவைகள்' : 'Services Needed'}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.needed_categories.map(cat => {
                        const catInfo = VENDOR_CATEGORIES.find(c => c.value === cat)!
                        return (
                          <Badge key={cat} variant="vivid">{catInfo.icon} {isTa ? catInfo.labelTa : catInfo.label}</Badge>
                        )
                      })}
                    </div>
                  </div>

                  {selectedEvent.notes && (
                    <div className="border-l-2 border-vivid/30 pl-4">
                      <p className="text-[0.65rem] tracking-widest uppercase text-sky/50 mb-1">{isTa ? 'கூடுதல் குறிப்புகள்' : 'Organizer Notes'}</p>
                      <p className="text-muted-hep text-sm italic">{selectedEvent.notes}</p>
                    </div>
                  )}

                  {bidSubmitted.includes(selectedEvent.id) ? (
                    <div className="flex items-center gap-3 bg-success/10 border border-success/25 p-4">
                      <span className="text-success text-xl">✅</span>
                      <div>
                        <div className="text-success font-semibold text-sm">{isTa ? 'ஏலம் அனுப்பப்பட்டது!' : 'Bid Submitted!'}</div>
                        <p className="text-muted-hep text-xs">{isTa ? 'ஏற்பாட்டாளர் உங்கள் ஏலத்தை மதிப்பாய்வு செய்கிறார்.' : 'The organizer is reviewing your bid. You\'ll be notified on WhatsApp.'}</p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setBidModalOpen(true)}
                      size="lg"
                      className="w-full"
                    >
                      ⚡ {isTa ? 'ஏலம் சமர்ப்பிக்கவும்' : 'Submit Your Bid'}
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass border-vivid-subtle p-16 text-center flex flex-col items-center justify-center min-h-64"
                >
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="font-display text-2xl font-light mb-2">{isTa ? 'நிகழ்வை தேர்வு செய்யுங்கள்' : 'Select an event'}</h3>
                  <p className="text-muted-hep text-sm">{isTa ? 'விவரங்களை பார்க்க நிகழ்வை கிளிக் செய்யுங்கள்' : 'Click an event to view details and submit a bid'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bid submission modal */}
      <Modal open={bidModalOpen} onClose={() => setBidModalOpen(false)} title={isTa ? 'ஏலம் சமர்ப்பிக்கவும்' : 'Submit Your Bid'} size="lg">
        {selectedEvent && (
          <div className="space-y-5">
            <div className="bg-mid/30 border border-white/5 p-4 flex items-center gap-3">
              <span className="text-xl">{EVENT_TYPES.find(t => t.value === selectedEvent.type)?.icon}</span>
              <div>
                <div className="font-semibold text-sm">{selectedEvent.title}</div>
                <div className="text-muted-hep text-xs">{selectedEvent.guest_count} {isTa ? 'விருந்தினர்கள்' : 'guests'} · {new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</div>
              </div>
            </div>

            <Input
              label={isTa ? 'உங்கள் மேற்கோள் (₹)' : 'Your Quote (₹)'}
              type="number"
              prefix="₹"
              placeholder="e.g. 45000"
              value={bidPrice}
              onChange={e => setBidPrice(e.target.value)}
            />

            {bidPrice && (
              <div className="bg-deep/50 border border-white/5 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-hep">
                  <span>HE&P commission ({Math.round(commission / Number(bidPrice) * 100)}%)</span>
                  <span>- ₹{commission.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-white/10 pt-2 mt-2">
                  <span>{isTa ? 'உங்களுக்கு கிடைக்கும்' : 'Your payout'}</span>
                  <span className="text-success">₹{payout.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-muted-hep text-[0.68rem]">{isTa ? 'நிகழ்வு முடிந்த T+2 நாட்களில்' : 'Settled T+2 after event completion'}</p>
              </div>
            )}

            <Textarea
              label={isTa ? 'சேவை விவரம்' : 'What you will deliver'}
              placeholder={isTa ? 'நீங்கள் வழங்கும் சேவைகளை விவரிக்கவும்...' : 'Describe exactly what you will provide, including setup, serving, cleanup...'}
              rows={4}
            />

            <Textarea
              label={isTa ? 'ஏற்பாட்டாளருக்கு செய்தி' : 'Message to organizer'}
              placeholder={isTa ? 'இதே போன்ற நிகழ்வுகளில் உங்கள் அனுபவம்...' : 'Share relevant experience, availability confirmation, or portfolio links...'}
              rows={3}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setBidModalOpen(false)} className="flex-1">
                {isTa ? 'ரத்து' : 'Cancel'}
              </Button>
              <Button onClick={handleSubmitBid} loading={isSubmitting} className="flex-1">
                🚀 {isTa ? 'ஏலத்தை சமர்ப்பிக்கவும்' : 'Submit Bid'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
