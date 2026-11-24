import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const hasDb = Boolean(
  process.env.POSTGRES_URL &&
    !process.env.POSTGRES_URL.includes('user:password@host') &&
    process.env.POSTGRES_URL.trim() !== '',
)

const Layout = ({ children }: Args) => {
  if (!hasDb) {
    return (
      <html lang="en">
        <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0d14' }}>
          {children}
        </body>
      </html>
    )
  }

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

export default Layout
