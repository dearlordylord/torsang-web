import type { GlobalConfig } from 'payload/types'

import link from '../fields/link'
import { TextField } from 'payload/dist/fields/config/types';

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
