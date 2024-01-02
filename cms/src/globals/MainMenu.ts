import type { GlobalConfig } from 'payload/types'

import link from '../fields/link'

export const MAIN_MENU_SLUG = 'main-menu' as const;

export const MainMenu: GlobalConfig = {
  slug: MAIN_MENU_SLUG,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
