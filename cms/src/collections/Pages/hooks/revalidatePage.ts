import type { AfterChangeHook } from 'payload/dist/collections/config/types'

// ensure that the home page is revalidated at '/' instead of '/home'
export const formatAppURL =
  (prefix: string) =>
  (
    {
      doc,
    }: {
      doc: { slug: string }
    },
    locale?: string,
  ): string => {
    const pathToUse = doc.slug === 'home' ? '' : doc.slug
    const { pathname } = new URL(
      `${process.env.PAYLOAD_PUBLIC_SITE_URL}/${prefix ? `${prefix}/` : ''}${pathToUse}`,
    )
    // TODO will /en revalidate / and vice versa?
    return `${locale ? `/${locale}` : ''}${pathname}`
  }

// Revalidate the page in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
export const revalidatePage: (prefix: string) => AfterChangeHook =
  prefix =>
  ({ doc, req }) => {
    const url = formatAppURL(prefix)({ doc }, req.locale)

    const revalidate = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.PAYLOAD_PUBLIC_SITE_URL}/api/revalidate?secret=${
            process.env.REVALIDATION_KEY
          }&revalidatePath=${encodeURIComponent(url)}`,
        )

        if (res.ok) {
          req.payload.logger.info(`Revalidated path ${url}`)
        } else {
          req.payload.logger.error(`Error revalidating path ${url}`)
          req.payload.logger.error(res.body)
          req.payload.logger.error(res.statusText)
        }
      } catch (err: unknown) {
        req.payload.logger.error(`Error hitting revalidate route for ${url}`, err)
      }

      if (prefix) {
        // try to revalidate index
        const indexUrl = formatAppURL(prefix)(
          {
            doc: {
              slug: '',
            },
          },
          req.locale,
        )
        const res = await fetch(
          `${process.env.PAYLOAD_PUBLIC_SITE_URL}/api/revalidate?secret=${
            process.env.REVALIDATION_KEY
          }&revalidatePath=${encodeURIComponent(indexUrl)}`,
        )
        if (res.ok) {
          req.payload.logger.info(`Revalidated index path ${indexUrl}`)
        } else {
          req.payload.logger.error(`Error revalidating index path ${indexUrl}`)
          req.payload.logger.error(res.body)
          req.payload.logger.error(res.statusText)
        }
      }
    }

    revalidate().catch(e => {
      req.payload.logger.error(`Error revalidating path ${url}`)
      req.payload.logger.error(e)
    })

    return doc
  }
