import type { Access, FieldAccess } from 'payload'

type Role = 'superadmin' | 'editor'
const roleOf = (user: unknown) => (user as { role?: Role } | null | undefined)?.role

export const isLoggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)
export const isSuperAdmin: Access = ({ req }) => roleOf(req.user) === 'superadmin'
export const isSuperAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'superadmin'
export const isSuperAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (roleOf(req.user) === 'superadmin') return true
  return { id: { equals: req.user.id } }
}
/** Visitors only ever see published documents; staff see everything. */
export const publishedOrLoggedIn: Access = ({ req }) => (req.user ? true : { status: { equals: 'published' } })

/** Standard rules for site content: public read, staff write. */
export const publicContent = { read: () => true, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn }
