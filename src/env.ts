export const ENV_PRODUCTION = process.env.NODE_ENV === 'production'
export const PUBLIC_DIR: string = process.env.RAZZLE_PUBLIC_DIR || '/public'
export const APP_PORT = process.env.PORT || 3000
