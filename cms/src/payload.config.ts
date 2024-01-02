import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import path from 'path'
import { buildConfig } from 'payload/config'

import { Media } from './collections/Media'
import { Events, Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { MainMenu } from './globals/MainMenu'
import { Meta } from './globals/Meta';

const storageAdapter = s3Adapter({
  config: {
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    // ... Other S3 configuration
  },
  bucket: process.env.S3_BUCKET,
})

export default buildConfig({
  collections: [Pages, Events, Users, Media],
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.PAYLOAD_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.PAYLOAD_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  globals: [MainMenu, Meta],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    cloudStorage({
      collections: {
        media: {
          prefix: `${process.env.NODE_ENV || 'development'}/media/`,
          adapter: storageAdapter,
        },
      },
    }),
  ],
  localization: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
    fallback: true,
  },
})
