// when 'preview' cookies are set in the browser, getStaticProps runs on every request :)
import {GetStaticPaths, GetStaticProps, GetStaticPropsContext} from "next";
import { ParsedUrlQuery } from 'querystring'
import QueryString from 'qs'

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const makeGetStaticProps: (collectionSlug: string) => GetStaticProps = (collectionSlug) => async (context: GetStaticPropsContext) => {
  const { preview, previewData, params, locale } = context

  const { payloadToken } =
  (previewData as {
    payloadToken: string
  }) || {}

  let { slug } = (params as IParams) || {}
  if (!slug) slug = 'home'


  let doc = {}
  const notFound = false

  const lowerCaseSlug = slug.toLowerCase() // NOTE: let the url be case insensitive

  const searchParams = QueryString.stringify(
    {
      where: {
        slug: {
          equals: lowerCaseSlug,
        },
      },
      depth: 1,
      draft: preview ? true : undefined,
      locale,
    },
    {
      encode: false,
      addQueryPrefix: true,
    },
  )

  // when previewing, send the payload token to bypass draft access control
  const pageReq = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/${collectionSlug}${searchParams}`, {
    headers: {
      ...(preview
        ? {
          Authorization: `JWT ${payloadToken}`,
        }
        : {}),
    },
  })

  if (pageReq.ok) {
    const pageData = await pageReq.json()
    doc = pageData.docs[0]
    if (!doc) {
      return {
        notFound: true,
      }
    }
  }
  return {
    props: {
      ...doc,
      preview: preview || null,
      collection: collectionSlug,
    },
    notFound,
    revalidate: 3600, // in seconds
  }
}

type Path = {
  params: {
    slug: string
  }
}

type Paths = Path[]

export const makeGetStaticPaths: (collectionSlug: string) => GetStaticPaths = (collectionSlug) => async () => {
  let paths: Paths = []

  const pagesReq = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/${collectionSlug}?where[_status][equals]=published&depth=0&limit=300`,
  )

  const pagesData = await pagesReq.json()

  if (pagesReq?.ok) {
    const { docs: pages } = pagesData

    if (pages && Array.isArray(pages) && pages.length > 0) {
      paths = pages.map(page => ({ params: { slug: page.slug } }))
    }
  }

  return {
    paths,
    fallback: true,
  }
}
