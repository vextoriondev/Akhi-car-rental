/**
 * Secure Admin Password Reset Script for Akhi Car Rental
 *
 * Usage:
 *   ADMIN_EMAIL="admin@akhirental.com" NEW_PASSWORD="NewSecurePassword123!" npm run admin:reset-password
 *
 * Allows authorized project owners to reset passwords securely via CLI
 * without exposing unauthenticated endpoints.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
loadEnv()

async function resetPassword() {
  const email = (process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'admin@akhicarrental.com').trim().toLowerCase()
  const newPassword = process.env.NEW_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'AkhiRentalAdmin2026!'

  if (!email || !newPassword) {
    console.error('❌ Missing arguments: Set ADMIN_EMAIL and NEW_PASSWORD in environment variables.')
    console.log('   Example: ADMIN_EMAIL="admin@akhirental.com" NEW_PASSWORD="NewPassword123!" npm run admin:reset-password')
    process.exit(1)
  }

  if (newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters long.')
    process.exit(1)
  }

  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('../src/payload.config')
    const payload = await getPayload({ config })

    const res = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (res.totalDocs === 0) {
      console.error(`❌ User with email [${email}] not found in database.`)
      process.exit(1)
    }

    const user = res.docs[0]

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword,
      },
    })

    console.log(`✅ Password successfully updated for user: ${email}`)
    console.log(`   You can now sign in at the admin panel: /admin`)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Failed to reset password:', error.message || error)
    process.exit(1)
  }
}

resetPassword()
