/**
 * Loads the client's fleet, photos and starting website copy into the CMS.
 *
 *   npm run seed                  add whatever is missing (never overwrites admin edits)
 *   npm run seed -- --sync-media  re-upload the imported photos, e.g. after adding BLOB_READ_WRITE_TOKEN
 *
 * An admin account is created only when none exists and SEED_ADMIN_EMAIL and
 * SEED_ADMIN_PASSWORD are set.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
loadEnv()

import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { FLEET, carDescription } from './data/fleet'
import { ABOUT, FACILITIES, SERVICES, SETTINGS, SLIDES, WHY_US } from './data/content'

const photoPath = (file: string) => fileURLToPath(new URL(`./data/photos/${file}`, import.meta.url))
const syncMedia = process.argv.includes('--sync-media')

async function run() {
  if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set.')
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  const made = { media: 0, services: 0, cars: 0, facilities: 0, globals: 0 }

  const mediaIds = new Map<string, number>()
  async function media(file: string, alt: string, altBn: string): Promise<number> {
    const cached = mediaIds.get(file)
    if (cached) return cached
    if (!existsSync(photoPath(file))) throw new Error(`Missing photo: ${file}`)
    const found = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1 })
    let id = found.docs[0]?.id as number | undefined
    if (!id) {
      const doc = await payload.create({ collection: 'media', locale: 'en', data: { alt }, filePath: photoPath(file) })
      id = doc.id as number
      await payload.update({ collection: 'media', id, locale: 'bn', data: { alt: altBn } })
      made.media++
    } else if (syncMedia) {
      await payload.update({ collection: 'media', id, data: {}, filePath: photoPath(file), overwriteExistingFiles: true })
      made.media++
    }
    mediaIds.set(file, id)
    return id
  }

  if ((await payload.count({ collection: 'users' })).totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (email && password && password.length >= 12) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Super Admin', role: 'superadmin' } })
      console.log(`Admin account created for ${email}`)
    } else {
      console.log('No admin account yet: open /admin to create the first one.')
    }
  }

  const serviceIds = new Map<string, number>()
  for (const [i, s] of SERVICES.entries()) {
    const found = await payload.find({ collection: 'services', where: { slug: { equals: s.slug } }, limit: 1 })
    if (found.docs[0]) {
      serviceIds.set(s.slug, found.docs[0].id as number)
      if (syncMedia && s.photo) await media(s.photo, s.title.en, s.title.bn)
      continue
    }
    const doc = await payload.create({
      collection: 'services',
      locale: 'en',
      data: {
        slug: s.slug, type: s.type, icon: s.icon, order: i + 1, accent: 'gold',
        title: s.title.en, summary: s.summary.en, description: s.description.en,
        highlights: s.highlights.map((h) => ({ label: h.en })),
        image: s.photo ? await media(s.photo, s.title.en, s.title.bn) : undefined,
      },
    })
    await payload.update({
      collection: 'services', id: doc.id, locale: 'bn',
      data: {
        title: s.title.bn, summary: s.summary.bn, description: s.description.bn,
        highlights: (doc.highlights ?? []).map((h, n) => ({ id: h.id, label: s.highlights[n].bn })),
      },
    })
    serviceIds.set(s.slug, doc.id as number)
    made.services++
  }

  for (const [i, c] of FLEET.entries()) {
    const years = c.yearRange ? ` ${c.yearRange}` : ''
    const photos: number[] = []
    const addPhotos = async () => {
      for (const [n, file] of (c.photos ?? []).entries()) {
        photos.push(await media(file, `${c.name.en}${years} — photo ${n + 1}`, `${c.name.bn}${years} — ছবি ${n + 1}`))
      }
    }
    const found = await payload.find({ collection: 'cars', where: { slug: { equals: c.slug } }, limit: 1 })
    if (found.docs[0]) {
      if (syncMedia) await addPhotos()
      continue
    }
    await addPhotos()
    const desc = carDescription(c)
    const doc = await payload.create({
      collection: 'cars',
      locale: 'en',
      data: {
        slug: c.slug, brand: c.brand, category: c.category, accent: 'gold', yearRange: c.yearRange, seats: c.seats,
        luggage: null, transmission: null, fuel: c.fuel ?? null, color: c.color?.en,
        pricePerDay: c.pricePerDay ?? null, pricePerMonth: c.pricePerMonth ?? null,
        withDriver: true, available: true, featured: Boolean(c.featured), status: 'published', order: (i + 1) * 10,
        image: photos[0] ?? null,
        gallery: photos.slice(1).map((image) => ({ image })),
        name: c.name.en, description: desc.en,
        services: SERVICES.filter((s) => s.categories.includes(c.category)).map((s) => serviceIds.get(s.slug)!),
      },
    })
    await payload.update({ collection: 'cars', id: doc.id, locale: 'bn', data: { name: c.name.bn, description: desc.bn } })
    made.cars++
    console.log(`  + ${c.name.en}${years}`)
  }

  if ((await payload.count({ collection: 'facilities' })).totalDocs === 0) {
    for (const [i, f] of FACILITIES.entries()) {
      const doc = await payload.create({
        collection: 'facilities', locale: 'en',
        data: { icon: f.icon, accent: 'gold', order: i + 1, title: f.title.en, text: f.text.en },
      })
      await payload.update({ collection: 'facilities', id: doc.id, locale: 'bn', data: { title: f.title.bn, text: f.text.bn } })
      made.facilities++
    }
  }

  const home = await payload.findGlobal({ slug: 'home' })
  if (!home.slides?.length) {
    const images: number[] = []
    for (const s of SLIDES) images.push(await media(s.photo, s.title.en, s.title.bn))
    const saved = await payload.updateGlobal({
      slug: 'home',
      locale: 'en',
      data: {
        slides: SLIDES.map((s, i) => ({
          eyebrow: s.eyebrow.en, title: s.title.en, subtitle: s.subtitle.en, ctaLabel: s.ctaLabel.en,
          ctaLink: s.ctaLink, theme: 'gold' as const, image: images[i],
        })),
        about: { eyebrow: ABOUT.eyebrow.en, title: ABOUT.title.en, text: ABOUT.text.en },
        stats: [],
        whyUs: WHY_US.map((w) => ({ icon: w.icon, title: w.title.en, text: w.text.en })),
      },
    })
    await payload.updateGlobal({
      slug: 'home',
      locale: 'bn',
      data: {
        slides: SLIDES.map((s, i) => ({
          id: saved.slides![i].id, eyebrow: s.eyebrow.bn, title: s.title.bn, subtitle: s.subtitle.bn,
          ctaLabel: s.ctaLabel.bn, ctaLink: s.ctaLink, theme: 'gold' as const, image: images[i],
        })),
        about: { eyebrow: ABOUT.eyebrow.bn, title: ABOUT.title.bn, text: ABOUT.text.bn },
        whyUs: WHY_US.map((w, i) => ({ id: saved.whyUs![i].id, icon: w.icon, title: w.title.bn, text: w.text.bn })),
      },
    })
    made.globals++
  } else if (syncMedia) {
    for (const s of SLIDES) await media(s.photo, s.title.en, s.title.bn)
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!(settings as { createdAt?: string }).createdAt) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'en',
      data: {
        siteName: SETTINGS.siteName, phone: SETTINGS.phone, whatsapp: SETTINGS.whatsapp, email: SETTINGS.email,
        tagline: SETTINGS.tagline.en, address: SETTINGS.address.en, footerText: SETTINGS.footerText.en,
        hours: '', socials: { facebook: '' },
        seo: { metaTitle: SETTINGS.metaTitle.en, metaDescription: SETTINGS.metaDescription.en },
      },
    })
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'bn',
      data: {
        tagline: SETTINGS.tagline.bn, address: SETTINGS.address.bn, footerText: SETTINGS.footerText.bn,
        seo: { metaTitle: SETTINGS.metaTitle.bn, metaDescription: SETTINGS.metaDescription.bn },
      },
    })
    made.globals++
  }

  console.log('Import complete:', made)
}

// Keeps Node alive while a promise is pending, so a stalled step can never exit as if it had succeeded.
setInterval(() => {}, 1000)

run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
