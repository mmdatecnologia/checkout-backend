export const configuration = (): Record<string, unknown> => ({
  NODE_ENV: process.env.NODE_ENV,
  app: {
    name: process.env.APP_NAME || 'NestApplication',
    description: process.env.APP_DESCRIPTION || 'NestApplication',
    version: process.env.APP_VERSION || '0.0.1',
    port: parseInt(process.env.PORT, 10) || 3000
  },
  cache: {
    store: process.env.CACHE_STORE,
    host: process.env.CACHE_HOST,
    password: process.env.CACHE_PASSWORD,
    port: process.env.CACHE_PORT,
    prefix: process.env.CACHE_PREFIX
  },
  db: {
    type: process.env.DB_TYPE,
    url: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  }
})
