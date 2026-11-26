/**
 * Source data for the one-time database import (npm run seed). The website never
 * reads this file. Rates and model years come from the client's "Fair Quotation" sheet,
 * photos (./photos) were supplied by the client.
 *
 * - No price = shown as "Price on Request" (photographed or handwritten vehicles without a rate).
 * - No photos = a car illustration is shown until the client sends real pictures.
 * - Fuel is left out unless known (e.g. a hybrid badge in the photo).
 */
type L = { en: string; bn: string }

export type FleetCar = {
  slug: string
  brand: string
  category: 'sedan' | 'suv' | 'microbus' | 'luxury' | 'pickup'
  name: L
  yearRange?: string
  seats: number
  fuel?: 'hybrid'
  color?: L
  pricePerDay?: number
  pricePerMonth?: number
  featured?: boolean
  /** File names inside ./photos; the first one is the main photo */
  photos?: string[]
}

const series = (name: string, count: number) => Array.from({ length: count }, (_, i) => `${name}-${i + 1}.jpg`)

const noah: L = { en: 'Toyota X-Noah', bn: 'টয়োটা এক্স-নোয়া' }
const hiace: L = { en: 'Toyota HiAce', bn: 'টয়োটা হায়েস' }
const axio: L = { en: 'Toyota Axio', bn: 'টয়োটা অ্যাক্সিও' }
const prado: L = { en: 'Toyota Land Cruiser Prado', bn: 'টয়োটা ল্যান্ড ক্রুজার প্রাডো' }
const allion: L = { en: 'Toyota Allion / F-Premio', bn: 'টয়োটা অ্যালিয়ন / এফ-প্রিমিও' }
const pickup: L = { en: 'Double Cabin Pickup', bn: 'ডাবল কেবিন পিকআপ' }
const white: L = { en: 'White', bn: 'সাদা' }
const black: L = { en: 'Black', bn: 'কালো' }

/** Listed in display order, grouped by brand */
export const FLEET: FleetCar[] = [
  // Toyota
  { slug: 'toyota-land-cruiser-prado-2013-2022', brand: 'Toyota', category: 'suv', name: prado, yearRange: '2013–2022', seats: 7, color: { en: 'Black / White', bn: 'কালো / সাদা' }, pricePerDay: 16000, pricePerMonth: 250000, featured: true, photos: series('prado', 13) },
  { slug: 'toyota-land-cruiser-prado-2010-2012', brand: 'Toyota', category: 'suv', name: prado, yearRange: '2010–2012', seats: 7, pricePerDay: 14000, pricePerMonth: 230000 },
  { slug: 'toyota-land-cruiser-prado-2005-2007', brand: 'Toyota', category: 'suv', name: prado, yearRange: '2005–2007', seats: 7, pricePerDay: 10000, pricePerMonth: 140000 },
  { slug: 'toyota-harrier', brand: 'Toyota', category: 'suv', name: { en: 'Toyota Harrier', bn: 'টয়োটা হ্যারিয়ার' }, seats: 5, color: white, featured: true, photos: series('harrier', 2) },
  { slug: 'toyota-x-noah-2010-2013', brand: 'Toyota', category: 'microbus', name: noah, yearRange: '2010–2013', seats: 7, pricePerDay: 3500, pricePerMonth: 67000 },
  { slug: 'toyota-x-noah-2018-2020', brand: 'Toyota', category: 'microbus', name: noah, yearRange: '2018–2020', seats: 7, pricePerDay: 4000, pricePerMonth: 72000 },
  { slug: 'toyota-x-noah-esquire-2021-2022', brand: 'Toyota', category: 'microbus', name: { en: 'Toyota X-Noah / Esquire', bn: 'টয়োটা এক্স-নোয়া / এস্কোয়ার' }, yearRange: '2021–2022', seats: 7 },
  { slug: 'toyota-x-noah-voxy-2023', brand: 'Toyota', category: 'microbus', name: { en: 'Toyota X-Noah / Voxy', bn: 'টয়োটা এক্স-নোয়া / ভক্সি' }, yearRange: '2023', seats: 7 },
  { slug: 'toyota-hiace-2016-2018', brand: 'Toyota', category: 'microbus', name: hiace, yearRange: '2016–2018', seats: 11, pricePerDay: 3500, pricePerMonth: 65000 },
  { slug: 'toyota-hiace-2019-2022', brand: 'Toyota', category: 'microbus', name: hiace, yearRange: '2019–2022', seats: 11, pricePerDay: 4000, pricePerMonth: 70000 },
  { slug: 'toyota-axio-2010-2012', brand: 'Toyota', category: 'sedan', name: axio, yearRange: '2010–2012', seats: 4, pricePerDay: 2500, pricePerMonth: 45000 },
  { slug: 'toyota-axio-2013-2014', brand: 'Toyota', category: 'sedan', name: axio, yearRange: '2013–2014', seats: 4, pricePerDay: 3000, pricePerMonth: 55000 },
  { slug: 'toyota-axio-2016-2018', brand: 'Toyota', category: 'sedan', name: axio, yearRange: '2016–2018', seats: 4 },
  { slug: 'toyota-allion-premio-2010-2012', brand: 'Toyota', category: 'sedan', name: allion, yearRange: '2010–2012', seats: 4, pricePerDay: 3500, pricePerMonth: 65000 },
  { slug: 'toyota-allion-premio-2013-2015', brand: 'Toyota', category: 'sedan', name: allion, yearRange: '2013–2015', seats: 4, pricePerDay: 4000, pricePerMonth: 72000 },
  { slug: 'toyota-f-premio-2018-2020', brand: 'Toyota', category: 'sedan', name: { en: 'Toyota F-Premio', bn: 'টয়োটা এফ-প্রিমিও' }, yearRange: '2018–2020', seats: 4 },

  // Mercedes-Benz
  { slug: 'mercedes-benz-e250', brand: 'Mercedes-Benz', category: 'luxury', name: { en: 'Mercedes-Benz E250', bn: 'মার্সিডিজ-বেঞ্জ ই২৫০' }, yearRange: '2010–2012', seats: 4, color: white, pricePerDay: 30000, featured: true, photos: series('mercedes-e250', 2) },
  { slug: 'mercedes-benz-s-class', brand: 'Mercedes-Benz', category: 'luxury', name: { en: 'Mercedes-Benz S-Class', bn: 'মার্সিডিজ-বেঞ্জ এস-ক্লাস' }, seats: 4, color: black, featured: true, photos: series('mercedes-s-class', 1) },
  { slug: 'mercedes-benz-c-class', brand: 'Mercedes-Benz', category: 'luxury', name: { en: 'Mercedes-Benz C-Class', bn: 'মার্সিডিজ-বেঞ্জ সি-ক্লাস' }, seats: 4, color: white, photos: series('mercedes-c-class', 1) },

  // BMW & Audi
  { slug: 'bmw-5-series', brand: 'BMW', category: 'luxury', name: { en: 'BMW 5 Series', bn: 'বিএমডব্লিউ ৫ সিরিজ' }, seats: 4, color: black, pricePerDay: 38000, featured: true, photos: series('bmw-5-series', 4) },
  { slug: 'audi', brand: 'Audi', category: 'luxury', name: { en: 'Audi', bn: 'অডি' }, seats: 4, pricePerDay: 38000 },

  // Land Rover
  { slug: 'range-rover', brand: 'Land Rover', category: 'luxury', name: { en: 'Range Rover', bn: 'রেঞ্জ রোভার' }, seats: 5, fuel: 'hybrid', color: { en: 'Dark Blue', bn: 'গাঢ় নীল' }, featured: true, photos: series('range-rover', 3) },

  // Nissan
  { slug: 'nissan-x-trail', brand: 'Nissan', category: 'suv', name: { en: 'Nissan X-Trail Hybrid', bn: 'নিসান এক্স-ট্রেইল হাইব্রিড' }, seats: 5, fuel: 'hybrid', color: { en: 'Silver', bn: 'সিলভার' }, photos: series('x-trail', 2) },

  // Mitsubishi
  { slug: 'mitsubishi-pajero-sport', brand: 'Mitsubishi', category: 'suv', name: { en: 'Mitsubishi Pajero Sport', bn: 'মিতসুবিশি পাজেরো স্পোর্ট' }, seats: 7, color: white, photos: series('pajero-sport', 3) },

  // Pickup (the sheet names no brand)
  { slug: 'double-cabin-pickup', brand: 'Pickup', category: 'pickup', name: pickup, seats: 5, pricePerMonth: 90000 },
  { slug: 'double-cabin-pickup-2015-2018', brand: 'Pickup', category: 'pickup', name: pickup, yearRange: '2015–2018', seats: 5, pricePerMonth: 110000 },
]


export const carDescription = (c: FleetCar): L => {
  const years = c.yearRange ? ` (${c.yearRange})` : ''
  return {
    en: `${c.name.en}${years} available for rent from New Akhi Rent-a-Car in Dhaka. Contact us to confirm availability.`,
    bn: `${c.name.bn}${years} — নিউ আখি রেন্ট-এ-কার থেকে ঢাকায় ভাড়া দেওয়া হয়। গাড়ি খালি আছে কিনা জানতে যোগাযোগ করুন।`,
  }
}
