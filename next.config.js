/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    // The locales you want to support in your app
    locales: ['en', 'fr'],
    // The default locale you want to be used when visiting a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en',
    localeDetection: false
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    CMS_ENDPOINT: process.env.CMS_ENDPOINT,
    HEROKU_API_URL: process.env.HEROKU_API_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    THREEKIT_ENVIRONMENT: process.env.THREEKIT_ENVIRONMENT,
    THREEKIT_PUBLIC_TOKEN: process.env.THREEKIT_PUBLIC_TOKEN,
    THREEKIT_ASSET_ID: process.env.THREEKIT_ASSET_ID,
    THREEKIT_ORG_ID: process.env.THREEKIT_ORG_ID,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_MAPS_ID: process.env.GOOGLE_MAPS_ID,
    HUBSPOT_PORTAL_ID: process.env.HUBSPOT_PORTAL_ID,
    HUBSPOT_FORMS_JS_URL: process.env.HUBSPOT_FORMS_JS_URL,
    THUMBNAILS_ENDPOINT: process.env.THUMBNAILS_ENDPOINT,
    THREEKIT_STAGE_ID: process.env.THREEKIT_STAGE_ID,
    THUMBNAIL_CAMERA: process.env.THUMBNAIL_CAMERA,
    THUMBNAIL_CAMERA_VALUE: process.env.THUMBNAIL_CAMERA_VALUE
  },
  images: {
    domains: [
      'cdn.sanity.io',
      'integration-5ojmyuq-hfegxrqzlt32w.us-a1.magentosite.cloud',
      'preview.threekit.com',
      'alpha-compositor.3kit.com',
      'localhost',
      'bjc-webapp.vercel.app'
    ]
  }
};

module.exports = nextConfig;
