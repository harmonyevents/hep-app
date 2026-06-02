import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { InvoiceModal } from '@/components/InvoiceModal'
import { MOCK_EVENTS, MOCK_BIDS, MOCK_VENDORS } from '@/lib/mock-data'
import { EVENT_TYPES, VENDOR_CATEGORIES, calcCommission } from '@/lib/constants'
import { Stars } from '@/components/ui/Stars'
import type { Bid } from '@/types'

const STATUS_BADGE: Record<string, { label: string; variant: 'vivid' | 'success' | 'warn' | 'error' | 'sky' | 'ghost' }> = {
  open: { label: 'Open for Bids', variant: 'vivid' },
  bids_received: { label: 'Bids In', variant: 'warn' },
  booking_in_progress: { label: 'Booking', variant: 'sky' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  completed: { label: 'Completed', variant: 'ghost' },
  cancelled: { label: 'Cancelled', variant: 'error' },
}

export function ConsumerEventsPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const [searchParams] = useSearchParams()
  const justPosted = searchParams.get('posted') === 'true'
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [acceptedBid, setAcceptedBid] = useState<string | null>(null)
  const [invoiceModal, setInvoiceModal] = useState<{ bidId: string; type: 'invoice' | 'agreement' } | null>(null)

  const eventBids = MOCK_BIDS.filter(b => b.event_id === selectedEvent)

  return (
    <>
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Success toast */}
        <AnimatePresence>
          {justPosted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 flex items-center gap-3 bg-success/10 border border-success/25 px-5 py-4"
            >
              <span className="text-success text-xl">✅</span>
              <div>
                <div className="font-semibold text-success text-sm">Event Posted Successfully!</div>
                <p className="text-muted-hep text-xs">Vendors within 5km are being notified via WhatsApp. First bids expected within 2 hours.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionLabel>{isTa ? 'என் நிகழ்வுகள்' : 'My Events'}</SectionLabel>
            <h1 className="font-display text-4xl font-light">{isTa ? 'உங்கள் நிகழ்வுகள்' : 'Your Events'}</h1>
          </div>
          <Link to="/consumer/post">
            <Button icon="➕">{isTa ? 'புதிய நிகழ்வு' : 'New Event'}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Events list */}
          <div className="lg:col-span-2 space-y-3">
            {MOCK_EVENTS.map(event => {
              const typeInfo = EVENT_TYPES.find(e => e.value === event.type)
              const statusInfo = STATUS_BADGE[event.status] || { label: event.status, variant: 'ghost' as const }
              const isSelected = selectedEvent === event.id
              return (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                  className={`glass border transition-all duration-200 p-5 cursor-pointer
                    ${isSelected ? 'border-vivid bg-vivid/8' : 'border-vivid/15 hover:border-vivid/35'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{typeInfo?.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{event.title}</h3>
                        <p className="text-muted-hep text-xs mt-0.5">{isTa ? typeInfo?.labelTa : typeInfo?.label}</p>
                      </div>
                    </div>
                    <Badge variant={statusInfo.variant} dot={event.status === 'open'}>
                      {isTa ? (event.status === 'open' ? 'திறந்திருக்கிறது' : statusInfo.label) : statusInfo.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-[0.7rem] text-muted-hep">
                    <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>👥 {event.guest_count.toLocaleString('en-IN')}</span>
                    <span>💰 ₹{(event.budget_min / 1000).toFixed(0)}k–{(event.budget_max / 1000).toFixed(0)}k</span>
                  </div>
                  {event.bids_count > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(3, event.bids_count) }).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-vivid/30 border border-vivid/50 flex items-center justify-center text-[0.55rem] font-bold">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-vivid font-semibold">
                        {event.bids_count} {isTa ? 'ஏலங்கள்' : 'bids received'}
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Bids panel */}
          <div className="lg:col-span-3">
            {selectedEvent ? (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl font-light">
                    {isTa ? 'ஏலங்கள் ஒப்பீடு' : 'Compare Bids'}
                  </h2>
                  <Badge variant="vivid">{eventBids.length} {isTa ? 'ஏலங்கள்' : 'bids'}</Badge>
                </div>

                {eventBids.length === 0 ? (
                  <div className="glass border-vivid-subtle p-12 text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <h3 className="font-display text-xl font-light mb-2">{isTa ? 'ஏலங்கள் வருகின்றன' : 'Bids incoming'}</h3>
                    <p className="text-muted-hep text-sm">
                      {isTa ? 'உங்கள் பகுதியில் உள்ள சேவையாளர்களுக்கு WhatsApp அறிவிப்பு அனுப்பப்பட்டது.' : 'Vendors in your area have been notified via WhatsApp. Check back soon.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventBids.map((bid) => (
                      <BidCard
                        key={bid.id}
                        bid={bid}
                        isTa={isTa}
                        accepted={acceptedBid === bid.id}
                        onAccept={() => setAcceptedBid(bid.id)}
                        onViewInvoice={() => setInvoiceModal({ bidId: bid.id, type: 'invoice' })}
                        onViewAgreement={() => setInvoiceModal({ bidId: bid.id, type: 'agreement' })}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="glass border-vivid-subtle p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">←</div>
                <h3 className="font-display text-2xl font-light mb-2">{isTa ? 'நிகழ்வை தேர்வு செய்யுங்கள்' : 'Select an event'}</h3>
                <p className="text-muted-hep text-sm">{isTa ? 'ஏலங்களை பார்க்க நிகழ்வை கிளிக் செய்யுங்கள்' : 'Click an event to view and compare incoming bids'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Invoice / Agreement modal */}
    {invoiceModal && (() => {
      const bid = MOCK_BIDS.find(b => b.id === invoiceModal.bidId) ?? MOCK_BIDS[0]
      const event = MOCK_EVENTS.find(e => e.id === bid.event_id) ?? MOCK_EVENTS[0]
      const vendor = MOCK_VENDORS.find(v => v.id === bid.vendor_id) ?? MOCK_VENDORS[0]
      return (
        <InvoiceModal
          open={true}
          onClose={() => setInvoiceModal(null)}
          type={invoiceModal.type}
          bid={bid}
          event={event}
          vendor={vendor}
          consumerName="Priya Sharma"
        />
      )
    })()}
    </>
  )
}

function BidCard({ bid, isTa, accepted, onAccept, onViewInvoice, onViewAgreement }: {
  bid: Bid; isTa: boolean; accepted: boolean; onAccept: () => void
  onViewInvoice: () => void; onViewAgreement: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const vendor = bid.vendor
  const commission = calcCommission(bid.price)
  const advance = Math.round(bid.price * bid.advance_percent / 100)
  const catInfo = VENDOR_CATEGORIES.find(c => c.value === bid.category)

  const fitScore = Math.round(
    (vendor.avg_rating / 5) * 40 +
    (vendor.reliability_score / 100) * 35 +
    Math.min(vendor.total_events / 200, 1) * 25
  )

  return (
    <motion.div
      layout
      className={`glass border transition-all duration-300 overflow-hidden
        ${accepted ? 'border-success' : 'border-vivid/20 hover:border-vivid/40'}`}
    >
      {accepted && (
        <div className="bg-success/10 border-b border-success/25 px-5 py-2.5 flex items-center gap-2">
          <span className="text-success text-sm">✅</span>
          <span className="text-success text-xs font-semibold tracking-wide">{isTa ? 'ஏலம் ஏற்கப்பட்டது — ஒப்பந்தம் உருவாகிறது' : 'Bid Accepted — Agreement being generated'}</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-vivid/20 flex items-center justify-center font-display text-lg font-light flex-shrink-0">
              {vendor.business_name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{vendor.business_name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars value={vendor.avg_rating} showValue />
                <span className="text-muted-hep text-[0.65rem]">({vendor.total_reviews})</span>
                {vendor.is_kyc_verified && <Badge variant="success" className="text-[0.55rem] px-1.5 py-0.5">✓ {isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</Badge>}
              </div>
              <p className="text-muted-hep text-[0.65rem] mt-0.5">{catInfo?.icon} {isTa ? catInfo?.labelTa : catInfo?.label}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-display text-2xl font-light">₹{bid.price.toLocaleString('en-IN')}</div>
            <div className="text-muted-hep text-[0.65rem]">{bid.advance_percent}% {isTa ? 'முன்பணம்' : 'advance'}</div>
          </div>
        </div>

        {/* HE&P Fit Score */}
        <div className="flex items-center gap-3 bg-vivid/8 border border-vivid/15 px-3 py-2 mb-4">
          <div className="font-mono-hep text-vivid font-bold text-lg">{fitScore}</div>
          <div>
            <div className="text-[0.6rem] tracking-[0.15em] uppercase text-vivid font-semibold">HE&P Fit Score</div>
            <div className="text-muted-hep text-[0.6rem]">{isTa ? 'நம்பகத்தன்மை, மதிப்பீடு மற்றும் அனுபவம் அடிப்படையில்' : 'Based on reliability, rating & experience'}</div>
          </div>
          <div className="ml-auto flex gap-2 text-[0.6rem] text-muted-hep">
            <span>{vendor.reliability_score}% {isTa ? 'நம்பகம்' : 'reliable'}</span>
            <span>·</span>
            <span>{vendor.total_events} {isTa ? 'நிகழ்வுகள்' : 'events'}</span>
          </div>
        </div>

        {bid.message && (
          <p className="text-muted-hep text-sm italic border-l-2 border-vivid/30 pl-3 mb-4">"{bid.message}"</p>
        )}

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-vivid/10">
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-sky/50 mb-2">{isTa ? 'இதில் அடங்கியது' : "What's included"}</p>
                  <ul className="space-y-1">
                    {bid.includes.map(item => (
                      <li key={item} className="text-xs text-white/80 flex gap-1.5"><span className="text-success">✓</span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-sky/50 mb-2">{isTa ? 'இதில் அடங்காதது' : "Not included"}</p>
                  <ul className="space-y-1">
                    {bid.excludes.map(item => (
                      <li key={item} className="text-xs text-white/50 flex gap-1.5"><span className="text-error">✗</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-deep/50 border border-white/5 p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-hep">{isTa ? 'சேவை கட்டணம்' : 'Service fee'}</span>
                  <span>₹{bid.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted-hep">
                  <span>HE&P {isTa ? 'தளக் கட்டணம்' : 'platform fee'} ({Math.round(commission / bid.price * 100)}%)</span>
                  <span>₹{commission.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-white/10 pt-1.5 mt-1.5">
                  <span>{isTa ? 'முன்பணம்' : 'Advance due now'}</span>
                  <span className="text-vivid">₹{advance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 flex-wrap">
          {!accepted && (
            <>
              <Button onClick={onAccept} size="sm" className="flex-1">✓ {isTa ? 'ஏலத்தை ஏற்கவும்' : 'Accept Bid'}</Button>
              <Button variant="outline" size="sm">{isTa ? 'எதிர் முன்மொழிவு' : 'Counter'}</Button>
              <Button variant="ghost" size="sm">{isTa ? 'சேமி' : 'Shortlist'}</Button>
            </>
          )}
          {accepted && (
            <>
              <Button onClick={onViewAgreement} size="sm" variant="outline">📋 {isTa ? 'ஒப்பந்தம்' : 'Agreement'}</Button>
              <Button onClick={onViewInvoice} size="sm" variant="outline">📄 {isTa ? 'இன்வாய்ஸ்' : 'Invoice'}</Button>
            </>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="ml-auto text-muted-hep text-xs hover:text-sky transition-colors"
          >
            {expanded ? '▲ Less' : '▼ Details'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
