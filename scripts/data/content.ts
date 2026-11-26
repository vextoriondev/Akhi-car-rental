/**
 * Starting website copy, imported once and then edited in the admin panel.
 * Deliberately free of statistics, reviews, guarantees and amenities that the
 * business has not confirmed.
 */
type L = { en: string; bn: string }
const l = (en: string, bn: string): L => ({ en, bn })

export const SERVICES: {
  slug: string
  type: 'daily' | 'monthly' | 'corporate' | 'airport' | 'wedding' | 'tour'
  icon: string
  title: L
  summary: L
  description: L
  highlights: L[]
  photo?: string
  categories: string[]
}[] = [
  {
    slug: 'daily-rental', type: 'daily', icon: '🚗', photo: 'harrier-1.jpg',
    categories: ['sedan', 'suv', 'microbus', 'luxury'],
    title: l('Daily Car Rental', 'দৈনিক কার রেন্টাল'),
    summary: l('Rent a car by the day for meetings, errands and family outings.', 'মিটিং, কাজ বা পারিবারিক ঘোরাঘুরির জন্য দিন হিসেবে গাড়ি ভাড়া।'),
    description: l('Choose a vehicle from the fleet and tell us your date and route. The daily fare may vary according to distance; we confirm the final fare before you book.', 'গাড়ি বেছে নিয়ে তারিখ ও রুট জানান। দূরত্ব অনুযায়ী দৈনিক ভাড়া পরিবর্তিত হতে পারে; বুকিংয়ের আগে চূড়ান্ত ভাড়া জানানো হয়।'),
    highlights: [l('Published daily fares for many models', 'অনেক মডেলের দৈনিক ভাড়া প্রকাশিত'), l('Sedans, SUVs, microbuses and luxury cars', 'সেডান, এসইউভি, মাইক্রোবাস ও লাক্সারি গাড়ি'), l('Booking by WhatsApp or online request', 'হোয়াটসঅ্যাপ বা অনলাইন অনুরোধে বুকিং')],
  },
  {
    slug: 'monthly-rental', type: 'monthly', icon: '📅', photo: 'x-trail-1.jpg',
    categories: ['sedan', 'suv', 'microbus', 'pickup'],
    title: l('Monthly Car Rental', 'মাসিক কার রেন্টাল'),
    summary: l('Keep a vehicle for the month at a monthly fare.', 'মাসিক ভাড়ায় পুরো মাসের জন্য গাড়ি।'),
    description: l('A practical option for regular commuting, families and businesses. Tell us how you will use the vehicle and we will confirm the monthly terms.', 'নিয়মিত যাতায়াত, পরিবার ও ব্যবসার জন্য সুবিধাজনক। গাড়ি কীভাবে ব্যবহার করবেন জানান, আমরা মাসিক শর্ত নিশ্চিত করব।'),
    highlights: [l('Published monthly fares for many models', 'অনেক মডেলের মাসিক ভাড়া প্রকাশিত'), l('Cars, microbuses, SUVs and double cabin pickups', 'কার, মাইক্রোবাস, এসইউভি ও ডাবল কেবিন পিকআপ'), l('Terms confirmed before you start', 'শুরুর আগেই শর্ত নিশ্চিত করা হয়')],
  },
  {
    slug: 'corporate-contract', type: 'corporate', icon: '🏢', photo: 'prado-8.jpg',
    categories: ['sedan', 'suv', 'microbus', 'luxury', 'pickup'],
    title: l('Corporate Rental', 'কর্পোরেট রেন্টাল'),
    summary: l('Vehicles for companies and organisations.', 'কোম্পানি ও প্রতিষ্ঠানের জন্য গাড়ি।'),
    description: l('Tell us how many vehicles you need, for how long and where they will operate. We will respond with a quotation.', 'কয়টি গাড়ি, কতদিন এবং কোথায় চলবে জানান। আমরা কোটেশন পাঠাব।'),
    highlights: [l('Quotation based on your requirement', 'আপনার প্রয়োজন অনুযায়ী কোটেশন'), l('Choice of vehicle types', 'বিভিন্ন ধরনের গাড়ি'), l('Short or long term enquiries welcome', 'স্বল্প বা দীর্ঘমেয়াদি অনুসন্ধান')],
  },
  {
    slug: 'airport-transfer', type: 'airport', icon: '✈️', photo: 'mercedes-s-class-1.jpg',
    categories: ['sedan', 'suv', 'microbus', 'luxury'],
    title: l('Airport Transfer', 'এয়ারপোর্ট ট্রান্সফার'),
    summary: l('Pick-up and drop-off for Dhaka airport journeys.', 'ঢাকা বিমানবন্দরে পিকআপ ও ড্রপ।'),
    description: l('Send your flight date, time and address, and choose a vehicle that fits your passengers and luggage.', 'ফ্লাইটের তারিখ, সময় ও ঠিকানা পাঠান এবং যাত্রী ও লাগেজ অনুযায়ী গাড়ি বেছে নিন।'),
    highlights: [l('Pick-up or drop-off', 'পিকআপ বা ড্রপ'), l('Vehicles for individuals and groups', 'একক ও দলগত যাত্রার গাড়ি'), l('Fare confirmed in advance', 'আগেই ভাড়া নিশ্চিত')],
  },
  {
    slug: 'wedding-events', type: 'wedding', icon: '💍', photo: 'mercedes-c-class-1.jpg',
    categories: ['luxury', 'suv', 'microbus'],
    title: l('Wedding & Event Cars', 'বিয়ে ও ইভেন্টের গাড়ি'),
    summary: l('Luxury cars for weddings and special occasions.', 'বিয়ে ও বিশেষ অনুষ্ঠানের জন্য লাক্সারি গাড়ি।'),
    description: l('Pick a car for the couple and extra vehicles for guests. Ask us about floral decoration when you enquire.', 'বর-কনের জন্য গাড়ি ও অতিথিদের জন্য অতিরিক্ত গাড়ি বেছে নিন। ফুলের সাজসজ্জা সম্পর্কে জিজ্ঞাসা করুন।'),
    highlights: [l('Mercedes-Benz, BMW and SUVs', 'মার্সিডিজ-বেঞ্জ, বিএমডব্লিউ ও এসইউভি'), l('Floral decoration on request', 'অনুরোধে ফুলের সাজসজ্জা'), l('Microbuses for guests', 'অতিথিদের জন্য মাইক্রোবাস')],
  },
  {
    slug: 'tours-outstation', type: 'tour', icon: '🏞️', photo: 'pajero-sport-1.jpg',
    categories: ['suv', 'microbus', 'sedan'],
    title: l('Tours & Outstation Trips', 'ট্যুর ও দূরপাল্লার ভ্রমণ'),
    summary: l('Travel outside Dhaka with a vehicle suited to your group.', 'দলের উপযোগী গাড়িতে ঢাকার বাইরে ভ্রমণ।'),
    description: l('Share your destinations and travel dates. The fare depends on distance and duration, and is confirmed before the trip.', 'গন্তব্য ও ভ্রমণের তারিখ জানান। দূরত্ব ও সময় অনুযায়ী ভাড়া ভ্রমণের আগেই নিশ্চিত করা হয়।'),
    highlights: [l('Microbuses for families and groups', 'পরিবার ও দলের জন্য মাইক্রোবাস'), l('SUVs for longer routes', 'দীর্ঘ পথের জন্য এসইউভি'), l('Route-based quotation', 'রুট অনুযায়ী কোটেশন')],
  },
]

export const FACILITIES: { icon: string; title: L; text: L }[] = [
  { icon: '📅', title: l('Daily and monthly plans', 'দৈনিক ও মাসিক প্ল্যান'), text: l('Rent for a day or keep a vehicle for the whole month.', 'এক দিনের জন্য বা পুরো মাসের জন্য গাড়ি নিন।') },
  { icon: '🚙', title: l('A varied fleet', 'বিভিন্ন ধরনের গাড়ি'), text: l('Sedans, microbuses, SUVs, luxury cars and double cabin pickups.', 'সেডান, মাইক্রোবাস, এসইউভি, লাক্সারি কার ও ডাবল কেবিন পিকআপ।') },
  { icon: '💳', title: l('Fares you can compare', 'তুলনাযোগ্য ভাড়া'), text: l('Listed fares are shown by model year. Others are quoted on request.', 'মডেল বছর অনুযায়ী ভাড়া দেখানো হয়। বাকিগুলো অনুরোধে জানানো হয়।') },
  { icon: '💐', title: l('Wedding car decoration', 'বিয়ের গাড়ি সাজানো'), text: l('Ask about floral decoration for your wedding car.', 'বিয়ের গাড়িতে ফুলের সাজসজ্জা সম্পর্কে জিজ্ঞাসা করুন।') },
  { icon: '💬', title: l('WhatsApp booking', 'হোয়াটসঅ্যাপে বুকিং'), text: l('Message us with the vehicle and dates you need.', 'প্রয়োজনীয় গাড়ি ও তারিখ জানিয়ে মেসেজ দিন।') },
  { icon: '📝', title: l('Online quote requests', 'অনলাইনে কোটেশন'), text: l('Send your details through the website at any time.', 'যেকোনো সময় ওয়েবসাইট থেকে তথ্য পাঠান।') },
]

export const SLIDES: { photo: string; ctaLink: string; eyebrow: L; title: L; subtitle: L; ctaLabel: L }[] = [
  {
    photo: 'prado-1.jpg', ctaLink: '/fleet',
    eyebrow: l('Car rental in Dhaka', 'ঢাকায় কার রেন্টাল'),
    title: l('Arrive with presence.', 'আভিজাত্যের সাথে পৌঁছান।'),
    subtitle: l('Sedans, microbuses, SUVs and luxury cars on daily and monthly rental.', 'দৈনিক ও মাসিক ভাড়ায় সেডান, মাইক্রোবাস, এসইউভি ও লাক্সারি গাড়ি।'),
    ctaLabel: l('Explore the fleet', 'গাড়ি দেখুন'),
  },
  {
    photo: 'range-rover-1.jpg', ctaLink: '/services/wedding-events',
    eyebrow: l('Weddings and occasions', 'বিয়ে ও অনুষ্ঠান'),
    title: l('Make the day feel special.', 'বিশেষ দিনকে করুন স্মরণীয়।'),
    subtitle: l('Choose a luxury car for the moments that matter.', 'গুরুত্বপূর্ণ মুহূর্তের জন্য বেছে নিন লাক্সারি গাড়ি।'),
    ctaLabel: l('See wedding cars', 'বিয়ের গাড়ি দেখুন'),
  },
  {
    photo: 'mercedes-s-class-1.jpg', ctaLink: '/services/monthly-rental',
    eyebrow: l('Monthly rental', 'মাসিক রেন্টাল'),
    title: l('A car for every working day.', 'প্রতিটি কর্মদিবসের জন্য গাড়ি।'),
    subtitle: l('Compare monthly fares by model and model year.', 'মডেল ও বছর অনুযায়ী মাসিক ভাড়া তুলনা করুন।'),
    ctaLabel: l('View monthly rental', 'মাসিক রেন্টাল দেখুন'),
  },
]

export const ABOUT = {
  eyebrow: l('New Akhi Rent-a-Car', 'নিউ আখি রেন্ট-এ-কার'),
  title: l('Car rental from Mohakhali, Dhaka', 'মহাখালী, ঢাকা থেকে কার রেন্টাল'),
  text: l(
    'We rent cars, microbuses, SUVs, luxury cars and double cabin pickups on daily and monthly terms. Choose a vehicle, tell us your dates and route, and we will confirm availability and the fare.',
    'আমরা দৈনিক ও মাসিক ভাড়ায় কার, মাইক্রোবাস, এসইউভি, লাক্সারি গাড়ি ও ডাবল কেবিন পিকআপ দিই। গাড়ি বেছে নিয়ে তারিখ ও রুট জানান, আমরা প্রাপ্যতা ও ভাড়া নিশ্চিত করব।',
  ),
}

export const WHY_US: { icon: string; title: L; text: L }[] = [
  { icon: '🧾', title: l('Fares by model year', 'মডেল বছর অনুযায়ী ভাড়া'), text: l('Compare listed daily and monthly fares before you contact us.', 'যোগাযোগের আগেই দৈনিক ও মাসিক ভাড়া তুলনা করুন।') },
  { icon: '🚘', title: l('Choice for every need', 'প্রতিটি প্রয়োজনের গাড়ি'), text: l('From economical sedans to luxury cars and pickups.', 'সাশ্রয়ী সেডান থেকে লাক্সারি গাড়ি ও পিকআপ।') },
  { icon: '🤝', title: l('Terms agreed up front', 'আগেই শর্ত নির্ধারণ'), text: l('Availability, fare and conditions are confirmed when you book.', 'বুকিংয়ের সময় প্রাপ্যতা, ভাড়া ও শর্ত নিশ্চিত করা হয়।') },
  { icon: '📲', title: l('Easy to reach', 'সহজ যোগাযোগ'), text: l('Call, WhatsApp or use the quote form.', 'কল, হোয়াটসঅ্যাপ বা কোটেশন ফর্ম ব্যবহার করুন।') },
]

export const SETTINGS = {
  siteName: 'New Akhi Rent-a-Car',
  phone: '+880 1625-347735',
  whatsapp: '8801625347735',
  email: 'akhicarrental77@gmail.com',
  tagline: l('Daily and monthly car rental in Dhaka', 'ঢাকায় দৈনিক ও মাসিক কার রেন্টাল'),
  address: l('63, Mohakhali, Dhaka-1213, Bangladesh', '৬৩, মহাখালী, ঢাকা-১২১৩, বাংলাদেশ'),
  footerText: l(
    'Cars, microbuses, SUVs, luxury cars and pickups on daily and monthly rental.',
    'দৈনিক ও মাসিক ভাড়ায় কার, মাইক্রোবাস, এসইউভি, লাক্সারি গাড়ি ও পিকআপ।',
  ),
  metaTitle: l('New Akhi Rent-a-Car — Car Rental in Dhaka', 'নিউ আখি রেন্ট-এ-কার — ঢাকায় কার রেন্টাল'),
  metaDescription: l(
    'Rent a car in Dhaka: Toyota X-Noah, HiAce, Axio, Prado, Mercedes-Benz, BMW and double cabin pickups at daily and monthly fares.',
    'ঢাকায় গাড়ি ভাড়া: টয়োটা এক্স-নোয়া, হায়েস, অ্যাক্সিও, প্রাডো, মার্সিডিজ-বেঞ্জ, বিএমডব্লিউ ও ডাবল কেবিন পিকআপ — দৈনিক ও মাসিক ভাড়ায়।',
  ),
}
