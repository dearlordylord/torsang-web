import type { CollectionConfig } from 'payload/types'

import richText from '../../fields/richText'
import { defaultAccess } from '../access/default'
import formatSlug from './hooks/formatSlug'
import { formatAppURL, revalidatePage } from './hooks/revalidatePage'

const previewF =
  (prefix: string) =>
  (doc: { slug: string }): string =>
    `${process.env.PAYLOAD_PUBLIC_SITE_URL}/api/preview?url=${formatAppURL(prefix)({ doc })}`

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: previewF(''),
  },
  versions: {
    drafts: true,
  },
  access: defaultAccess,
  hooks: {
    afterChange: [revalidatePage('')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    richText(),
  ],
}

const EVENTS_PREFIX = 'events'
export const Events: CollectionConfig = {
  slug: EVENTS_PREFIX,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: previewF(EVENTS_PREFIX),
  },
  versions: {
    drafts: true,
  },
  access: defaultAccess,
  hooks: {
    afterChange: [revalidatePage(EVENTS_PREFIX)],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: false,
    },
    {
      name: 'isRecurring',
      type: 'checkbox',
      required: false,
    },
    {
      name: 'recurringOrder',
      type: 'number',
      required: false,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    richText(),
  ],
  endpoints: [
    {
      path: '/all',
      method: 'get',
      handler: async (req, res) => {
        // https://github.com/payloadcms/payload/discussions/2089
        const [ongoing, singular] = await Promise.all([
          req.payload.find({
            collection: EVENTS_PREFIX,
            where: {
              isRecurring: {
                equals: true,
              },
            },
            sort: 'date',
            ...(req.locale ? { locale: req.locale } : {}),
          }),
          req.payload.find({
            collection: EVENTS_PREFIX,
            where: {
              isRecurring: {
                not_equals: true,
              },
            },
            sort: 'recurringOrder',
            ...(req.locale ? { locale: req.locale } : {}),
            limit: 100,
          }),
        ])
        res.json({
          docs: [...ongoing.docs, ...singular.docs],
        })
      },
    },
  ],
}
