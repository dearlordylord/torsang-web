import type { Payload } from 'payload'
import { examplePage } from './page'
import { examplePageDraft } from './pageDraft'
import { home, homeTh } from './home';

export const seed = async (payload: Payload): Promise<void> => {
  await payload.create({
    collection: 'users',
    data: {
      email: 'igor@loskutoff.com',
      password: 'igor@loskutoff.com',
    },
  })

  const { id: examplePageID } = await payload.create({
    collection: 'pages',
    data: examplePage as any, // eslint-disable-line
  })

  await payload.update({
    collection: 'pages',
    id: examplePageID,
    draft: true,
    data: examplePageDraft as any, // eslint-disable-line
  })

  const homepageJSON = JSON.parse(JSON.stringify(home).replace('{{DRAFT_PAGE_ID}}', examplePageID))
  const homepageThJSON = JSON.parse(JSON.stringify(homeTh).replace('{{DRAFT_PAGE_ID}}', examplePageID))

  const [enHomepage] = await Promise.all([payload.create({
      collection: 'pages',
      data: homepageJSON,
      locale: 'en',
    }), payload.updateGlobal({
    slug: 'main-menu',
    locale: 'en',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            reference: null,
            label: 'Dashboard',
            url: 'http://localhost:8000/admin',
          },
        },
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: examplePageID,
            },
            label: 'Example Page (en)',
            url: '',
          },
        },
      ],
    },
  })]);

  // has to go sequentially
  await payload.updateGlobal({
    slug: 'main-menu',
    locale: 'th',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            reference: null,
            label: 'Dashboard',
            url: 'http://localhost:8000/admin',
          },
        },
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: examplePageID,
            },
            label: 'Example Page (th)',
            url: '',
          },
        },
      ],
    },
  });

  await payload.update({
    id: enHomepage.id,
    collection: 'pages',
    data: homepageThJSON,
    locale: 'th',
  })


}
