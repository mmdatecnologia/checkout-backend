export interface Configuration {
  NODE_ENV: string
  app: {
    name: string
    description: string
    version: string
    port: number
  }
  cache: {
    store: string
    host: string
    password: string
    port: string
    prefix: string
  }
  db: {
    type: string
    url: string
  }
}
export const configuration = (): Configuration => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    app: {
      name: process.env.APP_NAME,
      description: process.env.APP_DESCRIPTION,
      version: process.env.APP_VERSION,
      port: parseInt(process.env.PORT, 10)
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
  }
}
