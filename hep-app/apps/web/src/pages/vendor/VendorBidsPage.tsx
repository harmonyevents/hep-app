import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Stars } from '@/components/ui/Stars'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { InvoiceModal } from '@/components/InvoiceModal'
import { MOCK_BIDS, MOCK_EVENTS, MOCK_VENDORS } from '@/lib/mock-data'
import { VENDOR_CATEGORIES, calcCommission } from '@/lib/constants'
import type { BidStatus } from '@/types'

type TabFilter = 'all' | 'pending' | 'accepted' | 'declined'

const STATUS_CONFIG: Record<BidStatus, { label: string; labelTa: string; variant: 'vivid' | 'success' | 'warn' | 'error' | 'sky' | 'ghost' }> = {
  pending: { label: 'Awaiting Response', labelTa: 'பதில் காத்திருக்கிறது', variant: 'warn' },
  accepted: { label: 'Accepted', labelTa: 'ஏற்கப்பட்டது', variant: 'success' },
  declined: { label: 'Declined', labelTa: 'நிராகரிக்கப்பட்டது', variant: 'error' },
  counter: { label: 'Counter Offer', labelTa: 'எதிர் முன்மொழிவு', variant: 'sky' },
  withdrawn: { label: 'Withdrawn', labelTa: 'திரும்பப் பெறப்பட்டது', variant: 'ghost' },
  expired: { label: 'Expired', labelTa: 'காலாவதி', variant: 'ghost' },
}

export function VendorBidsPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [invoiceModal, setInvoiceModal] = useState<{ bidId: string; type: 'invoice' | 'agreement' } | null>(null)

  const allBids = MOCK_BIDS
  const filtered = activeTab === 'all' ? allBids : allBids.filter(b => b.status === activeTab)

  const stats = {
    total: allBids.length,
    pending: allBids.filter(b => b.status === 'pending').length,
    accepted: allBids.filter(b => b.status === 'accepted').length,
    totalValue: allBids.filter(b => b.status === 'accepted').reduce((s, b) => s + b.price, 0),
  }

  const tabs: { key: TabFilter; label: string; labelTa: string; count: number }[] = [
    { key: 'all', label: 'All', labelTa: 'அனைத்தும்', count: stats.total },
    { key: 'pending', label: 'Pending', labelTa: 'காத்திருக்கிறது', count: stats.pending },
    { key: 'accepted', label: 'Accepted', labelTa: 'ஏற்கப்பட்டது', count: stats.accepted },
    { key: 'declined', label: 'Declined', labelTa: 'நிராகரிக்கப்பட்டது', count: 0 },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <SectionLabel>{isTa ? 'என் ஏலங்கள்' : 'My Bids'}</SectionLabel>
          <h1 className="font-display text-5xl font-light">{isTa ? 'ஏல நிலைகள்' : 'Bid Tracker'}</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: isTa ? 'மொத்த ஏலங்கள்' : 'Total Bids', value: stats.total, color: '' },
            { label: isTa ? 'காத்திருக்கிறது' : 'Awaiting', value: stats.pending, color: 'text-warn' },
            { label: isTa ? 'ஏற்கப்பட்டது' : 'Accepted', value: stats.accepted, color: 'text-success' },
            { label: isTa ? 'ஏற்றுக்கொள்ளப்பட்ட மதிப்பு' : 'Accepted Value', value: `₹${(stats.totalValue / 1000).toFixed(0)}k`, color: 'text-vivid' },
          ].map(s => (
            <Card key={s.label} className="p-4">
              <div className={`font-display text-3xl font-light mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-muted-hep text-[0.65rem] tracking-wide uppercase">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border border-vivid/15 mb-6 overflow-hidden">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-[0.65rem] tracking-[0.12em] uppercase font-semibold flex items-center justify-center gap-1.5 transition-all
                ${activeTab === tab.key ? 'bg-vivid text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {isTa ? tab.labelTa : tab.label}
              {tab.count > 0 && (
                <span className={`text-[0.55rem] px-1.5 py-0.5 rounded-full font-mono-hep
                  ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bid list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass border-vivid-subtle p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="font-display text-xl font-light">{isTa ? 'ஏலங்கள் இல்லை' : 'No bids yet'}</h3>
              <p className="text-muted-hep text-sm mt-2">
                {isTa ? 'நிகழ்வுகள் தேட "நிகழ்வுகளை காண்க" பக்கத்திற்கு செல்லவும்' : 'Head to Browse Events to find events and submit bids'}
              </p>
            </div>
          ) : (
            filtered.map(bid => {
              const event = MOCK_EVENTS.find(e => e.id === bid.event_id)
              const catInfo = VENDOR_CATEGORIES.find(c => c.value === bid.category)
              const statusCfg = STATUS_CONFIG[bid.status]
              const commission = calcCommission(bid.price)
              const payout = bid.price - commission

              return (
                <motion.div
                  key={bid.id}
                  whileHover={{ x: 2 }}
                  className="glass border-vivid-subtle p-5 hover:border-vivid/35 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">{event?.title || 'Event'}</h3>
                      <div className="flex items-center gap-2 text-muted-hep text-[0.65rem]">
                        <span>{catInfo?.icon} {isTa ? catInfo?.labelTa : catInfo?.label}</span>
                        <span>·</span>
                        <span>📅 {event ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                        <span>·</span>
                        <span>📍 {event?.venue_address.split(',').slice(-2).join(',').trim()}</span>
                      </div>
                    </div>
                    <Badge variant={statusCfg.variant}>
                      {isTa ? statusCfg.labelTa : statusCfg.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-mid/40 border border-white/5 p-3">
                      <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-1">{isTa ? 'உங்கள் ஏலம்' : 'Your Bid'}</div>
                      <div className="font-display text-xl font-light">₹{bid.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="bg-mid/40 border border-white/5 p-3">
                      <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-1">HE&P {isTa ? 'கட்டணம்' : 'Fee'}</div>
                      <div className="font-display text-xl font-light text-warn">- ₹{commission.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="bg-mid/40 border border-white/5 p-3">
                      <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-1">{isTa ? 'உங்களுக்கு கிடைக்கும்' : 'Your Payout'}</div>
                      <div className="font-display text-xl font-light text-success">₹{payout.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[0.65rem] text-muted-hep">
                    <span>{isTa ? 'சமர்ப்பிக்கப்பட்டது' : 'Submitted'}: {new Date(bid.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span>{isTa ? 'முடிவு' : 'Expires'}: {new Date(bid.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    {bid.status === 'pending' && (
                      <Button variant="ghost" size="sm" className="text-error hover:text-error">
                        {isTa ? 'திரும்பப் பெறு' : 'Withdraw'}
                      </Button>
                    )}
                    {bid.status === 'counter' && (
                      <div className="flex gap-2">
                        <Button size="sm">{isTa ? 'ஏற்கவும்' : 'Accept Counter'}</Button>
                        <Button variant="outline" size="sm">{isTa ? 'மறுக்கவும்' : 'Decline'}</Button>
                      </div>
                    )}
                    {bid.status === 'accepted' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setInvoiceModal({ bidId: bid.id, type: 'invoice' })}>
                          📄 {isTa ? 'இன்வாய்ஸ்' : 'Invoice'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setInvoiceModal({ bidId: bid.id, type: 'agreement' })}>
                          📋 {isTa ? 'ஒப்பந்தம்' : 'Agreement'}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
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
    </div>
  )
}
