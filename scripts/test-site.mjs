// Read-only smoke test of a running site:  BASE_URL=http://localhost:3000 npm test
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
let passed = 0
const failures = []
const check = (ok, label) => (ok ? passed++ : failures.push(label))

const get = (path, init) => fetch(BASE + path, { redirect: 'manual', ...init })
const attr = (html, re) => html.match(re)?.[1]
const decode = (s) => s.replace(/&amp;/g, '&')

async function main() {
  const root = await get('/')
  check([307, 308].includes(root.status) && root.headers.get('location')?.endsWith('/en'), '/ redirects to /en')

  // ---- crawl every internal link, starting from both home pages
  const queue = ['/en', '/bn']
  const seen = new Set(queue)
  const images = new Set()
  const anchors = []
  while (queue.length) {
    const path = queue.shift()
    const res = await get(path)
    const html = await res.text()
    check(res.status === 200, `${path} -> ${res.status}`)
    if (res.status !== 200) continue
    const clean = path.split('?')[0]
    const lang = clean.split('/')[1]
    check(attr(html, /<html[^>]* lang="([^"]+)"/) === lang, `${path}: html lang`)
    check((html.match(/<h1[\s>]/g) || []).length === 1, `${path}: exactly one h1 (found ${(html.match(/<h1[\s>]/g) || []).length})`)
    check(Boolean(attr(html, /<title>([^<]+)<\/title>/)), `${path}: title`)
    check(Boolean(attr(html, /<meta name="description" content="([^"]+)"/)), `${path}: description`)
    check(Boolean(attr(html, /<link rel="canonical" href="([^"]+)"/)?.endsWith(clean)), `${path}: canonical`)
    check(!/unsplash\.com/.test(html), `${path}: no stock imagery`)
    check(!/<img(?![^>]* alt=)[^>]*>/.test(html), `${path}: every img has alt`)
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(m[1])
        passed++
      } catch {
        failures.push(`${path}: invalid JSON-LD`)
      }
    }
    for (const m of html.matchAll(/<img[^>]* src="([^"]+)"/g)) images.add(decode(m[1]))
    for (const m of html.matchAll(/href="(\/(?:en|bn)[^"]*)"/g)) {
      const [target, hash] = decode(m[1]).split('#')
      if (hash) anchors.push([path, target, hash])
      if (!seen.has(target)) {
        seen.add(target)
        queue.push(target)
      }
    }
    for (const m of html.matchAll(/href="#([^"]+)"/g)) check(html.includes(`id="${m[1]}"`), `${path}: anchor #${m[1]}`)
  }
  console.log(`Crawled ${seen.size} internal URLs`)

  let broken = 0
  const list = [...images]
  for (let i = 0; i < list.length; i += 6) {
    await Promise.all(
      list.slice(i, i + 6).map(async (src) => {
        const res = await get(src, { headers: { accept: 'image/avif,image/webp,*/*' } })
        const ok = res.status === 200 && (res.headers.get('content-type') || '').startsWith('image/')
        await res.arrayBuffer()
        if (!ok) broken++
        check(ok, `image ${res.status} ${src}`)
      }),
    )
  }
  console.log(`Checked ${list.length} images, ${broken} broken`)

  // ---- 404s
  for (const path of ['/en/does-not-exist', '/en/fleet/no-such-car', '/bn/services/nope', '/zz']) {
    const res = await get(path)
    check(res.status === 404, `${path} should be 404, got ${res.status}`)
  }

  // ---- public API: read-only, published only, nothing sensitive
  const cars = await (await get('/api/cars?limit=200&depth=0')).json()
  check(cars.docs?.length > 0, 'API lists vehicles')
  check(cars.docs?.every((c) => c.status === 'published'), 'API hides drafts from visitors')
  for (const [path, label] of [['/api/users', 'users'], ['/api/inquiries', 'inquiries']]) {
    const res = await get(path)
    check([401, 403].includes(res.status), `anonymous cannot read ${label} (got ${res.status})`)
  }
  // Deliberately invalid bodies: even if access control regressed, nothing could be saved.
  for (const collection of ['users', 'inquiries', 'cars', 'media', 'services']) {
    const res = await get(`/api/${collection}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
    check([401, 403].includes(res.status), `anonymous cannot create ${collection} (got ${res.status})`)
  }
  const first = cars.docs?.[0]?.id
  for (const method of ['PATCH', 'DELETE']) {
    // A non-existent id is used so a regression could not damage real data.
    const res = await get(`/api/cars/999999999`, { method, headers: { 'content-type': 'application/json' }, body: method === 'PATCH' ? '{}' : undefined })
    check([401, 403].includes(res.status), `anonymous cannot ${method} a vehicle (got ${res.status})`)
  }
  check(Boolean(first), 'vehicle ids returned')

  // ---- SEO files, admin and headers
  const sitemap = await (await get('/sitemap.xml')).text()
  check(cars.docs.every((c) => sitemap.includes(`/en/fleet/${c.slug}<`) && sitemap.includes(`/bn/fleet/${c.slug}<`)), 'sitemap lists every vehicle')
  const robots = await (await get('/robots.txt')).text()
  check(/Sitemap: .+sitemap\.xml/.test(robots) && /Disallow: \/admin/.test(robots), 'robots.txt')
  const admin = await get('/admin/login')
  check(admin.status === 200, `admin login page -> ${admin.status}`)
  const home = await get('/en')
  for (const h of ['x-content-type-options', 'x-frame-options', 'referrer-policy']) check(Boolean(home.headers.get(h)), `header ${h}`)
  check(!home.headers.get('x-powered-by')?.includes('Next'), 'framework header hidden')

  console.log(`\n${passed} checks passed, ${failures.length} failed`)
  for (const f of failures.slice(0, 50)) console.log('  FAIL', f)
  process.exit(failures.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
