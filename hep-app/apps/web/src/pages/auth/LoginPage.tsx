import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StepProgress } from '@/components/ui/Progress'
import { useAuthStore } from '@/store/auth'
import type { UserRole } from '@/types'

const emailSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})
const nameSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
})

type Step = 'email' | 'otp' | 'role' | 'name'

export function LoginPage() {
  const { i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mockLogin, sendOtp, verifyOtp, updateProfile } = useAuthStore()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>((searchParams.get('role') as UserRole) || 'consumer')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const emailForm = useForm({ resolver: zodResolver(emailSchema) })
  const otpForm   = useForm({ resolver: zodResolver(otpSchema) })
  const nameForm  = useForm({ resolver: zodResolver(nameSchema) })

  const redirectTo = searchParams.get('redirect')
  const getRedirectPath = (r: UserRole) =>
    redirectTo || (r === 'vendor' ? '/vendor/dashboard' : '/consumer/dashboard')

  const onEmailSubmit = async (data: { email: string }) => {
    setError('')
    setIsLoading(true)
    setEmail(data.email)
    const result = await sendOtp(data.email)
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setStep('otp')
  }

  const onOtpSubmit = async (data: { otp: string }) => {
    setError('')
    setIsLoading(true)
    const result = await verifyOtp(email, data.otp)
    setIsLoading(false)
    if (result.error) {
      setError(isTa ? 'தவறான OTP. மீண்டும் முயற்சிக்கவும்.' : 'Invalid OTP. Please try again.')
      return
    }
    const currentUser = useAuthStore.getState().user
    if (currentUser?.name?.trim()) {
      navigate(getRedirectPath(currentUser.role))
      return
    }
    setStep('role')
  }

  const onRoleSelect = (r: UserRole) => {
    setRole(r)
    setStep('name')
  }

  const onNameSubmit = async (data: { name: string }) => {
    setError('')
    setIsLoading(true)
    const result = await updateProfile({ name: data.name, email, role })
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(getRedirectPath(role))
  }

  const steps: Step[] = ['email', 'otp', 'role', 'name']
  const stepIdx = steps.indexOf(step)

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      {/* Warm gold glow */}
      <motion.div className="absolute w-[500px] h-[500px] rounded-full -top-24 -right-24 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div className="absolute w-[400px] h-[400px] rounded-full bottom-0 -left-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,81,255,0.06) 0%, transparent 68%)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 no-underline">
            <img src="/logo_cropped.jpg" alt="HE&P" className="w-10 h-10 brightness-0 invert" />
            <div className="text-left">
              <div className="font-bold text-[0.85rem] tracking-[0.22em] uppercase">HE&amp;P</div>
              <div className="text-[0.55rem] tracking-wide text-white/30">Harmony Events &amp; Platform</div>
            </div>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30">
            {isTa ? `படி ${stepIdx + 1} / ${steps.length}` : `Step ${stepIdx + 1} of ${steps.length}`}
          </span>
          <span className="text-[0.6rem] tracking-[0.2em] text-white/20">
            {steps.map((s, i) => (
              <span key={s} className={i <= stepIdx ? 'text-gold' : ''}>●</span>
            ))}
          </span>
        </div>
        <StepProgress current={stepIdx} total={steps.length} className="mb-8" />

        <AnimatePresence mode="wait">

          {/* ── STEP: EMAIL ── */}
          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              className="glass border border-white/10 p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'தொடங்குங்கள்' : 'Get started'}
              </h2>
              <p className="text-white/45 text-sm mb-8">
                {isTa ? 'உங்கள் மின்னஞ்சல் உள்ளிடுங்கள் — OTP அனுப்பப்படும்' : 'Enter your email — we\'ll send you a one-time code'}
              </p>

              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                <Input
                  label={isTa ? 'மின்னஞ்சல்' : 'Email Address'}
                  type="email"
                  placeholder="you@example.com"
                  prefix="✉️"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register('email')}
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <Button type="submit" loading={isLoading} className="w-full">
                  {isTa ? 'OTP அனுப்பு' : 'Send OTP to Email'}
                </Button>
              </form>

              <p className="text-center text-white/30 text-xs mt-6">
                {isTa ? 'தொடர்வதன் மூலம் நீங்கள்' : 'By continuing, you agree to our'}{' '}
                <span className="text-gold/70 cursor-pointer">{isTa ? 'விதிமுறைகளை ஒப்புக்கொள்கிறீர்கள்' : 'Terms & Privacy Policy'}</span>
              </p>

              {/* Dev shortcuts */}
              <div className="mt-6 pt-6 border-t border-white/8 space-y-2">
                <p className="text-[0.6rem] text-white/20 text-center tracking-widest uppercase">Dev shortcuts</p>
                <div className="flex gap-2">
                  {(['consumer', 'vendor', 'admin'] as UserRole[]).map(r => (
                    <button key={r} onClick={() => { mockLogin(r); navigate(getRedirectPath(r)) }}
                      className="flex-1 text-[0.65rem] py-1.5 border border-white/10 hover:border-gold/30 text-white/35 hover:text-gold/80 transition-all capitalize">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP: OTP ── */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              className="glass border border-white/10 p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'OTP சரிபார்க்க' : 'Check your email'}
              </h2>
              <p className="text-white/45 text-sm mb-1">
                {isTa ? 'இந்த மின்னஞ்சலுக்கு OTP அனுப்பப்பட்டது:' : 'We sent a 6-digit code to'}
              </p>
              <p className="text-gold text-sm font-mono-hep mb-8">{email}</p>

              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5">
                <Input
                  label={isTa ? '6 இலக்க OTP' : '6-digit code'}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="text-center text-xl tracking-[0.5em] font-mono-hep"
                  error={otpForm.formState.errors.otp?.message}
                  {...otpForm.register('otp')}
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <Button type="submit" loading={isLoading} className="w-full">
                  {isTa ? 'சரிபார்க்கவும்' : 'Verify Code'}
                </Button>
              </form>

              <button onClick={() => { setStep('email'); setError(''); otpForm.reset() }}
                className="w-full text-center text-white/30 text-xs mt-5 hover:text-white/60 transition-colors"
              >
                ← {isTa ? 'மின்னஞ்சல் மாற்றவும்' : 'Change email address'}
              </button>

              <p className="text-center text-white/20 text-xs mt-3">
                {isTa ? 'உங்கள் inbox சரிபார்க்கவும் (spam ஐயும் பாருங்கள்)' : 'Check your inbox — check spam if not seen in 1 min'}
              </p>
            </motion.div>
          )}

          {/* ── STEP: ROLE ── */}
          {step === 'role' && (
            <motion.div key="role" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              className="glass border border-white/10 p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'நான் விரும்புவது...' : 'I want to...'}
              </h2>
              <p className="text-white/45 text-sm mb-8">
                {isTa ? 'உங்கள் பாத்திரத்தை தேர்வு செய்யுங்கள்' : 'Choose how you want to use HE&P'}
              </p>
              <div className="space-y-3">
                {[
                  { r: 'consumer' as UserRole, icon: '🎉',
                    label: isTa ? 'நிகழ்வு திட்டமிட & பதிவிட' : 'Plan & Book Events',
                    desc:  isTa ? 'நிகழ்வுகளை பதிவிடுங்கள், ஏலங்களை ஒப்பிடுங்கள்' : 'Post events, compare bids, manage vendors' },
                  { r: 'vendor' as UserRole, icon: '🛠️',
                    label: isTa ? 'என் சேவையை வழங்க' : 'Offer My Services',
                    desc:  isTa ? 'ஏலம் போடுங்கள், கட்டணம் பெறுங்கள், வளருங்கள்' : 'Bid on events, get paid, grow my business' },
                ].map(opt => (
                  <motion.button key={opt.r} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => onRoleSelect(opt.r)}
                    className={`w-full text-left p-5 border transition-all duration-200 flex items-start gap-4
                      ${role === opt.r ? 'border-gold/50 bg-gold/8' : 'border-white/10 hover:border-gold/25 hover:bg-white/3'}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-semibold text-sm mb-1">{opt.label}</div>
                      <div className="text-white/40 text-xs">{opt.desc}</div>
                    </div>
                    {role === opt.r && <span className="ml-auto text-gold">✓</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP: NAME ── */}
          {step === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              className="glass border border-white/10 p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'கொஞ்சம் அறிமுகம்' : 'Almost there'}
              </h2>
              <p className="text-white/45 text-sm mb-8">
                {role === 'vendor'
                  ? (isTa ? 'உங்கள் வணிக பெயரை உள்ளிடுங்கள்' : 'Tell us your business name')
                  : (isTa ? 'உங்கள் பெயரை உள்ளிடுங்கள்' : 'What should we call you?')}
              </p>
              <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-5">
                <Input
                  label={role === 'vendor' ? (isTa ? 'வணிக பெயர்' : 'Business Name') : (isTa ? 'முழு பெயர்' : 'Full Name')}
                  placeholder={role === 'vendor' ? 'Sree Caterers / Studio XYZ' : 'Priya Sharma'}
                  error={nameForm.formState.errors.name?.message}
                  {...nameForm.register('name')}
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <Button type="submit" loading={isLoading} className="w-full">
                  {isTa ? 'தொடங்குங்கள் →' : 'Get Started →'}
                </Button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
