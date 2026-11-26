/**
 * End-to-end test of the admin CMS against a running site:
 *   BASE_URL=http://localhost:3000 npm run test:cms
 *
 * It WRITES to the database in .env.local: temporary accounts, one vehicle and one
 * photo, all removed again at the end. The running site must use the same database.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
process.env.PAYLOAD_PUSH = 'false'

import { randomBytes } from 'crypto'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const stamp = Date.now()
const slug = `zz-test-vehicle-${stamp}`
let passed = 0
const failures: string[] = []
const check = (ok: unknown, label: string) => {
  if (ok) passed++
  else failures.push(label)
}

async function api(path: string, token?: string, init: RequestInit = {}) {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) }
  if (token) headers.Authorization = `JWT ${token}`
  if (typeof init.body === 'string') headers['content-type'] = 'application/json'
  const res = await fetch(BASE + path, { ...init, headers })
  const body: any = await res.json().catch(() => ({}))
  return { status: res.status, body }
}
const json = (method: string, data: unknown): RequestInit => ({ method, body: JSON.stringify(data) })
const page = async (path: string) => {
  const res = await fetch(BASE + path)
  return { status: res.status, html: await res.text() }
}

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  const totals = async () =>
    Object.fromEntries(
      await Promise.all(
        (['users', 'cars', 'media', 'inquiries'] as const).map(async (c) => [c, (await payload.count({ collection: c })).totalDocs]),
      ),
    )
  const before = await totals()
  const userIds: number[] = []
  let carId: number | undefined
  let mediaId: number | undefined
  let mediaFile = ''
  let originalHours: string | null | undefined
  let adminToken = ''

  try {
    const login = async (role: 'superadmin' | 'editor') => {
      const email = `zz-test-${role}-${stamp}@example.invalid`
      const password = randomBytes(24).toString('base64url')
      const user = await payload.create({ collection: 'users', data: { email, password, role, name: 'Temporary test user' } })
      userIds.push(user.id as number)
      const res = await api('/api/users/login', undefined, json('POST', { email, password }))
      check(res.status === 200 && res.body.token, `${role} can log in (${res.status})`)
      return { token: res.body.token as string, id: user.id as number }
    }
    const admin = await login('superadmin')
    const editor = await login('editor')
    adminToken = admin.token

    const first = await api('/api/users/first-register', undefined, json('POST', { email: `zz-intruder-${stamp}@example.invalid`, password: randomBytes(24).toString('base64url'), name: 'x', role: 'superadmin' }))
    check(first.status >= 400, `first-user registration is closed once users exist (${first.status})`)
    check((await api('/api/users/login', undefined, json('POST', { email: 'nobody@example.invalid', password: 'wrong-password' }))).status === 401, 'wrong credentials rejected')

    // ---- editor permissions
    check((await api('/api/users', editor.token, json('POST', { email: `zz-x-${stamp}@example.invalid`, password: randomBytes(24).toString('base64url'), name: 'x', role: 'superadmin' }))).status === 403, 'editor cannot create users')
    await api(`/api/users/${editor.id}`, editor.token, json('PATCH', { role: 'superadmin' }))
    check((await payload.findByID({ collection: 'users', id: editor.id })).role === 'editor', 'editor cannot promote themselves')
    check((await api(`/api/users/${admin.id}`, editor.token, { method: 'DELETE' })).status === 403, 'editor cannot delete users')

    // ---- photo upload
    const form = new FormData()
    const file = readFileSync(fileURLToPath(new URL('./data/photos/x-trail-2.jpg', import.meta.url)))
    form.append('file', new Blob([new Uint8Array(file)], { type: 'image/jpeg' }), `zz-test-${stamp}.jpg`)
    form.append('_payload', JSON.stringify({ alt: 'Temporary test photo' }))
    const up = await api('/api/media', editor.token, { method: 'POST', body: form })
    check(up.status === 201, `upload photo (${up.status})`)
    mediaId = up.body.doc?.id
    mediaFile = up.body.doc?.url ?? ''
    check(mediaFile.startsWith('/') || mediaFile.includes('blob.vercel-storage.com'), `photo address works on any host: ${mediaFile}`)
    check(up.body.doc?.sizes?.card?.url, 'resized versions generated')
    check((await fetch(new URL(mediaFile, BASE))).ok, 'uploaded photo is served')

    const svg = new FormData()
    svg.append('file', new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], { type: 'image/svg+xml' }), `zz-${stamp}.svg`)
    const badUpload = await api('/api/media', editor.token, { method: 'POST', body: svg })
    check(badUpload.status >= 400, `SVG upload rejected (${badUpload.status})`)

    // ---- create (draft): invisible to visitors
    const created = await api('/api/cars', editor.token, json('POST', { name: 'ZZ Test Vehicle', slug, brand: 'ZZTest', category: 'sedan', seats: 4, pricePerDay: 1234, status: 'draft', image: mediaId }))
    check(created.status === 201, `create vehicle (${created.status} ${JSON.stringify(created.body.errors ?? '')})`)
    carId = created.body.doc?.id
    check((await api(`/api/cars?where[slug][equals]=${slug}`)).body.totalDocs === 0, 'draft hidden from public API')
    check((await api(`/api/cars/${carId}`)).status >= 403, 'draft not readable by id')
    check((await page(`/en/fleet/${slug}`)).status === 404, 'draft has no public page')
    check(!(await page('/en/fleet')).html.includes('ZZ Test Vehicle'), 'draft not listed')

    const negative = await api(`/api/cars/${carId}`, editor.token, json('PATCH', { pricePerDay: -5 }))
    check(negative.status === 400, `negative fare rejected (${negative.status})`)
    const duplicate = await api('/api/cars', editor.token, json('POST', { name: 'Dup', slug, brand: 'x', category: 'sedan', seats: 4 }))
    check(duplicate.status === 400, `duplicate web address rejected (${duplicate.status})`)

    // ---- publish and edit: visible immediately
    await page('/en/fleet') // warm the cache so the next check proves it is expired
    check((await api(`/api/cars/${carId}`, editor.token, json('PATCH', { status: 'published' }))).status === 200, 'publish vehicle')
    check((await page('/en/fleet')).html.includes('ZZ Test Vehicle'), 'published vehicle appears at once')
    let detail = await page(`/en/fleet/${slug}`)
    check(detail.status === 200 && detail.html.includes('৳1,234'), 'detail page shows fare')

    await api(`/api/cars/${carId}`, editor.token, json('PATCH', { pricePerDay: 4321, pricePerMonth: 150000, gallery: [{ image: mediaId }] }))
    detail = await page(`/en/fleet/${slug}`)
    check(detail.html.includes('৳4,321') && detail.html.includes('৳1,50,000') && !detail.html.includes('৳1,234'), 'fare change appears at once')

    await api(`/api/cars/${carId}`, editor.token, json('PATCH', { available: false }))
    check(/class="tag tag-off">Booked</.test((await page(`/en/fleet/${slug}`)).html), 'availability change shows “Booked”')

    await api(`/api/cars/${carId}?locale=bn`, editor.token, json('PATCH', { name: 'পরীক্ষামূলক গাড়ি' }))
    check((await page(`/bn/fleet/${slug}`)).html.includes('পরীক্ষামূলক গাড়ি'), 'Bangla content editable')
    check((await page(`/en/fleet/${slug}`)).html.includes('ZZ Test Vehicle'), 'English content unchanged')
    check((await page('/sitemap.xml')).html.includes(slug), 'sitemap includes new vehicle')

    // ---- a global edit
    originalHours = (await api('/api/globals/site-settings?locale=en')).body.hours ?? ''
    const marker = `Test hours ${stamp}`
    check((await api('/api/globals/site-settings?locale=en', editor.token, json('POST', { hours: marker }))).status === 200, 'update site settings')
    check((await page('/en/contact')).html.includes(marker), 'settings change appears at once')

    // ---- delete
    check((await api(`/api/cars/${carId}`, editor.token, { method: 'DELETE' })).status === 200, 'delete vehicle')
    carId = undefined
    check((await page(`/en/fleet/${slug}`)).status === 404, 'deleted vehicle page is gone')
    check(!(await page('/en/fleet')).html.includes('ZZ Test Vehicle'), 'deleted vehicle removed from list')
    check((await api(`/api/media/${mediaId}`, editor.token, { method: 'DELETE' })).status === 200, 'delete photo')
    mediaId = undefined
    check(!(await fetch(new URL(mediaFile, BASE))).ok, 'deleted photo no longer served')
  } finally {
    if (originalHours !== undefined) {
      await api('/api/globals/site-settings?locale=en', adminToken, json('POST', { hours: originalHours }))
    }
    if (carId) await payload.delete({ collection: 'cars', id: carId }).catch(console.error)
    if (mediaId) await payload.delete({ collection: 'media', id: mediaId }).catch(console.error)
    for (const id of userIds) await payload.delete({ collection: 'users', id }).catch(console.error)
    const after = await totals()
    check(JSON.stringify(after) === JSON.stringify(before), `database counts restored: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`)
    console.log('Record counts after cleanup:', after)
  }

  console.log(`\n${passed} checks passed, ${failures.length} failed`)
  for (const f of failures) console.log('  FAIL', f)
}

// Keeps Node alive while a promise is pending, so a stalled test can never exit as a pass.
setInterval(() => {}, 1000)

main().then(
  () => process.exit(failures.length ? 1 : 0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
