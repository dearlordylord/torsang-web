import type { CollectionConfig } from 'payload/types'

import richText from '../../fields/richText'
import { defaultAccess } from '../access/default'
import formatSlug from './hooks/formatSlug'
import { formatAppURL, revalidatePage } from './hooks/revalidatePage'

const previewF =
  (prefix: string) =>
  (doc: Record<string, unknown>): string =>
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
      required: true,
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
}
