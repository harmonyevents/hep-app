import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MOCK_EVENTS, MOCK_BIDS, MOCK_VENDORS } from '@/lib/mock-data'
import { calcCommission } from '@/lib/constants'
import { EVENT_TYPES } from '@/lib/constants'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

type PayStep = 'review' | 'method' | 'processing' | 'success'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'PhonePe, GPay, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'emi', label: 'EMI', icon: '📆', desc: 'No-cost EMI on select cards' },
]

export function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'

  const [step, setStep] = useState<PayStep>('review')
  const [selectedMethod, setSelectedMethod] = useState<string>('upi')
  const [upiId, setUpiId] = useState('')
  const [upiError, setUpiError] = useState('')

  // Derive payment context from mock data
  // bookingId is assumed to be a bid id for demo
  const bid = MOCK_BIDS.find(b => b.id === bookingId) ?? MOCK_BIDS[0]
  const event = MOCK_EVENTS.find(e => e.id === bid.event_id) ?? MOCK_EVENTS[0]
  const vendor = MOCK_VENDORS.find(v => v.id === bid.vendor_id) ?? MOCK_VENDORS[0]
  const typeInfo = EVENT_TYPES.find(t => t.value === event.type)

  const commission = calcCommission(bid.price)
  const vendorPayout = bid.price - commission
  const advancePct = 0.30
  const advanceAmount = Math.round(bid.price * advancePct)
  const gstOnCommission = Math.round(commission * 0.18)
  const totalCharged = advanceAmount // consumer pays advance; final at event

  function handlePay() {
    if (selectedMethod === 'upi' && !upiId.trim()) {
      setUpiError('Please enter a valid UPI ID')
      return
    }
    setUpiError('')
    setStep('processing')
    // Simulate Razorpay processing
    setTimeout(() => setStep('success'), 2800)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <SectionLabel>{isTa ? 'கொடுப்பனவு' : 'Payment'}</SectionLabel>
          <h1 className="font-display text-4xl font-light">
            {isTa ? 'முன்பணம் செலுத்துங்கள்' : 'Advance Payment'}
          </h1>
          <p className="text-muted-hep text-sm mt-1">
            {isTa
              ? 'Razorpay மூலம் பாதுகாப்பான கொடுப்பனவு — RBI அங்கீகரிக்கப்பட்ட PA'
              : 'Secured via Razorpay — RBI-licensed Payment Aggregator'}
          </p>
        </div>

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-0 mb-8 border border-vivid/15 overflow-hidden">
            {(['review', 'method', 'processing'] as PayStep[]).map((s, i) => {
              const labels = ['Review', 'Pay', 'Processing']
              const labelsTa = ['விவரங்கள்', 'கொடுப்பனவு', 'செயலாக்கம்']
              const active = s === step
              const done = (['review', 'method', 'processing'] as PayStep[]).indexOf(step) > i
              return (
                <div
                  key={s}
                  className={`flex-1 py-2.5 text-center text-[0.65rem] uppercase tracking-widest font-semibold transition-all
                    ${active ? 'bg-vivid text-white' : done ? 'bg-vivid/20 text-vivid' : 'text-white/30'}`}
                >
                  {done ? '✓ ' : ''}{isTa ? labelsTa[i] : labels[i]}
                </div>
              )
            })}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: Review */}
          {step === 'review' && (
            <motion.div key="review" variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
              {/* Event + Bid summary */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{typeInfo?.icon}</span>
                  <div>
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-muted-hep text-xs">
                      {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {event.guest_count} guests
                    </div>
                  </div>
                  <Badge variant="vivid" dot className="ml-auto">{isTa ? 'ஏல ஏற்பு' : 'Bid Accepted'}</Badge>
                </div>

                <div className="border-t border-white/8 pt-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-vivid/15 flex items-center justify-center font-display text-base">
                      {vendor.business_name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{vendor.business_name}</div>
                      <div className="text-muted-hep text-xs">{vendor.city} · KYC Verified</div>
                    </div>
                    <Badge variant="success" dot className="ml-auto">{isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</Badge>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">{isTa ? 'ஒப்புக்கொண்ட விலை' : 'Agreed price'}</span>
                    <span className="font-mono-hep">₹{bid.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>{isTa ? 'இப்போது செலுத்தவும் (30% முன்பணம்)' : 'Pay now (30% advance)'}</span>
                    <span className="font-mono-hep font-semibold">₹{advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-hep">
                    <span>{isTa ? 'நிகழ்வு நாளில் பாக்கி' : 'Balance on event day'}</span>
                    <span className="font-mono-hep">₹{(bid.price - advanceAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-white/8 pt-2 mt-2 space-y-1 text-[0.68rem] text-muted-hep">
                    <div className="flex justify-between">
                      <span>HE&P {isTa ? 'கட்டணம்' : 'platform fee'} (deducted from vendor)</span>
                      <span className="font-mono-hep">₹{commission.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST on platform fee (18%)</span>
                      <span className="font-mono-hep">₹{gstOnCommission.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>{isTa ? 'சேவையாளருக்கு கிடைக்கும்' : 'Vendor payout (post-event)'}</span>
                      <span className="font-mono-hep">₹{vendorPayout.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* HE&P Guarantee */}
              <div className="glass border-vivid-subtle p-4 flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">🛡️</span>
                <div>
                  <div className="text-sm font-semibold mb-1">
                    {isTa ? 'HE&P உத்தரவாதம்' : 'HE&P Payment Guarantee'}
                  </div>
                  <p className="text-muted-hep text-xs">
                    {isTa
                      ? 'உங்கள் பணம் Razorpay-ல் பாதுகாப்பாக உள்ளது. நிகழ்வு முடிந்த பிறகுதான் சேவையாளருக்கு வழங்கப்படும். சேவையாளர் ரத்து செய்தால் முழு திரும்ப வழங்கல் கிடைக்கும்.'
                      : "Your money is held securely by Razorpay (RBI-licensed PA). It is only released to the vendor after you confirm event completion. If the vendor cancels, you receive a full refund automatically."}
                  </p>
                </div>
              </div>

              {/* Cancellation policy */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-3">
                  {isTa ? 'ரத்து கொள்கை' : 'Cancellation Policy'}
                </h3>
                <div className="space-y-2">
                  {[
                    { days: '> 30 days', refund: '80% refund', color: 'text-success' },
                    { days: '15–30 days', refund: '50% refund', color: 'text-vivid' },
                    { days: '7–15 days', refund: '25% refund', color: 'text-warn' },
                    { days: '< 7 days', refund: 'No refund', color: 'text-error' },
                  ].map(row => (
                    <div key={row.days} className="flex justify-between text-xs">
                      <span className="text-white/60">{row.days} before event</span>
                      <span className={`font-semibold ${row.color}`}>{row.refund}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Button onClick={() => setStep('method')} className="w-full" size="lg">
                {isTa ? 'கொடுப்பனவு முறையை தேர்வு செய்யவும்' : `Proceed to Pay ₹${advanceAmount.toLocaleString('en-IN')}`}
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Payment method */}
          {step === 'method' && (
            <motion.div key="method" variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
              <Card className="p-4 flex items-center justify-between">
                <span className="text-muted-hep text-sm">{isTa ? 'செலுத்த வேண்டிய தொகை' : 'Amount to pay'}</span>
                <span className="font-display text-2xl font-light text-vivid">₹{advanceAmount.toLocaleString('en-IN')}</span>
              </Card>

              <div className="space-y-2">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedMethod(pm.id)}
                    className={`w-full text-left glass border p-4 flex items-center gap-4 transition-all
                      ${selectedMethod === pm.id ? 'border-vivid/60 bg-vivid/8' : 'border-white/8 hover:border-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all
                      ${selectedMethod === pm.id ? 'border-vivid bg-vivid' : 'border-white/30'}`}
                    />
                    <span className="text-xl">{pm.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{pm.label}</div>
                      <div className="text-muted-hep text-xs">{pm.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedMethod === 'upi' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass border-vivid-subtle p-4">
                  <label className="block text-xs text-muted-hep uppercase tracking-widest mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => { setUpiId(e.target.value); setUpiError('') }}
                    placeholder="yourname@okaxis"
                    className="w-full bg-transparent border border-white/15 px-3 py-2.5 text-sm font-mono-hep focus:outline-none focus:border-vivid/60 transition-colors"
                  />
                  {upiError && <p className="text-error text-xs mt-1">{upiError}</p>}
                </motion.div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('review')} className="flex-none">
                  ← {isTa ? 'திரும்பு' : 'Back'}
                </Button>
                <Button onClick={handlePay} className="flex-1">
                  {isTa ? 'கொடுப்பனவு செய்யுங்கள்' : `Pay ₹${advanceAmount.toLocaleString('en-IN')}`}
                </Button>
              </div>

              <p className="text-center text-muted-hep text-[0.62rem]">
                🔒 {isTa ? '256-bit SSL குறியாக்கம் மூலம் பாதுகாக்கப்பட்டது' : 'Secured with 256-bit SSL encryption via Razorpay'}
              </p>
            </motion.div>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <motion.div key="processing" variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 border-2 border-vivid border-t-transparent rounded-full"
              />
              <div className="text-center">
                <p className="font-display text-xl font-light mb-1">
                  {isTa ? 'செயலாக்கப்படுகிறது...' : 'Processing payment...'}
                </p>
                <p className="text-muted-hep text-sm">
                  {isTa ? 'Razorpay-யிடம் பாதுகாப்பாக அனுப்புகிறோம்' : 'Securely processing via Razorpay'}
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && (
            <motion.div key="success" variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-success/15 border border-success/40 flex items-center justify-center text-4xl mx-auto mb-6"
                >
                  ✅
                </motion.div>
                <h2 className="font-display text-3xl font-light mb-2">
                  {isTa ? 'கொடுப்பனவு வெற்றிகரமாக!' : 'Payment Successful!'}
                </h2>
                <p className="text-muted-hep text-sm">
                  {isTa
                    ? `₹${advanceAmount.toLocaleString('en-IN')} முன்பணம் பெறப்பட்டது`
                    : `₹${advanceAmount.toLocaleString('en-IN')} advance received`}
                </p>
              </div>

              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-sm mb-1">{isTa ? 'என்ன நடக்கும்?' : "What happens next?"}</h3>
                {[
                  { icon: '📲', text: isTa ? 'WhatsApp-ல் ரசீது அனுப்பப்படும்' : 'Receipt sent to your WhatsApp & email' },
                  { icon: '📄', text: isTa ? 'ஒப்பந்தம் தயாரிக்கப்படுகிறது' : 'Digital agreement being generated (OTP sign required)' },
                  { icon: '🛠️', text: isTa ? 'சேவையாளர் தயாரிப்பு தொடங்குகிறார்' : `${vendor.business_name} is notified and begins preparation` },
                  { icon: '💰', text: isTa ? 'நிகழ்வு முடிந்த பிறகு சேவையாளருக்கு பணம் வழங்கப்படும்' : 'Vendor payout released T+2 after you confirm event completion' },
                ].map(item => (
                  <div key={item.icon} className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <p className="text-sm text-white/70">{item.text}</p>
                  </div>
                ))}
              </Card>

              {/* Payment reference */}
              <div className="glass border-vivid-subtle p-4 flex items-center justify-between">
                <div>
                  <div className="text-[0.6rem] uppercase tracking-widest text-muted-hep mb-0.5">Transaction ID</div>
                  <div className="font-mono-hep text-sm">HEP-{Date.now().toString(36).toUpperCase()}</div>
                </div>
                <Badge variant="success" dot>Confirmed</Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/consumer/events')}
                  className="flex-1"
                >
                  {isTa ? 'நிகழ்வுகளுக்கு திரும்பு' : 'View My Events'}
                </Button>
                <Button
                  onClick={() => navigate('/consumer/dashboard')}
                  className="flex-1"
                >
                  {isTa ? 'டாஷ்போர்டு' : 'Dashboard'}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
