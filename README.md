# New Akhi Rent-a-Car (নিউ আখি রেন্ট-এ-কার)

Bilingual (English and বাংলা) car rental website: **Next.js 16, Payload CMS 3 and Postgres (Neon)**.

All content on the website (vehicles, photos, fares, availability, services, facilities, home page and contact details) is stored in the database and edited at `/admin`.

## Local setup

```bash
cp .env.example .env.local   # fill in POSTGRES_URL and PAYLOAD_SECRET
npm install
npm run dev                  # http://localhost:3000  (admin: /admin)
npm run seed                 # loads the fleet, photos and starting content
```

`npm run seed` only adds what is missing. It never overwrites changes made in the admin panel.
If no admin account exists, it creates one from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`; otherwise create the first account at `/admin`.

## Managing vehicles (`/admin` → Vehicles)

| Task | How |
| --- | --- |
| Add a vehicle | **Create New**. Name, brand, type and seats are required. Leave *Slug* empty to generate it. |
| Change fares | *Daily fare* / *Monthly fare*. With both empty the site shows "Price on request". |
| Mark as booked | Untick **Available for booking**. |
| Hide from the website | Set **Status** to *Draft*. |
| Photos | *Main photo* and *Gallery*. JPEG, PNG, WebP or AVIF, up to 8 MB. |
| Home page | Tick **Show on home page** (the first six by *Order* are shown). |
| Bangla text | Switch the *Locale* selector at the top of the page. |
| Delete | Open the vehicle, then **⋮ → Delete**. |

Changes appear on the website immediately. Booking requests arrive under **Leads → Inquiries** (there are no email notifications).

Roles: **Super Admin** manages users and can delete inquiries. **Editor** manages content, vehicles and inquiry status.

## Deploying to Vercel

1. Add **Neon Postgres** and a **Blob** store to the project. Without Blob (`BLOB_READ_WRITE_TOKEN`), photos cannot be uploaded on Vercel because its file system is read-only.
2. Set `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` (the real domain).
3. Set up the database. Payload never creates tables in production, so use one of these:
   - **New, empty database:** run `npm run db:migrate` with `POSTGRES_URL` pointing at it.
   - **The database already used for development:** its tables exist. Do not run migrations on it.
4. Load the content with the production `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` set locally:
   - New database: `npm run seed`
   - Database that was seeded without Blob: `npm run seed -- --sync-media`, which uploads the imported photos to Blob. Check the photos afterwards. This path has not been tested.
5. Deploy.

After changing a collection or global, create a migration with `npm run db:migrate:create` and commit it.

**Photo storage without Blob:** files are saved in `public/media/`. The imported photos there are committed to Git so they ship with the site.

## Checks

```bash
npm run typecheck
npm run build
BASE_URL=http://localhost:3000 npm test           # read-only: pages, links, images, SEO, API access
BASE_URL=http://localhost:3000 npm run test:cms   # WRITES temporary records to the database, then removes them
```

Run `test:cms` against a development database, and against a site that uses the same database as `.env.local`.

## Source data

`scripts/data/` holds the client's fare sheet (as data), the original photos and the starting copy. Only the import script reads it; the website never does.
