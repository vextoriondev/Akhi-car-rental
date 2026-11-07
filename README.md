# Akhi Rental Solution (আখি রেন্টাল সলিউশন)

Car rental portfolio website — **Next.js 16 + Payload CMS 3 + Postgres (Neon)**, hosted on **Vercel**.

- Full-page hero carousel + search bar (text / service / car type)
- Fleet catalogue, service pages (daily, monthly, corporate, airport, wedding, tours)
- Inquiry form → saved in Payload admin (`Leads → Inquiries`) + WhatsApp hand-off
- English + বাংলা (`/en`, `/bn`), content editable per language in `/admin`
- Dark, neon-gradient theme; SVG logo in `public/logo.svg`

## Local setup
```bash
cp .env.example .env.local   # fill POSTGRES_URL, PAYLOAD_SECRET, WhatsApp number
npm install
npm run dev                  # http://localhost:3000  (admin: /admin)
SEED_ADMIN_EMAIL=you@x.com SEED_ADMIN_PASSWORD=strong-pass npm run seed   # demo data + admin user
```

## Deploy on Vercel
1. Import the repo in Vercel.
2. Storage → add **Neon Postgres** (sets `POSTGRES_URL`) and a **Blob** store (sets `BLOB_READ_WRITE_TOKEN`, used for uploaded car photos).
3. Env vars: `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, and `PAYLOAD_PUSH=true` for the **first** deploy (creates tables), then remove it.
4. Run `npm run seed` locally against the same `POSTGRES_URL` once (or create the first admin at `/admin`).

## Editing content
`/admin` → Cars, Services, Home Page (carousel slides, about, stats), Site Settings (phone, WhatsApp…), Testimonials, Media.
