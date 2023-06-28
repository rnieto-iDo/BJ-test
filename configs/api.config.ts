export const apiBaseUrl = process.env.API_ENDPOINT;
export const cmsBaseUrl = process.env.CMS_ENDPOINT;

export const THUMBNAILS_API = {
  HOST: process.env.THUMBNAILS_ENDPOINT,
  ENVIRONMENT: process.env.THREEKIT_ENVIRONMENT,
  AUTH_TOKEN: process.env.THREEKIT_PUBLIC_TOKEN,
  STAGE_ID: process.env.THREEKIT_STAGE_ID,
  THUMBNAIL_CAMERA: process.env.THUMBNAIL_CAMERA,
  THUMBNAIL_CAMERA_VALUE: process.env.THUMBNAIL_CAMERA_VALUE,
  WIDTH: 800,
  HEIGHT: 620,
  FORMAT: 'png'
}