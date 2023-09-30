import React from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'

import { Gutter } from '../../components/Gutter'
import { LightboxContextProvider } from '../../features/lightbox/provider'
import { Event } from '../../payload-types'

type Props = {
  test: string
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
  const pageReq = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/${collectionSlug}?limit=100`,
    {
      headers: {
        ...(preview
          ? {
              Authorization: `JWT ${payloadToken}`,
            }
          : {}),
      },
    },
  )

  if (!pageReq.ok) {
    throw new Error(`Failed to fetch ${collectionSlug} from CMS`)
  }
  return {
    props: {
      test: 'test',
      docs: (await pageReq.json()).docs as Event[],
    },
  }
}

const Events: React.FC<Props> = props => {
  return (
    <Gutter>
      <LightboxContextProvider>
        <div>Events: </div>
        {props.docs.map(doc => (
          <div key={doc.id}>
            <Link href={`/events/${doc.slug}`}>{doc.title}</Link>
          </div>
        ))}
      </LightboxContextProvider>
    </Gutter>
  )
}

export default Events
