/**
 * Secure Admin Bootstrap Script for Akhi Car Rental
 *
 * Usage:
 *   SEED_ADMIN_EMAIL="admin@akhirental.com" SEED_ADMIN_PASSWORD="YourStrongPassword123!" npm run admin:bootstrap
 * Or via .env.local
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
loadEnv()

async function bootstrapAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@akhicarrental.com').trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'AkhiRentalAdmin2026!'
  const name = process.env.SEED_ADMIN_NAME || process.env.ADMIN_NAME || 'Akhi Super Admin'

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters long for production security.')
    process.exit(1)
  }

  console.log(`🔒 Initializing admin bootstrap for: ${email}...`)

  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('../src/payload.config')
    const payload = await getPayload({ config })

    // Check if user already exists with this email
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      const existingUser = existing.docs[0]
      await payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          password,
          role: 'superadmin',
        },
      })
      console.log(`✅ Admin user [${email}] updated with new password and role superadmin!`)
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
      console.log(`   Role: superadmin`)
      console.log(`   Admin Panel: http://localhost:3000/admin (or /admin on production)`)
      process.exit(0)
    }

    // Check total users
    const totalUsers = await payload.count({ collection: 'users' })

    // Create the superadmin user
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        role: 'superadmin',
      },
    })

    console.log(`✅ Super Admin created successfully!`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Database ID: ${user.id}`)
    console.log(`   Total Users in Database: ${totalUsers.totalDocs + 1}`)
    console.log(`   Admin Panel: http://localhost:3000/admin (or /admin on production)`)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Failed to bootstrap admin:', error.message || error)
    process.exit(1)
  }
}

bootstrapAdmin()
