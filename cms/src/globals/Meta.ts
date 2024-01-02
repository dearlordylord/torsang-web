import type { TextField } from 'payload/dist/fields/config/types'
import type { GlobalConfig } from 'payload/types'

export const Meta: GlobalConfig = {
  slug: 'meta',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    } satisfies TextField,
  ],
}
