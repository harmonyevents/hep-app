import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
    if (result.error) { setError(result.error); return }
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
    if (result.error) { setError(result.error); return }
    navigate(getRedirectPath(role))
  }

  const steps: Step[] = ['email', 'otp', 'role', 'name']
  const stepIdx = steps.indexOf(step)
  const progressWidth = `${((stepIdx + 1) / steps.length) * 100}%`

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: 16,
    border: '1px solid #E4E4E4',
    padding: '2.5rem',
    maxWidth: 448,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  }

  const submitBtnStyle: React.CSSProperties = {
    background: '#D4AF37',
    color: '#031635',
    borderRadius: 9999,
    fontWeight: 600,
    width: '100%',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.2s',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-20 pb-12" style={{ background: '#F5F5F5' }}>
      <div style={{ width: '100%', maxWidth: 448 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 no-underline">
            <svg viewBox="0 0 256 256" width="32" height="32" fill="#031635">
              <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
            </svg>
            <div className="text-left">
              <div className="font-semibold text-sm" style={{ color: '#031635', letterSpacing: '0.08em' }}>HE&amp;P</div>
              <div className="text-xs" style={{ color: '#858585' }}>Harmony Events &amp; Productions</div>
            </div>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="mb-2 flex items-center justify-between px-1">
          <span style={{ fontSize: '0.75rem', color: '#858585', letterSpacing: '0.08em' }}>
            {isTa ? `படி ${stepIdx + 1} / ${steps.length}` : `Step ${stepIdx + 1} of ${steps.length}`}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#858585' }}>
            {steps.map((s, i) => (
              <span key={s} style={{ color: i <= stepIdx ? '#D4AF37' : '#E4E4E4' }}>●</span>
            ))}
          </span>
        </div>
        <StepProgress current={stepIdx} total={steps.length} className="mb-6" />

        <AnimatePresence mode="wait">

          {/* ── STEP: EMAIL ── */}
          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              style={cardStyle}
            >
              {/* Gold progress bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, height: 3, width: progressWidth, background: '#D4AF37', transition: 'width 0.4s ease', borderRadius: '16px 0 0 0' }} />

              <h2 className="font-medium mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: '#0A0A0A' }}>
                {isTa ? 'தொடங்குங்கள்' : 'Get started'}
              </h2>
              <p className="mb-8" style={{ color: '#858585', fontSize: '1rem' }}>
                {isTa ? 'உங்கள் மின்னஞ்சல் உள்ளிடுங்கள் — OTP அனுப்பப்படும்' : "Enter your email — we'll send you a one-time code"}
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
                {error && <p style={{ color: '#ba1a1a', fontSize: '0.875rem' }}>{error}</p>}
                <motion.button
                  type="submit"
                  style={{ ...submitBtnStyle, opacity: isLoading ? 0.7 : 1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                >
                  {isLoading
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : (isTa ? 'OTP அனுப்பு' : 'Send OTP to Email')}
                </motion.button>
              </form>

              <p className="text-center mt-6" style={{ color: '#858585', fontSize: '0.75rem' }}>
                {isTa ? 'தொடர்வதன் மூலம் நீங்கள்' : 'By continuing, you agree to our'}{' '}
                <span style={{ color: '#D4AF37', cursor: 'pointer' }}>{isTa ? 'விதிமுறைகளை ஒப்புக்கொள்கிறீர்கள்' : 'Terms & Privacy Policy'}</span>
              </p>

              {/* Dev shortcuts */}
              <div className="mt-6 pt-6 space-y-2" style={{ borderTop: '1px solid #E4E4E4' }}>
                <p className="text-center tracking-widest uppercase" style={{ fontSize: '0.75rem', color: '#858585' }}>Dev shortcuts</p>
                <div className="flex gap-2">
                  {(['consumer', 'vendor', 'admin'] as UserRole[]).map(r => (
                    <button key={r} onClick={() => { mockLogin(r); navigate(getRedirectPath(r)) }}
                      className="flex-1 capitalize transition-all"
                      style={{ fontSize: '0.75rem', padding: '0.375rem 0', border: '1px solid #E4E4E4', borderRadius: 8, color: '#858585', background: 'transparent', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37'; (e.currentTarget as HTMLButtonElement).style.color = '#031635' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E4E4E4'; (e.currentTarget as HTMLButtonElement).style.color = '#858585' }}
                    >
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
              style={cardStyle}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, height: 3, width: progressWidth, background: '#D4AF37', transition: 'width 0.4s ease', borderRadius: '16px 0 0 0' }} />

              <h2 className="font-medium mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: '#0A0A0A' }}>
                {isTa ? 'OTP சரிபார்க்க' : 'Check your email'}
              </h2>
              <p className="mb-1" style={{ color: '#858585', fontSize: '1rem' }}>
                {isTa ? 'இந்த மின்னஞ்சலுக்கு OTP அனுப்பப்பட்டது:' : 'We sent a 6-digit code to'}
              </p>
              <p className="font-mono-hep mb-8" style={{ color: '#D4AF37', fontSize: '0.9375rem' }}>{email}</p>

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
                {error && <p style={{ color: '#ba1a1a', fontSize: '0.875rem' }}>{error}</p>}
                <motion.button
                  type="submit"
                  style={{ ...submitBtnStyle, opacity: isLoading ? 0.7 : 1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                >
                  {isLoading
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : (isTa ? 'சரிபார்க்கவும்' : 'Verify Code')}
                </motion.button>
              </form>

              <button onClick={() => { setStep('email'); setError(''); otpForm.reset() }}
                className="w-full text-center mt-5 transition-colors"
                style={{ fontSize: '0.875rem', color: '#858585', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← {isTa ? 'மின்னஞ்சல் மாற்றவும்' : 'Change email address'}
              </button>

              <p className="text-center mt-3" style={{ fontSize: '0.75rem', color: '#858585' }}>
                {isTa ? 'உங்கள் inbox சரிபார்க்கவும் (spam ஐயும் பாருங்கள்)' : 'Check your inbox — check spam if not seen in 1 min'}
              </p>
            </motion.div>
          )}

          {/* ── STEP: ROLE ── */}
          {step === 'role' && (
            <motion.div key="role" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              style={cardStyle}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, height: 3, width: progressWidth, background: '#D4AF37', transition: 'width 0.4s ease', borderRadius: '16px 0 0 0' }} />

              <h2 className="font-medium mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: '#0A0A0A' }}>
                {isTa ? 'நான் விரும்புவது...' : 'I want to...'}
              </h2>
              <p className="mb-8" style={{ color: '#858585', fontSize: '1rem' }}>
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
                    className="w-full text-left flex items-start gap-4 transition-all duration-200"
                    style={{
                      padding: '1.25rem',
                      borderRadius: 12,
                      border: role === opt.r ? '2px solid #031635' : '1px solid #E4E4E4',
                      background: role === opt.r ? '#031635' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: role === opt.r ? '#ffffff' : '#0A0A0A' }}>{opt.label}</div>
                      <div style={{ color: role === opt.r ? 'rgba(255,255,255,0.65)' : '#858585', fontSize: '0.875rem' }}>{opt.desc}</div>
                    </div>
                    {role === opt.r && <span className="ml-auto" style={{ color: '#D4AF37' }}>✓</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP: NAME ── */}
          {step === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              style={cardStyle}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, height: 3, width: progressWidth, background: '#D4AF37', transition: 'width 0.4s ease', borderRadius: '16px 0 0 0' }} />

              <h2 className="font-medium mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: '#0A0A0A' }}>
                {isTa ? 'கொஞ்சம் அறிமுகம்' : 'Almost there'}
              </h2>
              <p className="mb-8" style={{ color: '#858585', fontSize: '1rem' }}>
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
                {error && <p style={{ color: '#ba1a1a', fontSize: '0.875rem' }}>{error}</p>}
                <motion.button
                  type="submit"
                  style={{ ...submitBtnStyle, opacity: isLoading ? 0.7 : 1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                >
                  {isLoading
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : (isTa ? 'தொடங்குங்கள் →' : 'Get Started →')}
                </motion.button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
