/** Every cached public query carries this tag, so any admin change shows up immediately. */
export const CONTENT_TAG = 'content'

export async function revalidateContent() {
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag(CONTENT_TAG, { expire: 0 })
  } catch {
    // Running outside a Next.js request (CLI scripts): the cache expires on its own.
  }
}

const afterChange = async ({ doc }: { doc: any }) => {
  await revalidateContent()
  return doc
}

export const contentHooks = { afterChange: [afterChange], afterDelete: [afterChange] }
export const globalContentHooks = { afterChange: [afterChange] }
