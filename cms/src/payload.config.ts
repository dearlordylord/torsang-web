import { buildConfig } from 'payload/config'
import path from 'path'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { MainMenu } from './globals/MainMenu'
import { Media } from './collections/Media'
console.log('process.env.S3_BUCKETprocess.env.S3_BUCKET', process.env.S3_BUCKET)
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
  collections: [Pages, Users, Media],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL, process.env.PAYLOAD_PUBLIC_SITE_URL],
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL, process.env.PAYLOAD_PUBLIC_SITE_URL],
  globals: [MainMenu],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    cloudStorage({
      collections: {
        'media': {
          prefix: `${process.env.NODE_ENV || 'development'}/media/`,
          adapter: storageAdapter
        },
      },
    }),
  ],
  localization: {
    locales: [
      'en',
      'th'
    ],
    defaultLocale: 'en',
    fallback: true,
  },
})
