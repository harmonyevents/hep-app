import type { EventType, VendorCategory } from '@/types'

export const EVENT_TYPES: { value: EventType; label: string; labelTa: string; icon: string }[] = [
  { value: 'wedding', label: 'Wedding', labelTa: 'திருமணம்', icon: '💍' },
  { value: 'birthday', label: 'Birthday', labelTa: 'பிறந்தநாள்', icon: '🎂' },
  { value: 'corporate', label: 'Corporate Event', labelTa: 'நிறுவன நிகழ்வு', icon: '🏢' },
  { value: 'baby_shower', label: 'Baby Shower', labelTa: 'குழந்தை வரவேற்பு', icon: '👶' },
  { value: 'housewarming', label: 'Housewarming', labelTa: 'இல்ல பிரவேசம்', icon: '🏠' },
  { value: 'college_fest', label: 'College Fest', labelTa: 'கல்லூரி விழா', icon: '🎓' },
  { value: 'product_launch', label: 'Product Launch', labelTa: 'தயாரிப்பு அறிமுகம்', icon: '🚀' },
  { value: 'conference', label: 'Conference', labelTa: 'மாநாடு', icon: '🎤' },
  { value: 'awards_night', label: 'Awards Night', labelTa: 'விருது விழா', icon: '🏆' },
  { value: 'team_outing', label: 'Team Outing', labelTa: 'குழு சுற்றுலா', icon: '🎉' },
  { value: 'other', label: 'Other', labelTa: 'மற்றவை', icon: '✨' },
]

export const VENDOR_CATEGORIES: { value: VendorCategory; label: string; labelTa: string; icon: string }[] = [
  { value: 'catering', label: 'Catering & Food', labelTa: 'உணவு சேவை', icon: '🍽️' },
  { value: 'photography', label: 'Photography & Video', labelTa: 'புகைப்படம் & வீடியோ', icon: '📸' },
  { value: 'decoration', label: 'Decoration & Florals', labelTa: 'அலங்காரம்', icon: '🌸' },
  { value: 'entertainment', label: 'Entertainment', labelTa: 'பொழுதுபோக்கு', icon: '🎵' },
  { value: 'av_production', label: 'Audio / Visual / Stage', labelTa: 'ஒலி / ஒளி / மேடை', icon: '🔊' },
  { value: 'venue', label: 'Venue', labelTa: 'இடம்', icon: '🏛️' },
  { value: 'transportation', label: 'Transportation', labelTa: 'போக்குவரத்து', icon: '🚗' },
  { value: 'equipment_rental', label: 'Equipment Rental', labelTa: 'உபகரண வாடகை', icon: '🪑' },
  { value: 'security', label: 'Security', labelTa: 'பாதுகாப்பு', icon: '🛡️' },
  { value: 'event_coordination', label: 'Event Coordination', labelTa: 'நிகழ்வு ஒருங்கிணைப்பு', icon: '📋' },
  { value: 'cake_desserts', label: 'Cake & Desserts', labelTa: 'கேக் & இனிப்புகள்', icon: '🎂' },
  { value: 'invitation_design', label: 'Invitation Design', labelTa: 'அழைப்பிதழ் வடிவமைப்பு', icon: '✉️' },
  { value: 'makeup_styling', label: 'Mehendi, Makeup & Styling', labelTa: 'மேக்கப் & ஸ்டைலிங்', icon: '💄' },
]

export const AI_SUGGESTIONS: Record<string, VendorCategory[]> = {
  wedding: ['catering', 'photography', 'decoration', 'entertainment', 'av_production', 'transportation', 'makeup_styling', 'cake_desserts', 'invitation_design'],
  birthday: ['catering', 'photography', 'decoration', 'entertainment', 'cake_desserts'],
  corporate: ['catering', 'photography', 'av_production', 'decoration', 'event_coordination'],
  baby_shower: ['catering', 'photography', 'decoration', 'cake_desserts'],
  housewarming: ['catering', 'decoration', 'entertainment'],
  college_fest: ['av_production', 'entertainment', 'catering', 'decoration', 'photography', 'security'],
  product_launch: ['av_production', 'photography', 'decoration', 'catering', 'event_coordination'],
  conference: ['av_production', 'catering', 'event_coordination', 'photography'],
  awards_night: ['av_production', 'decoration', 'catering', 'photography', 'entertainment', 'event_coordination'],
  team_outing: ['catering', 'entertainment', 'transportation'],
  other: ['event_coordination'],
}

export const COMMISSION_TIERS = [
  { max: 25000, rate: 0.12 },
  { max: 100000, rate: 0.10 },
  { max: 500000, rate: 0.08 },
  { max: 2500000, rate: 0.06 },
  { max: Infinity, rate: 0.04 },
]

export function calcCommission(amount: number): number {
  const tier = COMMISSION_TIERS.find(t => amount <= t.max)!
  return Math.round(amount * tier.rate)
}

export const GEO_TIERS = [
  { radius: 5, delayHours: 0 },
  { radius: 15, delayHours: 2 },
  { radius: 50, delayHours: 6 },
  { radius: 999, delayHours: 12 },
]
