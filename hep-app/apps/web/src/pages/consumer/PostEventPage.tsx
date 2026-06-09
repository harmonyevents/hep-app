import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MapPicker } from '@/components/ui/MapPicker'
import { EVENT_TYPES, VENDOR_CATEGORIES, AI_SUGGESTIONS } from '@/lib/constants'
import type { EventType, VendorCategory } from '@/types'

const schema = z.object({
  title: z.string().min(3, 'Event name too short'),
  type: z.string().min(1, 'Please select event type'),
  date: z.string().min(1, 'Please select a date'),
  duration_hours: z.coerce.number().min(1).max(72),
  guest_count: z.coerce.number().min(1).max(100000),
  budget_min: z.coerce.number().min(1000),
  budget_max: z.coerce.number().min(1000),
  venue_address: z.string().min(5, 'Enter venue address'),
  notes: z.string().optional(),
  bid_deadline_days: z.coerce.number().min(1).max(90),
  visibility: z.enum(['public', 'invite_only']),
})

type FormData = z.infer<typeof schema>

export function PostEventPage() {
  const { t, i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preType = searchParams.get('type') as EventType | null

  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState<EventType | ''>(preType || '')
  const [aiSuggestions, setAiSuggestions] = useState<VendorCategory[]>([])
  const [checkedCats, setCheckedCats] = useState<VendorCategory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [venueLat, setVenueLat] = useState<number | null>(null)
  const [venueLng, setVenueLng] = useState<number | null>(null)

  const { register, handleSubmit, watch, control, formState: { errors }, setValue, trigger } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      type: preType || '',
      duration_hours: 4,
      guest_count: 100,
      budget_min: 50000,
      budget_max: 200000,
      bid_deadline_days: 7,
      visibility: 'public',
    },
  })

  const onTypeSelect = (type: EventType) => {
    setSelectedType(type)
    setValue('type', type)
    const suggestions = AI_SUGGESTIONS[type] || []
    setAiSuggestions(suggestions)
    setCheckedCats(suggestions)
  }

  const toggleCat = (cat: VendorCategory) => {
    setCheckedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const STEPS = [
    { title: isTa ? 'நிகழ்வு வகை' : 'Event Type', titleEn: 'Event Type' },
    { title: isTa ? 'விவரங்கள்' : 'Event Details', titleEn: 'Event Details' },
    { title: isTa ? 'சேவைகள்' : 'Services Needed', titleEn: 'Services Needed' },
    { title: isTa ? 'மதிப்பாய்வு' : 'Review & Post', titleEn: 'Review & Post' },
  ]

  const nextStep = async () => {
    if (step === 0 && !selectedType) return
    if (step === 1) {
      const ok = await trigger(['title', 'date', 'duration_hours', 'guest_count', 'budget_min', 'budget_max', 'venue_address'])
      if (!ok) return
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setIsSubmitting(false)
    navigate('/consumer/events?posted=true')
  }

  const budgetMin = watch('budget_min')
  const budgetMax = watch('budget_max')
  const guestCount = watch('guest_count')

  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <SectionLabel>{isTa ? 'நிகழ்வை அறிவிக்கவும்' : 'Announce Your Event'}</SectionLabel>
          <h1 className="font-display text-5xl font-light mb-2">
            {isTa ? 'உங்கள் நிகழ்வை' : 'Tell us about'}
            <br />
            <em className="text-vivid not-italic">{isTa ? 'திட்டமிடுங்கள்' : 'your event.'}</em>
          </h1>
          <p className="text-muted-hep font-light">
            {isTa
              ? 'சமர்ப்பித்த பிறகு, உங்கள் பகுதியில் உள்ள சரிபார்க்கப்பட்ட சேவையாளர்கள் ஏலம் போடுவார்கள்.'
              : 'After posting, verified vendors in your area will bid. You compare, choose, and confirm.'}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex gap-0 mb-10 overflow-hidden border border-vivid/15">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex-1 px-4 py-3 text-center transition-all duration-200 text-[0.65rem] tracking-[0.15em] uppercase font-semibold
                ${i === step ? 'bg-vivid text-white' : i < step ? 'bg-vivid/20 text-vivid' : 'text-white/30'}`}
            >
              <span className="font-mono-hep mr-1.5">0{i + 1}</span>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* STEP 0: EVENT TYPE */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="glass border-vivid-subtle p-6">
                  <p className="text-[0.68rem] tracking-[0.2em] uppercase text-sky/70 font-semibold mb-5">
                    {isTa ? 'நிகழ்வு வகை தேர்வு செய்யுங்கள்' : 'Select your event type'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EVENT_TYPES.map(et => (
                      <motion.button
                        key={et.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onTypeSelect(et.value as EventType)}
                        className={`p-4 flex flex-col items-center gap-2 text-center border transition-all duration-200
                          ${selectedType === et.value
                            ? 'border-vivid bg-vivid/10 text-white'
                            : 'border-white/10 hover:border-vivid/40 text-white/60 hover:text-white'}`}
                      >
                        <span className="text-2xl">{et.icon}</span>
                        <span className="text-[0.68rem] font-semibold tracking-wide">
                          {isTa ? et.labelTa : et.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <Button type="button" onClick={nextStep} disabled={!selectedType} className="w-full" size="lg">
                  {isTa ? 'தொடரவும்' : 'Continue'} →
                </Button>
              </motion.div>
            )}

            {/* STEP 1: EVENT DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="glass border-vivid-subtle p-6 space-y-5">
                  <Input
                    label={isTa ? 'நிகழ்வு பெயர்' : 'Event Name'}
                    placeholder={isTa ? 'எ.கா: Priya & Karthik திருமணம்' : 'e.g. Priya & Karthik Wedding'}
                    error={errors.title?.message}
                    {...register('title')}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={isTa ? 'தேதி' : 'Event Date'}
                      type="date"
                      error={errors.date?.message}
                      min={new Date().toISOString().split('T')[0]}
                      {...register('date')}
                    />
                    <Input
                      label={isTa ? 'கால அளவு (மணி)' : 'Duration (hours)'}
                      type="number"
                      min={1}
                      max={72}
                      error={errors.duration_hours?.message}
                      {...register('duration_hours')}
                    />
                  </div>
                  <Input
                    label={isTa ? 'இடம் / முகவரி' : 'Venue / Address'}
                    placeholder={isTa ? 'இடத்தை உள்ளிடுங்கள்' : 'Enter venue name and address'}
                    prefix="📍"
                    error={errors.venue_address?.message}
                    {...register('venue_address')}
                  />
                  <div>
                    <p className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80 mb-2">
                      {isTa ? 'வரைபடத்தில் இடத்தை தேர்வு செய்யுங்கள்' : 'Pin location on map'}
                    </p>
                    <MapPicker
                      onLocationSelect={(lat, lng, address) => {
                        setVenueLat(lat)
                        setVenueLng(lng)
                        // Auto-fill address if empty
                        const current = (document.querySelector('input[name="venue_address"]') as HTMLInputElement)?.value
                        if (!current || current.trim() === '') {
                          setValue('venue_address', address)
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80">
                      {isTa ? 'விருந்தினர்கள்' : 'Expected Guests'}: <span className="text-vivid">{guestCount}</span>
                    </label>
                    <input
                      type="range" min={10} max={5000} step={10}
                      className="w-full accent-[#2251FF] cursor-pointer"
                      {...register('guest_count')}
                    />
                    <div className="flex justify-between text-[0.6rem] text-muted-hep">
                      <span>10</span><span>500</span><span>1000</span><span>5000+</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80">
                      {isTa ? 'பட்ஜெட்' : 'Budget Range'}: <span className="text-vivid">₹{Number(budgetMin).toLocaleString('en-IN')} – ₹{Number(budgetMax).toLocaleString('en-IN')}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label={isTa ? 'குறைந்தபட்சம்' : 'Minimum'} type="number" prefix="₹" {...register('budget_min')} />
                      <Input label={isTa ? 'அதிகபட்சம்' : 'Maximum'} type="number" prefix="₹" {...register('budget_max')} />
                    </div>
                  </div>
                  <Textarea
                    label={isTa ? 'சிறப்பு குறிப்புகள்' : 'Special Notes'}
                    placeholder={isTa ? 'எந்த குறிப்பிட்ட தேவைகள், கருப்பு, உணவு கட்டுப்பாடுகள்...' : 'Theme, dietary restrictions, special requirements...'}
                    rows={3}
                    {...register('notes')}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                  <Button type="button" onClick={nextStep} className="flex-1" size="lg">{isTa ? 'தொடரவும்' : 'Continue'} →</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SERVICES / AI SUGGESTIONS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="glass border-vivid-subtle p-6">
                  {/* AI banner */}
                  <div className="flex items-start gap-3 bg-vivid/10 border border-vivid/20 p-4 mb-6">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <div className="text-sm font-semibold text-vivid mb-1">
                        {isTa ? 'AI பரிந்துரை' : 'AI Recommendation'}
                      </div>
                      <p className="text-muted-hep text-xs leading-relaxed">
                        {isTa
                          ? `${guestCount} விருந்தினர்கள் ${EVENT_TYPES.find(e => e.value === selectedType)?.labelTa} க்காக — இந்த சேவைகள் தேவைப்படலாம்:`
                          : `For a ${guestCount}-guest ${EVENT_TYPES.find(e => e.value === selectedType)?.label}, you'll likely need:`}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VENDOR_CATEGORIES.map(cat => {
                      const isSuggested = aiSuggestions.includes(cat.value)
                      const isChecked = checkedCats.includes(cat.value)
                      return (
                        <motion.button
                          key={cat.value}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleCat(cat.value)}
                          className={`flex items-center gap-3 p-4 border text-left transition-all duration-200
                            ${isChecked
                              ? 'border-vivid bg-vivid/10'
                              : 'border-white/10 hover:border-white/25'}`}
                        >
                          <span className="text-xl flex-shrink-0">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{isTa ? cat.labelTa : cat.label}</div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isSuggested && !isChecked && (
                              <Badge variant="ghost" className="text-[0.55rem]">AI</Badge>
                            )}
                            {isChecked && (
                              <span className="w-5 h-5 rounded-full bg-vivid flex items-center justify-center text-[0.6rem] text-white">✓</span>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  <p className="text-muted-hep text-xs mt-4">
                    {isTa
                      ? `${checkedCats.length} சேவை வகைகள் தேர்ந்தெடுக்கப்பட்டன`
                      : `${checkedCats.length} service categories selected`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                  <Button type="button" onClick={nextStep} className="flex-1" disabled={checkedCats.length === 0} size="lg">
                    {isTa ? 'மதிப்பாய்வு' : 'Review'} →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="glass border-vivid-subtle p-6 space-y-6">
                  <div>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-sky/60 mb-2">{isTa ? 'நிகழ்வு வகை' : 'Event Type'}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{EVENT_TYPES.find(e => e.value === selectedType)?.icon}</span>
                      <span className="font-semibold">{isTa ? EVENT_TYPES.find(e => e.value === selectedType)?.labelTa : EVENT_TYPES.find(e => e.value === selectedType)?.label}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-widest text-sky/50 mb-1">{isTa ? 'விருந்தினர்கள்' : 'Guests'}</p>
                      <p className="font-semibold">{guestCount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-widest text-sky/50 mb-1">{isTa ? 'பட்ஜெட்' : 'Budget'}</p>
                      <p className="font-semibold text-vivid">₹{Number(budgetMin).toLocaleString('en-IN')} – ₹{Number(budgetMax).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-widest text-sky/50 mb-2">{isTa ? 'சேவைகள்' : 'Services Needed'}</p>
                    <div className="flex flex-wrap gap-2">
                      {checkedCats.map(cat => {
                        const c = VENDOR_CATEGORIES.find(v => v.value === cat)!
                        return (
                          <Badge key={cat} variant="vivid">
                            {c.icon} {isTa ? c.labelTa : c.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-hep">{isTa ? 'ஏல காலக்கெடு' : 'Bid Deadline'}</span>
                      <div className="flex items-center gap-2">
                        <input type="number" min={1} max={30} className="w-16 bg-mid/60 border border-white/10 text-center text-sm px-2 py-1 text-white outline-none focus:border-vivid" {...register('bid_deadline_days')} />
                        <span className="text-muted-hep text-xs">{isTa ? 'நாட்கள்' : 'days'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-hep">{isTa ? 'யார் ஏலம் போடலாம்?' : 'Who can bid?'}</span>
                      <Controller
                        name="visibility"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="bg-mid/60 border border-white/10 text-sm px-3 py-1.5 text-white outline-none focus:border-vivid"
                          >
                            <option value="public">{isTa ? 'அனைத்து சேவையாளர்களும்' : 'All Vendors'}</option>
                            <option value="invite_only">{isTa ? 'அழைக்கப்பட்டவர்கள் மட்டும்' : 'Invite Only'}</option>
                          </select>
                        )}
                      />
                    </div>
                  </div>
                  {/* HE&P guarantee box */}
                  <div className="border border-success/25 bg-success/5 p-4 flex gap-3">
                    <span className="text-success text-xl flex-shrink-0">🛡️</span>
                    <div>
                      <div className="text-success text-sm font-semibold mb-1">HE&P Guarantee</div>
                      <p className="text-muted-hep text-xs leading-relaxed">
                        {isTa
                          ? 'நிகழ்விற்கு 48 மணி நேரத்திற்கு முன் சேவையாளர் ரத்து செய்தால், HE&P உடனடியாக மாற்றீட்டை கண்டுபிடிக்கும் — அல்லது முழு திரும்பப் பெறுதல் உத்தரவாதம்.'
                          : 'If a vendor cancels within 48 hours of your event, HE&P activates emergency response to find a replacement — or guarantees a full refund.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">← {isTa ? 'பின்' : 'Back'}</Button>
                  <Button type="submit" loading={isSubmitting} className="flex-1" size="lg">
                    🚀 {isTa ? 'நிகழ்வை பதிவிட்டு ஏலங்களை வரவேற்கவும்' : 'Post Event & Invite Bids'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}
