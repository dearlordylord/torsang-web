import React from 'react'
import { format, parse } from 'date-fns'
import enGb from 'date-fns/locale/en-GB'
import thTh from 'date-fns/locale/th'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import * as QueryString from 'querystring'

import { Gutter } from '../../components/Gutter'
import { useLocaleOrDefault } from '../../features/language/switcher/hook'
import { LightboxContextProvider } from '../../features/lightbox/provider'
import { Event } from '../../payload-types'

type Props = {
  docs: Event[]
}

const collectionSlug = 'events' as const

export const getStaticProps: GetStaticProps<Props> = async (
  context,
): Promise<{
  props: Props
}> => {
  const { preview, previewData, params, locale } = context
  const { payloadToken } =
    (previewData as {
      payloadToken: string
    }) || {}
  const q = QueryString.stringify({
    locale,
  })
  const pageReq = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/${collectionSlug}/all?${q}`, {
    headers: {
      ...(preview
        ? {
            Authorization: `JWT ${payloadToken}`,
          }
        : {}),
    },
  })

  if (!pageReq.ok) {
    throw new Error(`Failed to fetch ${collectionSlug} from CMS: ` + (await pageReq.text()))
  }
  return {
    props: {
      docs: (await pageReq.json()).docs as Event[],
    },
  }
}

// date-fns cannot buddhist dates
const locales = {
  en: 'en-GB',
  th: 'th-TH',
} as const

const Events: React.FC<Props> = props => {
  const locale = useLocaleOrDefault()

  // Fix bfcache issue: reload when page is restored from back button
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache, reload to get fresh data
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  return (
    <Gutter>
      <LightboxContextProvider>
        <div>Events: </div>
        {props.docs.map(doc => (
          <div key={doc.id}>
            <Link href={`/events/${doc.slug}`}>
              {doc.title}
              {doc.isRecurring ? null : (
                <span>
                  {' '}
                  on{' '}
                  {parse(doc.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date()).toLocaleDateString(
                    locales[locale] || locales['en'],
                  )}
                </span>
              )}
            </Link>
          </div>
        ))}
      </LightboxContextProvider>
    </Gutter>
  )
}

export default Events
