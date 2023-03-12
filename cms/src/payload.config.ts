import { buildConfig } from 'payload/config'
import path from 'path'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { MainMenu } from './globals/MainMenu'
import { Media } from './collections/Media';

export default buildConfig({
  collections: [Pages, Users, Media],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL, process.env.PAYLOAD_PUBLIC_SITE_URL],
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL, process.env.PAYLOAD_PUBLIC_SITE_URL],
  globals: [MainMenu],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [
      'en',
      'th'
    ],
    defaultLocale: 'en',
    fallback: true,
  },
})
