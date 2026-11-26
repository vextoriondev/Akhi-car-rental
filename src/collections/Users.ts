import type { CollectionConfig } from 'payload'
import { isSuperAdmin, isSuperAdminField, isSuperAdminOrSelf } from '../server/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
  },
  access: {
    admin: ({ req }) => ['superadmin', 'editor'].includes((req.user as { role?: string } | null)?.role ?? ''),
    read: isSuperAdminOrSelf,
    // The very first account is registered through Payload's dedicated first-user
    // endpoint, which only works while no user exists. Everything else needs a super admin.
    create: isSuperAdmin,
    update: isSuperAdminOrSelf,
    delete: isSuperAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'superadmin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin (Full Access)', value: 'superadmin' },
        { label: 'Editor (Manage Content, Fleet & Inquiries)', value: 'editor' },
      ],
      access: {
        update: isSuperAdminField,
      },
      admin: {
        description: 'Super Admin has full access including user management; Editor manages content, cars, and inquiries.',
      },
    },
  ],
}
