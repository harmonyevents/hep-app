import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Stars } from '@/components/ui/Stars'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MOCK_VENDORS, MOCK_EVENTS, MOCK_BIDS } from '@/lib/mock-data'
import { EVENT_TYPES } from '@/lib/constants'

const stagger: Variants = { visible: { transition: { staggerChildren: 0.06 } } }
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

type AdminTab = 'overview' | 'vendors' | 'events' | 'kyc'

export function AdminDashboardPage() {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [approvedVendors, setApprovedVendors] = useState<string[]>([])

  const kycQueue = MOCK_VENDORS.filter(v => !v.is_kyc_verified)
  const totalCommission = MOCK_BIDS.reduce((s, b) => s + Math.round(b.price * 0.1), 0)

  const TABS: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'vendors', label: 'Vendors', icon: '🛠️' },
    { key: 'events', label: 'Events', icon: '🎉' },
    { key: 'kyc', label: 'KYC Queue', icon: '🔍' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <SectionLabel>Admin</SectionLabel>
          <h1 className="font-display text-5xl font-light">HE&P Control Centre</h1>
          <p className="text-muted-hep text-sm mt-1">Platform intelligence for Harmony Events & Platform</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border border-vivid/15 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-[0.68rem] tracking-[0.12em] uppercase font-semibold whitespace-nowrap transition-all
                ${tab === t.key ? 'bg-vivid text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <div className="ml-auto flex items-center px-4">
            <Badge variant="success" dot>Live</Badge>
          </div>
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { label: 'Total Events', value: MOCK_EVENTS.length.toString(), sub: 'All time', icon: '🎉', color: '' },
                { label: 'Active Vendors', value: MOCK_VENDORS.length.toString(), sub: 'On platform', icon: '🛠️', color: 'text-vivid' },
                { label: 'Commission Earned', value: `₹${(totalCommission / 1000).toFixed(1)}k`, sub: 'From bids', icon: '💰', color: 'text-success' },
                { label: 'KYC Pending', value: kycQueue.length.toString(), sub: 'Needs review', icon: '⏳', color: 'text-warn' },
              ].map(s => (
                <motion.div key={s.label} variants={fadeUp}>
                  <Card className="p-5">
                    <div className="text-2xl mb-3">{s.icon}</div>
                    <div className={`font-display text-4xl font-light mb-1 ${s.color}`}>{s.value}</div>
                    <div className="text-muted-hep text-xs uppercase tracking-wide">{s.label}</div>
                    <div className="text-muted-hep text-[0.6rem] mt-0.5">{s.sub}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Commission breakdown */}
            <Card className="p-6">
              <h3 className="font-display text-xl font-light mb-5">Commission Tiers Active</h3>
              <div className="space-y-3">
                {[
                  { label: 'Small events (up to ₹25k)', rate: '12%', count: 3, volume: '₹45k' },
                  { label: 'Mid events (₹25k–₹1L)', rate: '10%', count: 1, volume: '₹65k' },
                  { label: 'Large events (₹1L–₹5L)', rate: '8%', count: 0, volume: '₹0' },
                ].map(tier => (
                  <div key={tier.label} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/70">{tier.label}</span>
                        <span className="font-mono-hep text-vivid text-sm">{tier.rate}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5">
                        <div
                          className="h-full bg-vivid"
                          style={{ width: `${tier.count * 25}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-white/60">{tier.count} events</div>
                      <div className="text-muted-hep">{tier.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent activity */}
            <div>
              <h3 className="font-display text-xl font-light mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { icon: '🎉', text: 'New event posted: Priya & Karthik Wedding (budget ₹5L–₹12L)', time: '2 hours ago', type: 'event' },
                  { icon: '⚡', text: 'Bid submitted by Sree Caterers on evt-1 (₹2.1L)', time: '1.5 hours ago', type: 'bid' },
                  { icon: '🛠️', text: 'New vendor signup: Pixel Perfect Studios (awaiting KYC)', time: '3 hours ago', type: 'vendor' },
                  { icon: '💰', text: 'Payment received: ₹25,000 advance from consumer-2', time: '5 hours ago', type: 'payment' },
                ].map((a, i) => (
                  <div key={i} className="glass border-vivid-subtle p-4 flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <p className="text-sm text-white/70 flex-1">{a.text}</p>
                    <span className="text-muted-hep text-[0.65rem] flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VENDORS */}
        {tab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-light">All Vendors ({MOCK_VENDORS.length})</h2>
              <Button size="sm" variant="outline">Export CSV</Button>
            </div>
            {MOCK_VENDORS.map(vendor => (
              <motion.div
                key={vendor.id}
                whileHover={{ x: 2 }}
                className="glass border-vivid-subtle p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-vivid/20 rounded-full flex items-center justify-center font-display text-lg">
                    {vendor.business_name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{vendor.business_name}</div>
                    <div className="text-muted-hep text-xs">{vendor.city} · {vendor.service_radius_km}km radius</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stars value={vendor.avg_rating} showValue />
                  <span className="text-muted-hep text-xs">({vendor.total_reviews})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.is_kyc_verified
                    ? <Badge variant="success" dot>Verified</Badge>
                    : <Badge variant="warn">KYC Pending</Badge>
                  }
                  <Badge variant={vendor.subscription_tier === 'pro' ? 'vivid' : 'sky'}>
                    {vendor.subscription_tier.toUpperCase()}
                  </Badge>
                  {vendor.is_backup_pool && <Badge variant="ghost">Backup Pool</Badge>}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost">View Profile</Button>
                  <Button size="sm" variant="outline">Contact</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* EVENTS */}
        {tab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-light">All Events ({MOCK_EVENTS.length})</h2>
              <Button size="sm" variant="outline">Export CSV</Button>
            </div>
            {MOCK_EVENTS.map(event => {
              const typeInfo = EVENT_TYPES.find(t => t.value === event.type)
              return (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 2 }}
                  className="glass border-vivid-subtle p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{typeInfo?.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{event.title}</div>
                      <div className="text-muted-hep text-xs">{event.venue_address.split(',').slice(-2).join(', ').trim()}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="text-muted-hep text-xs">{event.guest_count} guests</div>
                  </div>
                  <div>
                    <div className="text-vivid font-semibold text-sm">₹{(event.budget_min / 1000).toFixed(0)}k – ₹{(event.budget_max / 1000).toFixed(0)}k</div>
                    <div className="text-muted-hep text-xs">{event.bids_count} bids</div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Badge variant={event.status === 'open' ? 'vivid' : event.status === 'confirmed' ? 'success' : 'ghost'} dot={event.status === 'open'}>
                      {event.status}
                    </Badge>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* KYC QUEUE */}
        {tab === 'kyc' && (
          <div className="space-y-4">
            <div className="mb-2">
              <h2 className="font-display text-2xl font-light mb-1">KYC Approval Queue</h2>
              <p className="text-muted-hep text-sm">Review vendor identity documents before they go live on the platform.</p>
            </div>
            {kycQueue.length === 0 ? (
              <div className="glass border-vivid-subtle p-12 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-display text-xl font-light">All caught up!</h3>
                <p className="text-muted-hep text-sm mt-2">No pending KYC reviews.</p>
              </div>
            ) : (
              kycQueue.map(vendor => (
                <div key={vendor.id} className="glass border-vivid-subtle p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-warn/10 border border-warn/25 rounded-full flex items-center justify-center font-display text-2xl">
                        {vendor.business_name[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{vendor.business_name}</div>
                        <div className="text-muted-hep text-sm">{vendor.address} · {vendor.city}</div>
                        <div className="text-muted-hep text-xs mt-0.5">Joined: {new Date(vendor.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                    <Badge variant="warn">Pending Review</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                    {[
                      { label: 'PAN', value: vendor.pan || 'Not provided' },
                      { label: 'GSTIN', value: vendor.gstin || 'Not provided' },
                      { label: 'Service Radius', value: `${vendor.service_radius_km} km` },
                      { label: 'Categories', value: vendor.categories.length.toString() },
                    ].map(item => (
                      <div key={item.label} className="bg-mid/30 border border-white/5 p-3">
                        <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-1">{item.label}</div>
                        <div className="font-semibold text-sm font-mono-hep">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setApprovedVendors(prev => [...prev, vendor.id])}
                      disabled={approvedVendors.includes(vendor.id)}
                      className="flex-1"
                    >
                      {approvedVendors.includes(vendor.id) ? '✅ Approved' : '✓ Approve Vendor'}
                    </Button>
                    <Button variant="outline" className="flex-1">Request Documents</Button>
                    <Button variant="danger" className="flex-none">Reject</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
