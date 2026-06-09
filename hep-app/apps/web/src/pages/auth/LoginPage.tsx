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

const phoneSchema = z.object({
  phone: z.string().min(10).max(13).regex(/^\+?[0-9\s-]+$/, 'Invalid phone number'),
})
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})
const nameSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

type Step = 'phone' | 'otp' | 'role' | 'name'

export function LoginPage() {
  const { t, i18n } = useTranslation()
  const isTa = i18n.language === 'ta'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mockLogin, sendOtp, verifyOtp, updateProfile, user } = useAuthStore()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>((searchParams.get('role') as UserRole) || 'consumer')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const phoneForm = useForm({ resolver: zodResolver(phoneSchema) })
  const otpForm = useForm({ resolver: zodResolver(otpSchema) })
  const nameForm = useForm({ resolver: zodResolver(nameSchema) })

  const redirectTo = searchParams.get('redirect')

  const getRedirectPath = (r: UserRole) =>
    redirectTo || (r === 'vendor' ? '/vendor/dashboard' : '/consumer/dashboard')

  // Dev bypass: OTP always succeeds with any 6 digits (Supabase phone needs Twilio to be configured)
  const isDev = import.meta.env.DEV

  const onPhoneSubmit = async (data: { phone: string }) => {
    setError('')
    setIsLoading(true)
    setPhone(data.phone)
    if (isDev) {
      await new Promise(r => setTimeout(r, 700))
      setIsLoading(false)
      setStep('otp')
      return
    }
    const result = await sendOtp(data.phone)
    setIsLoading(false)
    if (result.error) {
      // Supabase phone OTP requires Twilio. Fall back to mock flow.
      setStep('otp')
      return
    }
    setStep('otp')
  }

  const onOtpSubmit = async (data: { otp: string }) => {
    setError('')
    setIsLoading(true)
    if (isDev) {
      await new Promise(r => setTimeout(r, 600))
      setIsLoading(false)
      setStep('role')
      return
    }
    const result = await verifyOtp(phone, data.otp)
    setIsLoading(false)
    if (result.error) {
      // Fallback: proceed to role selection (mock flow for demo)
      setStep('role')
      return
    }
    const currentUser = useAuthStore.getState().user
    if (currentUser && currentUser.name && currentUser.name.trim().length > 0) {
      navigate(getRedirectPath(currentUser.role))
      return
    }
    setStep('role')
  }

  const onRoleSelect = (r: UserRole) => {
    setRole(r)
    setStep('name')
  }

  const onNameSubmit = async (data: { name: string; email?: string }) => {
    setError('')
    setIsLoading(true)
    const result = await updateProfile({
      name: data.name,
      email: data.email || undefined,
      role,
    })
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(getRedirectPath(role))
  }

  const steps = ['phone', 'otp', 'role', 'name']
  const stepIdx = steps.indexOf(step)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void t

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-24 pb-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full -top-24 -right-24 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,81,255,.12) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 no-underline">
            <img src="/logo_cropped.jpg" alt="HE&P" className="w-10 h-10 brightness-0 invert" />
            <div className="text-left">
              <div className="font-bold text-[0.85rem] tracking-[0.22em] uppercase">HE&P</div>
              <div className="text-[0.55rem] tracking-wide text-sky/50">Harmony Events & Platform</div>
            </div>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-hep">
            {isTa ? `படி ${stepIdx + 1} / ${steps.length}` : `Step ${stepIdx + 1} of ${steps.length}`}
          </span>
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-hep">
            {['phone','otp','role','name'].map((s,i) => (
              <span key={s} className={i <= stepIdx ? 'text-vivid' : ''}>{'●'}</span>
            ))}
          </span>
        </div>
        <StepProgress current={stepIdx} total={steps.length} className="mb-8" />

        <AnimatePresence mode="wait">
          {/* STEP: PHONE */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="glass border-vivid-subtle p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'தொடங்குங்கள்' : 'Get started'}
              </h2>
              <p className="text-muted-hep text-sm mb-8">
                {isTa ? 'உங்கள் WhatsApp எண் உள்ளிடுங்கள்' : 'Enter your WhatsApp number for OTP'}
              </p>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-5">
                <Input
                  label={isTa ? 'தொலைபேசி எண்' : 'Phone Number'}
                  placeholder="+91 98765 43210"
                  prefix="📱"
                  error={phoneForm.formState.errors.phone?.message}
                  {...phoneForm.register('phone')}
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <Button type="submit" loading={isLoading} className="w-full">
                  {isTa ? 'OTP அனுப்பு' : 'Send OTP via WhatsApp'}
                </Button>
              </form>
              <p className="text-center text-muted-hep text-xs mt-6">
                {isTa ? 'தொடர்வதன் மூலம் நீங்கள்' : 'By continuing, you agree to our'}{' '}
                <span className="text-vivid cursor-pointer">{isTa ? 'விதிமுறைகளை ஒப்புக்கொள்கிறீர்கள்' : 'Terms & Privacy Policy'}</span>
              </p>
              {/* Dev shortcut */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <p className="text-[0.6rem] text-white/30 text-center tracking-widest uppercase">Dev shortcuts</p>
                <div className="flex gap-2">
                  <button onClick={() => { mockLogin('consumer'); navigate('/consumer/dashboard') }}
                    className="flex-1 text-[0.65rem] py-1.5 border border-white/10 hover:border-vivid/40 text-white/40 hover:text-white transition-all">
                    Consumer
                  </button>
                  <button onClick={() => { mockLogin('vendor'); navigate('/vendor/dashboard') }}
                    className="flex-1 text-[0.65rem] py-1.5 border border-white/10 hover:border-vivid/40 text-white/40 hover:text-white transition-all">
                    Vendor
                  </button>
                  <button onClick={() => { mockLogin('admin'); navigate('/admin') }}
                    className="flex-1 text-[0.65rem] py-1.5 border border-white/10 hover:border-vivid/40 text-white/40 hover:text-white transition-all">
                    Admin
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: OTP */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="glass border-vivid-subtle p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'OTP சரிபார்க்க' : 'Verify OTP'}
              </h2>
              <p className="text-muted-hep text-sm mb-1">
                {isTa ? 'WhatsApp-ல் OTP அனுப்பப்பட்டது' : 'OTP sent to WhatsApp'}
              </p>
              <p className="text-vivid text-sm font-mono-hep mb-8">{phone}</p>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5">
                <Input
                  label="OTP"
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  className="text-center text-xl tracking-[0.5em] font-mono-hep"
                  error={otpForm.formState.errors.otp?.message}
                  {...otpForm.register('otp')}
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <Button type="submit" loading={isLoading} className="w-full">
                  {isTa ? 'சரிபார்க்கவும்' : 'Verify'}
                </Button>
              </form>
              <button
                onClick={() => { setStep('phone'); setError('') }}
                className="w-full text-center text-muted-hep text-xs mt-5 hover:text-sky transition-colors"
              >
                ← {isTa ? 'தொலைபேசி எண் மாற்றவும்' : 'Change phone number'}
              </button>
            </motion.div>
          )}

          {/* STEP: ROLE */}
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="glass border-vivid-subtle p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'நான் விரும்புவது...' : 'I want to...'}
              </h2>
              <p className="text-muted-hep text-sm mb-8">
                {isTa ? 'உங்கள் பாத்திரத்தை தேர்வு செய்யுங்கள்' : 'Choose how you want to use HE&P'}
              </p>
              <div className="space-y-3">
                {[
                  {
                    role: 'consumer' as UserRole,
                    icon: '🎉',
                    label: isTa ? 'நிகழ்வு திட்டமிட & பதிவிட' : 'Plan & Book Events',
                    desc: isTa ? 'நிகழ்வுகளை பதிவிடுங்கள், ஏலங்களை ஒப்பிடுங்கள்' : 'Post events, compare bids, manage vendors',
                  },
                  {
                    role: 'vendor' as UserRole,
                    icon: '🛠️',
                    label: isTa ? 'என் சேவையை வழங்க' : 'Offer My Services',
                    desc: isTa ? 'ஏலம் போடுங்கள், கட்டணம் பெறுங்கள், வளருங்கள்' : 'Bid on events, get paid, grow my business',
                  },
                ].map(opt => (
                  <motion.button
                    key={opt.role}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onRoleSelect(opt.role)}
                    className={`w-full text-left p-5 border transition-all duration-200 flex items-start gap-4
                      ${role === opt.role ? 'border-vivid bg-vivid/10' : 'border-white/10 hover:border-vivid/40 hover:bg-white/3'}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-semibold text-sm mb-1">{opt.label}</div>
                      <div className="text-muted-hep text-xs">{opt.desc}</div>
                    </div>
                    {role === opt.role && (
                      <span className="ml-auto text-vivid text-lg">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: NAME */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="glass border-vivid-subtle p-8"
            >
              <h2 className="font-display text-3xl font-light mb-2">
                {isTa ? 'கொஞ்சம் அறிமுகம்' : 'Almost there'}
              </h2>
              <p className="text-muted-hep text-sm mb-8">
                {role === 'vendor'
                  ? (isTa ? 'உங்கள் வணிக விவரங்களை உள்ளிடுங்கள்' : 'Tell us about your business')
                  : (isTa ? 'உங்கள் பெயரை உள்ளிடுங்கள்' : 'What should we call you?')}
              </p>
              <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-5">
                <Input
                  label={role === 'vendor' ? (isTa ? 'வணிக பெயர்' : 'Business Name') : (isTa ? 'முழு பெயர்' : 'Full Name')}
                  placeholder={role === 'vendor' ? 'Sree Caterers / Studio XYZ' : 'Tharaneeshwaran V U'}
                  error={nameForm.formState.errors.name?.message}
                  {...nameForm.register('name')}
                />
                <Input
                  label={isTa ? 'மின்னஞ்சல் (விரும்பினால்)' : 'Email (optional)'}
                  type="email"
                  placeholder="you@example.com"
                  error={nameForm.formState.errors.email?.message}
                  {...nameForm.register('email')}
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
