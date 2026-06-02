import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Bid, Event, VendorProfile } from '@/types'
import { calcCommission } from '@/lib/constants'
import { EVENT_TYPES } from '@/lib/constants'

interface InvoiceModalProps {
  open: boolean
  onClose: () => void
  type: 'invoice' | 'agreement'
  bid: Bid
  event: Event
  vendor: VendorProfile
  consumerName?: string
}

export function InvoiceModal({ open, onClose, type, bid, event, vendor, consumerName = 'Consumer' }: InvoiceModalProps) {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'

  const commission = calcCommission(bid.price)
  const vendorPayout = bid.price - commission
  const gstOnCommission = Math.round(commission * 0.18)
  const advanceAmount = Math.round(bid.price * 0.30)
  const typeInfo = EVENT_TYPES.find(t => t.value === event.type)

  const invoiceNo = `HEP-${new Date(bid.created_at).getFullYear()}-${bid.id.toUpperCase().slice(0, 6)}`
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  function handleDownload() {
    // Stub — in production this triggers a PDF generation API call
    alert('PDF generation coming soon! (PDFKit/react-pdf integration pending API setup)')
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `📄 *HE&P ${type === 'invoice' ? 'Invoice' : 'Agreement'} ${invoiceNo}*\n\nEvent: ${event.title}\nVendor: ${vendor.business_name}\nAmount: ₹${bid.price.toLocaleString('en-IN')}\n\nSecured via HE&P — Harmony Events & Platform`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 overflow-y-auto"
          >
            {/* Document */}
            <div className="bg-[#051C2C] border border-vivid/20 min-h-full">
              {/* Header bar */}
              <div className="bg-vivid/10 border-b border-vivid/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{type === 'invoice' ? '📄' : '📋'}</span>
                  <div>
                    <div className="font-semibold text-sm">
                      {type === 'invoice'
                        ? (isTa ? 'இன்வாய்ஸ்' : 'Tax Invoice')
                        : (isTa ? 'ஒப்பந்தம்' : 'Digital Agreement')}
                    </div>
                    <div className="text-muted-hep text-xs font-mono-hep">{invoiceNo}</div>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
              </div>

              <div className="p-6 space-y-6">
                {/* Document title + branding */}
                <div className="text-center border-b border-white/8 pb-5">
                  <div className="font-display text-2xl font-light mb-1">HE&P</div>
                  <div className="text-muted-hep text-xs tracking-widest uppercase">Harmony Events & Platform</div>
                  <div className="text-muted-hep text-[0.6rem] mt-1">GSTIN: 33AAICH6273M1Z6 · Chennai, TN 600 032</div>
                  <div className="mt-4">
                    <Badge variant={type === 'invoice' ? 'vivid' : 'sky'}>
                      {type === 'invoice' ? 'GST Tax Invoice' : 'Service Agreement'}
                    </Badge>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-2">
                      {isTa ? 'பெறுநர்' : 'Billed To'}
                    </div>
                    <div className="text-sm font-semibold">{consumerName}</div>
                    <div className="text-muted-hep text-xs">{isTa ? 'நிகழ்வு ஏற்பாட்டாளர்' : 'Event Organiser'}</div>
                  </div>
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-2">
                      {isTa ? 'சேவை வழங்குநர்' : 'Service Provider'}
                    </div>
                    <div className="text-sm font-semibold">{vendor.business_name}</div>
                    <div className="text-muted-hep text-xs">{vendor.city}</div>
                    {vendor.gstin && <div className="text-muted-hep text-[0.6rem] font-mono-hep mt-0.5">GSTIN: {vendor.gstin}</div>}
                  </div>
                </div>

                {/* Event details */}
                <div className="bg-white/3 border border-white/8 p-4">
                  <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-3">
                    {isTa ? 'நிகழ்வு விவரங்கள்' : 'Event Details'}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: isTa ? 'நிகழ்வு' : 'Event', value: event.title },
                      { label: isTa ? 'வகை' : 'Type', value: `${typeInfo?.icon} ${typeInfo?.label}` },
                      { label: isTa ? 'தேதி' : 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                      { label: isTa ? 'விருந்தினர்கள்' : 'Guests', value: event.guest_count.toString() },
                      { label: isTa ? 'இடம்' : 'Venue', value: event.venue_address.split(',').slice(-2).join(',').trim() },
                      { label: isTa ? 'இன்வாய்ஸ் தேதி' : 'Invoice Date', value: today },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="text-muted-hep text-[0.58rem] uppercase tracking-wide mb-0.5">{item.label}</div>
                        <div className="text-xs text-white/80">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line items */}
                <div>
                  <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-3">
                    {isTa ? 'சேவைகள்' : 'Services'}
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-hep">
                        <th className="text-left pb-2 font-normal">{isTa ? 'விவரம்' : 'Description'}</th>
                        <th className="text-right pb-2 font-normal">{isTa ? 'தொகை' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-2.5 text-white/80">
                          {vendor.business_name} — {bid.category.charAt(0).toUpperCase() + bid.category.slice(1).replace(/_/g, ' ')}
                          <div className="text-muted-hep text-[0.6rem] mt-0.5">As per accepted bid {bid.id}</div>
                        </td>
                        <td className="py-2.5 text-right font-mono-hep">₹{bid.price.toLocaleString('en-IN')}</td>
                      </tr>
                      {vendor.is_kyc_verified && (
                        <tr>
                          <td className="py-2 text-muted-hep">GST @ 18% (if applicable by vendor)</td>
                          <td className="py-2 text-right font-mono-hep text-muted-hep">As per vendor invoice</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-vivid/20">
                        <td className="pt-3 font-semibold">{isTa ? 'மொத்தம்' : 'Total'}</td>
                        <td className="pt-3 text-right font-mono-hep font-semibold text-vivid text-sm">₹{bid.price.toLocaleString('en-IN')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Payment schedule */}
                <div className="bg-white/3 border border-white/8 p-4 space-y-2">
                  <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-2">
                    {isTa ? 'கொடுப்பனவு அட்டவணை' : 'Payment Schedule'}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{isTa ? 'முன்பணம் (30%) — இப்போது' : 'Advance (30%) — Due now'}</span>
                    <span className="font-mono-hep text-success">₹{advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{isTa ? 'பாக்கி — நிகழ்வு நாளில்' : 'Balance — Due on event day'}</span>
                    <span className="font-mono-hep">₹{(bid.price - advanceAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-white/8 pt-2 text-[0.62rem] text-muted-hep space-y-1">
                    <div className="flex justify-between">
                      <span>HE&P platform fee ({commission === Math.round(bid.price * 0.12) ? '12' : commission === Math.round(bid.price * 0.10) ? '10' : '8'}%)</span>
                      <span className="font-mono-hep">₹{commission.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST on platform fee (18%)</span>
                      <span className="font-mono-hep">₹{gstOnCommission.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>{isTa ? 'சேவையாளர் நிகர கட்டணம்' : 'Vendor net payout (T+2 post-event)'}</span>
                      <span className="font-mono-hep">₹{vendorPayout.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {type === 'agreement' && (
                  <div className="bg-warn/5 border border-warn/20 p-4 space-y-3">
                    <div className="text-[0.6rem] uppercase tracking-widest text-warn mb-1">
                      {isTa ? 'ரத்து கொள்கை' : 'Cancellation Policy'}
                    </div>
                    {[
                      ['> 30 days before event', '80% refund to consumer'],
                      ['15–30 days', '50% refund'],
                      ['7–15 days', '25% refund'],
                      ['< 7 days', 'No refund (vendor retains advance)'],
                      ['Vendor cancels < 48 hrs', 'Full refund + security deposit forfeited by vendor'],
                    ].map(([cond, outcome]) => (
                      <div key={cond} className="flex justify-between text-[0.68rem]">
                        <span className="text-white/60">{cond}</span>
                        <span className="text-white/80">{outcome}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Signatures area (agreement only) */}
                {type === 'agreement' && (
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: isTa ? 'நிகழ்வு ஏற்பாட்டாளர்' : 'Consumer', name: consumerName },
                      { label: isTa ? 'சேவை வழங்குநர்' : 'Vendor', name: vendor.business_name },
                    ].map(party => (
                      <div key={party.label} className="border-t border-white/15 pt-3">
                        <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-2">{party.label}</div>
                        <div className="h-10 flex items-end">
                          <div className="font-display text-lg text-vivid/60 italic">{party.name}</div>
                        </div>
                        <div className="text-[0.58rem] text-muted-hep mt-1">{isTa ? 'OTP மூலம் கையொப்பமிடப்பட்டது' : 'Signed via OTP confirmation'} · {today}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer note */}
                <div className="text-center text-[0.58rem] text-muted-hep border-t border-white/8 pt-4">
                  {isTa
                    ? 'இந்த ஆவணம் HE&P இயங்குதளத்தால் தானாக உருவாக்கப்பட்டது. Razorpay மூலம் பணப்பரிவர்த்தனை நடைபெறுகிறது (RBI PA License).'
                    : 'This document was auto-generated by HE&P. All payments are processed by Razorpay (RBI-licensed PA). This is a system-generated document.'}
                </div>
              </div>

              {/* Action bar */}
              <div className="sticky bottom-0 bg-[#051C2C] border-t border-vivid/15 px-6 py-4 flex gap-3">
                <Button onClick={handleDownload} variant="outline" size="sm" className="flex items-center gap-2">
                  ⬇ {isTa ? 'PDF பதிவிறக்கம்' : 'Download PDF'}
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" size="sm" className="flex items-center gap-2">
                  📲 {isTa ? 'WhatsApp-ல் பகிர்' : 'Share via WhatsApp'}
                </Button>
                <Button onClick={onClose} size="sm" className="ml-auto">
                  {isTa ? 'மூடு' : 'Close'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
