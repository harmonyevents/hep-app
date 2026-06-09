import { Suspense, lazy, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toast'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { useAuthStore } from '@/store/auth'
import '@/i18n'

const LandingPage          = lazy(() => import('@/pages/shared/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage            = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const PostEventPage        = lazy(() => import('@/pages/consumer/PostEventPage').then(m => ({ default: m.PostEventPage })))
const ConsumerEventsPage   = lazy(() => import('@/pages/consumer/ConsumerEventsPage').then(m => ({ default: m.ConsumerEventsPage })))
const ConsumerDashboardPage= lazy(() => import('@/pages/consumer/ConsumerDashboardPage').then(m => ({ default: m.ConsumerDashboardPage })))
const VendorEventsPage     = lazy(() => import('@/pages/vendor/VendorEventsPage').then(m => ({ default: m.VendorEventsPage })))
const VendorDashboardPage  = lazy(() => import('@/pages/vendor/VendorDashboardPage').then(m => ({ default: m.VendorDashboardPage })))
const VendorProfileSetupPage= lazy(() => import('@/pages/vendor/VendorProfileSetupPage').then(m => ({ default: m.VendorProfileSetupPage })))
const VendorBidsPage       = lazy(() => import('@/pages/vendor/VendorBidsPage').then(m => ({ default: m.VendorBidsPage })))
const AdminDashboardPage   = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const PaymentPage          = lazy(() => import('@/pages/shared/PaymentPage').then(m => ({ default: m.PaymentPage })))
const NotificationsPage    = lazy(() => import('@/pages/shared/NotificationsPage').then(m => ({ default: m.NotificationsPage })))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2, retry: 1 } },
})

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 text-center">
          <div>
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-error mb-4">Something went wrong</p>
            <p className="text-muted-hep text-sm mb-6">{(this.state.error as Error).message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="text-[0.68rem] tracking-widest uppercase text-vivid border border-vivid/30 px-5 py-2.5 hover:bg-vivid/10 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-vivid border-t-transparent rounded-full"
      />
    </div>
  )
}

function RequireAuth({ children, role }: { children: ReactNode; role?: string }) {
  const { user } = useAuthStore()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppLayout({ children, showFooter = true }: { children: ReactNode; showFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
                <Route path="/login" element={<AppLayout showFooter={false}><LoginPage /></AppLayout>} />

                <Route path="/consumer/post" element={<RequireAuth role="consumer"><AppLayout showFooter={false}><PostEventPage /></AppLayout></RequireAuth>} />
                <Route path="/consumer/events" element={<RequireAuth role="consumer"><AppLayout><ConsumerEventsPage /></AppLayout></RequireAuth>} />
                <Route path="/consumer/dashboard" element={<RequireAuth role="consumer"><AppLayout><ConsumerDashboardPage /></AppLayout></RequireAuth>} />

                <Route path="/vendor/events" element={<RequireAuth role="vendor"><AppLayout><VendorEventsPage /></AppLayout></RequireAuth>} />
                <Route path="/vendor/dashboard" element={<RequireAuth role="vendor"><AppLayout><VendorDashboardPage /></AppLayout></RequireAuth>} />
                <Route path="/vendor/bids" element={<RequireAuth role="vendor"><AppLayout><VendorBidsPage /></AppLayout></RequireAuth>} />
                <Route path="/vendor/profile/setup" element={<RequireAuth role="vendor"><AppLayout showFooter={false}><VendorProfileSetupPage /></AppLayout></RequireAuth>} />

                <Route path="/admin" element={<RequireAuth role="admin"><AppLayout><AdminDashboardPage /></AppLayout></RequireAuth>} />

                <Route path="/payment/:bookingId" element={<RequireAuth><AppLayout showFooter={false}><PaymentPage /></AppLayout></RequireAuth>} />
                <Route path="/notifications" element={<RequireAuth><AppLayout showFooter={false}><NotificationsPage /></AppLayout></RequireAuth>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(10,45,77,0.95)',
              border: '1px solid rgba(34,81,255,0.2)',
              color: '#EAF0F8',
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.82rem',
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
