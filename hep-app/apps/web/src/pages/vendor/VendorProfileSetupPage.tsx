import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { VENDOR_CATEGORIES } from '@/lib/constants'
import type { VendorCategory } from '@/types'

const STEPS = [
  { id: 'basics', title: 'Business Info', titleTa: 'வணிக தகவல்' },
  { id: 'categories', title: 'Services', titleTa: 'சேவைகள்' },
  { id: 'coverage', title: 'Service Area', titleTa: 'சேவை பகுதி' },
  { id: 'packages', title: 'Packages', titleTa: 'சேவை தொகுப்புகள்' },
  { id: 'kyc', title: 'Verify', titleTa: 'சரிபார்ப்பு' },
]

interface PackageDraft {
  name: string
  description: string
  price: string
  includes: string
}

export function VendorProfileSetupPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [tagline, setTagline] = useState('')
  const [about, setAbout] = useState('')
  const [gstin, setGstin] = useState('')
  const [pan, setPan] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<VendorCategory[]>([])
  const [radiusKm, setRadiusKm] = useState(10)
  const [city, setCity] = useState('Chennai')
  const [address, setAddress] = useState('')
  const [packages, setPackages] = useState<PackageDraft[]>([{ name: '', description: '', price: '', includes: '' }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleCat = (cat: VendorCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const addPackage = () => setPackages(prev => [...prev, { name: '', description: '', price: '', includes: '' }])

  const updatePackage = (idx: number, field: keyof PackageDraft, val: string) => {
    setPackages(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p))
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setIsSubmitting(false)
    navigate('/vendor/dashboard')
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <SectionLabel>{isTa ? 'சுயவிவரம் உருவாக்கு' : 'Create Your Profile'}</SectionLabel>
          <h1 className="font-display text-5xl font-light mb-2">
            {isTa ? 'சேவையாளராக' : 'List your'}
            <br />
            <em className="text-vivid not-italic">{isTa ? 'பட்டியலிடுக.' : 'business.'}</em>
          </h1>
          <p className="text-muted-hep text-sm">
            {isTa
              ? 'உங்கள் சேவை விவரங்களை உள்ளிடுங்கள். நிகழ்வு ஏற்பாட்டாளர்கள் உங்களை கண்டுபிடித்து ஏலம் கேட்பார்கள்.'
              : 'Fill in your service details. Event organizers in your area will discover and bid on your services.'}
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex mb-8 border border-vivid/15 overflow-hidden">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < step && setStep(i)}
              className={`flex-1 py-2.5 text-center text-[0.6rem] tracking-[0.15em] uppercase font-semibold transition-all
                ${i === step ? 'bg-vivid text-white' : i < step ? 'bg-vivid/15 text-vivid cursor-pointer hover:bg-vivid/25' : 'text-white/25 cursor-default'}`}
            >
              <span className="font-mono-hep mr-1">0{i + 1}</span>
              <span className="hidden sm:inline">{isTa ? s.titleTa : s.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 0: BUSINESS BASICS */}
          {step === 0 && (
            <motion.div key="basics" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="glass border-vivid-subtle p-6 space-y-5 mb-6">
                <Input
                  label={isTa ? 'வணிக பெயர்' : 'Business Name'}
                  placeholder={isTa ? 'எ.கா: Sree Caterers, Studio XYZ' : 'e.g. Sree Caterers, Pixel Perfect Studios'}
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                />
                <Input
                  label={isTa ? 'குறுகிய விளம்பரம்' : 'Tagline'}
                  placeholder={isTa ? 'உங்கள் சேவையை ஒரு வரியில்...' : 'One line that describes your business...'}
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                />
                <Textarea
                  label={isTa ? 'உங்களை பற்றி' : 'About Your Business'}
                  placeholder={isTa ? 'உங்கள் அனுபவம், நிபுணத்துவம், சிறப்பு...' : 'Years of experience, specialization, what makes you different...'}
                  rows={4}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                />
                <Input
                  label={isTa ? 'GSTIN (விரும்பினால்)' : 'GSTIN (optional)'}
                  placeholder="33XXXXX1234M1Z5"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  hint={isTa ? 'GST பதிவு செய்யப்பட்ட வணிகங்களுக்கு கட்டாயம்' : 'Required for GST-registered businesses'}
                />
              </div>
              <Button onClick={() => setStep(1)} disabled={!businessName} size="lg" className="w-full">
                {isTa ? 'தொடரவும்' : 'Continue'} →
              </Button>
            </motion.div>
          )}

          {/* STEP 1: CATEGORIES */}
          {step === 1 && (
            <motion.div key="categories" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="glass border-vivid-subtle p-6 mb-6">
                <p className="text-[0.68rem] tracking-[0.2em] uppercase text-sky/70 font-semibold mb-5">
                  {isTa ? 'நீங்கள் என்ன வழங்குகிறீர்கள்?' : 'What services do you offer?'}
                </p>
                <p className="text-muted-hep text-sm mb-5">
                  {isTa ? 'ஒன்று அல்லது அதிகமாக தேர்வு செய்யலாம்' : 'Select one or more. You can update this anytime.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VENDOR_CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat.value)
                    return (
                      <motion.button
                        key={cat.value}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleCat(cat.value)}
                        className={`flex items-center gap-3 p-4 border text-left transition-all duration-200
                          ${isSelected ? 'border-vivid bg-vivid/10' : 'border-white/10 hover:border-vivid/40'}`}
                      >
                        <span className="text-xl flex-shrink-0">{cat.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{isTa ? cat.labelTa : cat.label}</div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-vivid flex items-center justify-center text-[0.6rem] flex-shrink-0">✓</span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-vivid/10">
                    {selectedCategories.map(cat => {
                      const c = VENDOR_CATEGORIES.find(v => v.value === cat)!
                      return <Badge key={cat} variant="vivid">{c.icon} {isTa ? c.labelTa : c.label}</Badge>
                    })}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                <Button onClick={() => setStep(2)} disabled={selectedCategories.length === 0} className="flex-1" size="lg">
                  {isTa ? 'தொடரவும்' : 'Continue'} →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: COVERAGE AREA */}
          {step === 2 && (
            <motion.div key="coverage" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="glass border-vivid-subtle p-6 space-y-5 mb-6">
                <Input
                  label={isTa ? 'நகரம்' : 'City'}
                  placeholder="Chennai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
                <Input
                  label={isTa ? 'முகவரி / பகுதி' : 'Base Address / Locality'}
                  placeholder={isTa ? 'எ.கா: T. Nagar, Chennai 600 017' : 'e.g. T. Nagar, Chennai 600 017'}
                  prefix="📍"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />

                {/* Maps placeholder */}
                <div>
                  <label className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80 block mb-2">
                    {isTa ? 'சேவை வரம்பு' : 'Service Radius'}: <span className="text-vivid">{radiusKm} km</span>
                  </label>
                  <input
                    type="range" min={5} max={100} step={5}
                    value={radiusKm}
                    onChange={e => setRadiusKm(Number(e.target.value))}
                    className="w-full accent-[#2251FF] cursor-pointer mb-3"
                  />
                  <div className="flex justify-between text-[0.6rem] text-muted-hep mb-4">
                    <span>5 km</span><span>25 km</span><span>50 km</span><span>100 km</span>
                  </div>
                  {/* Map placeholder box */}
                  <div className="border border-vivid/20 bg-mid/30 h-48 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-40" />
                    <span className="text-3xl relative">🗺️</span>
                    <div className="text-center relative">
                      <p className="text-sm font-semibold">Google Maps Integration</p>
                      <p className="text-muted-hep text-xs mt-1">
                        {isTa ? 'Google Maps API key சேர்த்தால் வரைபடம் காட்டப்படும்' : 'Add VITE_GOOGLE_MAPS_KEY to .env.local to enable map'}
                      </p>
                    </div>
                    <Badge variant="warn">{isTa ? 'API Key தேவை' : 'API Key Needed'}</Badge>
                  </div>
                </div>

                <div className="border border-vivid/15 bg-vivid/5 p-4 flex gap-3">
                  <span className="text-vivid text-xl flex-shrink-0">⚡</span>
                  <div>
                    <p className="text-vivid text-sm font-semibold mb-1">
                      {isTa ? 'புவியியல் அறிவிப்புகள்' : 'Geo-Smart Notifications'}
                    </p>
                    <p className="text-muted-hep text-xs leading-relaxed">
                      {isTa
                        ? `${radiusKm}km க்குள் நிகழ்வு பதிவிடப்படும்போது, நீங்கள் முதலில் அறிவிப்பு பெறுவீர்கள்.`
                        : `When an event is posted within ${radiusKm}km of your location, you'll be notified first — before vendors further away.`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                <Button onClick={() => setStep(3)} disabled={!address} className="flex-1" size="lg">
                  {isTa ? 'தொடரவும்' : 'Continue'} →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PACKAGES */}
          {step === 3 && (
            <motion.div key="packages" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="glass border-vivid-subtle p-6 mb-6 space-y-4">
                <p className="text-[0.68rem] tracking-[0.2em] uppercase text-sky/70 font-semibold">
                  {isTa ? 'சேவை தொகுப்புகள் உருவாக்குக' : 'Define your service packages'}
                </p>
                <p className="text-muted-hep text-sm">
                  {isTa
                    ? 'வாடிக்கையாளர்கள் உங்கள் விலையை முன்கூட்டியே அறிய தொகுப்புகள் உதவும். பின்னர் திருத்தலாம்.'
                    : 'Packages help clients know your pricing upfront. You can always edit later.'}
                </p>
                {packages.map((pkg, idx) => (
                  <div key={idx} className="border border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-hep text-[0.6rem] text-vivid tracking-widest">
                        {isTa ? 'தொகுப்பு' : 'PACKAGE'} {String(idx + 1).padStart(2, '0')}
                      </span>
                      {idx > 0 && (
                        <button
                          onClick={() => setPackages(prev => prev.filter((_, i) => i !== idx))}
                          className="text-error/60 hover:text-error text-xs"
                        >
                          ✕ {isTa ? 'நீக்கு' : 'Remove'}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label={isTa ? 'தொகுப்பு பெயர்' : 'Package Name'}
                        placeholder={isTa ? 'எ.கா: அடிப்படை, பிரீமியம்' : 'e.g. Basic, Premium, Full Day'}
                        value={pkg.name}
                        onChange={e => updatePackage(idx, 'name', e.target.value)}
                      />
                      <Input
                        label={isTa ? 'விலை (₹)' : 'Price (₹)'}
                        type="number"
                        prefix="₹"
                        placeholder="25000"
                        value={pkg.price}
                        onChange={e => updatePackage(idx, 'price', e.target.value)}
                      />
                    </div>
                    <Textarea
                      label={isTa ? 'விவரம்' : 'Description'}
                      placeholder={isTa ? 'என்ன சேவை வழங்கப்படுகிறது...' : 'What is included in this package...'}
                      rows={2}
                      value={pkg.description}
                      onChange={e => updatePackage(idx, 'description', e.target.value)}
                    />
                    <Textarea
                      label={isTa ? 'இதில் அடங்கியது (ஒவ்வொன்றும் புதிய வரியில்)' : "What's included (one per line)"}
                      placeholder={isTa ? 'எ.கா:\n6 மணி நேர கவரேஜ்\n500 திருத்தப்பட்ட படங்கள்' : 'e.g.\n6 hours coverage\n500 edited photos\nOnline gallery'}
                      rows={3}
                      value={pkg.includes}
                      onChange={e => updatePackage(idx, 'includes', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  onClick={addPackage}
                  className="w-full border border-dashed border-vivid/30 py-3 text-vivid text-sm hover:border-vivid/60 hover:bg-vivid/5 transition-all"
                >
                  + {isTa ? 'மற்றொரு தொகுப்பு சேர்' : 'Add Another Package'}
                </button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                <Button onClick={() => setStep(4)} className="flex-1" size="lg">
                  {isTa ? 'தொடரவும்' : 'Continue'} →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: KYC */}
          {step === 4 && (
            <motion.div key="kyc" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="glass border-vivid-subtle p-6 space-y-5 mb-6">
                <div className="flex items-start gap-3 bg-warn/10 border border-warn/25 p-4">
                  <span className="text-warn text-xl flex-shrink-0">🔍</span>
                  <div>
                    <p className="text-warn font-semibold text-sm mb-1">{isTa ? 'KYC சரிபார்ப்பு' : 'Identity Verification'}</p>
                    <p className="text-muted-hep text-xs leading-relaxed">
                      {isTa
                        ? 'RBI விதிமுறைகள் மற்றும் நுகர்வோர் நம்பிக்கைக்கு, நாங்கள் அனைத்து சேவையாளர்களையும் சரிபார்க்கிறோம். இது ஒரு முறை செயல்முறை.'
                        : 'For RBI compliance and consumer trust, we verify all vendors. This is a one-time process.'}
                    </p>
                  </div>
                </div>

                <Input
                  label={isTa ? 'PAN எண்' : 'PAN Number'}
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  hint={isTa ? 'TDS கழிவுக்கு தேவை. பாதுகாப்பாக சேமிக்கப்படும்.' : 'Required for TDS deduction. Stored securely, never shared.'}
                />

                <div className="space-y-2">
                  <label className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80 block">
                    {isTa ? 'வணிக ஆதாரம்' : 'Business Proof'}
                  </label>
                  <div className="border border-dashed border-white/15 p-8 flex flex-col items-center gap-3 hover:border-vivid/30 transition-colors cursor-pointer">
                    <span className="text-3xl">📎</span>
                    <div className="text-center">
                      <p className="text-sm text-white/70">{isTa ? 'ஆதார அட்டை, வாக்காளர் அட்டை அல்லது பாஸ்போர்ட்' : 'Aadhaar, Voter ID, or Passport'}</p>
                      <p className="text-muted-hep text-xs mt-1">{isTa ? 'PDF அல்லது JPG, 5MB வரை' : 'PDF or JPG, up to 5MB'}</p>
                    </div>
                    <Badge variant="ghost">{isTa ? 'கோப்பு பதிவேற்று (விரைவில்)' : 'File Upload (Coming Soon)'}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[0.68rem] tracking-[0.2em] uppercase text-sky/70 font-semibold">
                    {isTa ? 'வங்கி கணக்கு விவரங்கள்' : 'Bank Account (for payouts)'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={isTa ? 'கணக்கு எண்' : 'Account Number'} placeholder="XXXXXXXXXXXX" />
                    <Input label={isTa ? 'IFSC குறியீடு' : 'IFSC Code'} placeholder="SBIN0001234" />
                  </div>
                  <Input label={isTa ? 'கணக்து வைத்திருப்பவர் பெயர்' : 'Account Holder Name'} placeholder={businessName || 'Business Name'} />
                  <p className="text-muted-hep text-[0.68rem]">
                    {isTa ? '🔒 Razorpay மூலம் பாதுகாப்பாக செயலாக்கப்படுகிறது — RBI அங்கீகரிக்கப்பட்ட PA' : '🔒 Processed securely via Razorpay — RBI-authorized Payment Aggregator'}
                  </p>
                </div>

                <div className="border border-success/20 bg-success/5 p-4">
                  <p className="text-success text-sm font-semibold mb-2">{isTa ? '✅ முகப்பு சேவையாளர் தொகுப்பில் சேருங்கள்' : '✅ Join the Backup Vendor Pool'}</p>
                  <p className="text-muted-hep text-xs leading-relaxed">
                    {isTa
                      ? 'கடைசி நிமிட ரத்தல் ஏற்பட்டால் HE&P உங்களை தொடர்பு கொள்ளும். கமிஷன் இல்லாமல் கூடுதல் வருமானம்.'
                      : 'If a primary vendor cancels last minute, HE&P will contact you for emergency coverage. Zero commission on these bookings.'}
                  </p>
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#2251FF]" />
                    <span className="text-sm text-white/70">
                      {isTa ? 'ஆம், முகப்பு சேவையாளராக இருக்க விரும்புகிறேன்' : 'Yes, add me to the emergency backup pool'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                <Button onClick={handleFinish} loading={isSubmitting} className="flex-1" size="lg">
                  🚀 {isTa ? 'சுயவிவரம் சமர்ப்பிக்கவும்' : 'Submit Profile for Review'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
