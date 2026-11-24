import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
  },
  auth: true,
  access: {
    // Only authenticated users can access admin panel (allow unauthenticated to load login page)
    admin: ({ req: { user } }) => !user || ['superadmin', 'editor'].includes((user as any)?.role),
    // Superadmin can see all users; editors can view their own profile
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'superadmin') return true
      return { id: { equals: user.id } }
    },
    // Allow creating the first user (when no user is logged in), or superadmin can create new users
    create: ({ req: { user } }) => !user || (user as any)?.role === 'superadmin',
    // Superadmin can update anyone; users can update themselves
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'superadmin') return true
      return { id: { equals: user.id } }
    },
    // Only superadmin can delete users
    delete: ({ req: { user } }) => (user as any)?.role === 'superadmin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'superadmin',
      options: [
        { label: 'Super Admin (Full Access)', value: 'superadmin' },
        { label: 'Editor (Manage Content, Fleet & Inquiries)', value: 'editor' },
      ],
      access: {
        update: ({ req: { user } }) => (user as any)?.role === 'superadmin',
      },
      admin: {
        description: 'Super Admin has full access including user management; Editor manages content, cars, and inquiries.',
      },
    },
  ],
}
