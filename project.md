# HE&P — Harmony Events & Platform
## Living Project Log

**Company**: Harmony Events & Productions  
**GSTIN**: 33AAICH6273M1Z6  
**Founded by**: Tharaneeshwaran V U (Director & Co-Founder), IIT Madras  
**Location**: Chennai, Tamil Nadu 600 032  
**Contact**: reach.harmonyevents@gmail.com · +91 90252 34564

---

## What We're Building

HE&P (Harmony Events & Platform) — India's first end-to-end B2B/C2B event management PWA.  
A geo-intelligent, multilingual (Tamil/English), professionally facilitated bidding platform that connects event organizers (consumers) with verified vendors. Think: Uber for events.

**App codename**: `hep-app`  
**Monorepo root**: `/home/tharan/Documents/HEP/hep-app/`

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Fast, PWA-capable, ecosystem |
| Styling | Tailwind CSS v4 + brand tokens | Utility-first, matches brand identity |
| Animations | Framer Motion | Premium feel, page transitions |
| State | Zustand (client) + TanStack Query (server) | Minimal boilerplate, predictable |
| Forms | React Hook Form + Zod | Type-safe, performant |
| i18n | i18next + react-i18next | Tamil/English with namespace support |
| Backend/DB | Supabase | Managed PostgreSQL + Auth + Realtime + Storage |
| Payments | Razorpay Route (marketplace PA) | RBI-compliant, split settlements |
| Maps | Google Maps JS API + @vis.gl/react-google-maps | Geocoding, radius, Places |
| Notifications | Firebase Cloud Messaging + Supabase Realtime | Push + in-app |
| WhatsApp | MSG91 / Gupshup (stub for now) | OTP, event alerts, invoice delivery |
| PDF | PDFKit or react-pdf | Invoice + agreement generation |
| Monorepo | pnpm workspaces | Shared types/config across apps |

---

## RBI Compliance Note

HE&P does NOT act as an escrow provider. All payments flow through Razorpay (RBI-authorized Payment Aggregator). Razorpay Route splits payments: consumer → Razorpay → vendor (T+2 post-event, net of commission). This is standard marketplace PA model, fully legal under RBI PSS Act.

---

## Commission Structure

| Event Value | HE&P Commission |
|---|---|
| Up to ₹25,000 | 12% |
| ₹25,001 – ₹1,00,000 | 10% |
| ₹1,00,001 – ₹5,00,000 | 8% |
| ₹5,00,001 – ₹25,00,000 | 6% |
| Above ₹25,00,000 | 4% (negotiated) |

**First 3 months launch**: 0% commission for vendor acquisition.

---

## API Keys & Integration Status

| Service | Status | Key Location |
|---|---|---|
| Supabase | Stub — needs project URL + anon key | `.env.local` |
| Google Maps | Stub — needs API key | `.env.local` |
| Razorpay | Test mode — needs key_id + key_secret | `.env.local` (server only) |
| MSG91 (WhatsApp OTP) | Stub | `.env.local` (server only) |
| Firebase (Push) | Stub — needs firebase config | `.env.local` |

---

## Current State

**App is running at `http://localhost:5173`** (dev server)  
**Production build**: `pnpm build` → passes clean, outputs to `dist/`  
**PWA**: Service worker generated at `dist/sw.js`, manifest configured

### Pages Built
| Route | Status | Description |
|---|---|---|
| `/` | ✅ | Landing page — hero, how-it-works, pain points, CTAs |
| `/login` | ✅ | 4-step auth: phone OTP → verify → role → name |
| `/consumer/post` | ✅ | Post event: 4-step wizard with AI category suggestions |
| `/consumer/events` | ✅ | View events, compare bids with HE&P Fit Score |
| `/consumer/dashboard` | ✅ | Consumer dashboard with stats and quick actions |
| `/vendor/events` | ✅ | Browse nearby events, submit bid modal |
| `/vendor/dashboard` | ✅ | Vendor dashboard with earnings, reliability score |

### Components Built
- `Button`, `Card`, `Badge`, `Input/Textarea`, `Modal`, `Stars`, `SectionLabel` — all matching HE&P brand
- `Navbar` (responsive, sticky, lang toggle), `Footer`
- Brand Tailwind tokens in `index.css`
- Tamil/English i18n (`en.json`, `ta.json`)
- Mock data layer (`mock-data.ts`) for all entities
- Auth store (Zustand + persist) with `mockLogin()`

---

## Progress Log

### 2026-05-19
- [x] Brand analysis complete (harmony-events.html parsed)
- [x] Product plan written (full MVP v1 feature set)
- [x] Architecture decisions locked
- [x] project.md created
- [x] Monorepo scaffold complete (`hep-app/` with pnpm workspaces)
- [x] React + Vite + TypeScript PWA bootstrapped
- [x] Tailwind CSS v4 with HE&P brand tokens configured
- [x] All core dependencies installed (Framer Motion, React Query, Zustand, i18next, etc.)
- [x] Full design system built
- [x] Tamil + English i18n files created
- [x] All 7 app pages built and wired with React Router
- [x] Production build passes (PWA service worker generated)
- [x] Dev server running at localhost:5173

---

## Open Questions / Blockers

- [ ] Supabase project URL + anon key (user to provide when ready)
- [ ] Google Maps API key (user to provide; works in test mode with localhost restriction)
- [ ] Razorpay test credentials (user to provide from Razorpay dashboard)
- [ ] WhatsApp Business API provider preference (MSG91 vs Gupshup vs Meta direct)
- [ ] Domain name for PWA (to configure in manifest.json)

---

## Vendor Categories (MVP)

1. Catering & Food
2. Photography & Videography
3. Decoration & Florals
4. Entertainment (DJ, Live Band, MC/Anchor, Artist)
5. Audio/Visual/Stage Production
6. Venue Provider
7. Transportation & Logistics
8. Tent, Furniture & Equipment Rental
9. Security & Crowd Management
10. Event Coordination
11. Cake & Desserts
12. Invitation Design & Printing
13. Mehendi, Makeup & Styling

---

## Geo-Notification Tiers (on event post)

| Tier | Radius | Delay |
|---|---|---|
| 1 | 0–5 km | Instant |
| 2 | 5–15 km | +2 hours (if no Tier 1 bids) |
| 3 | 15–50 km | +6 hours |
| 4 | 50+ km | +12 hours (large events only) |
