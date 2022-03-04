export const configuration = (): Record<string, unknown> => ({
  NODE_ENV: process.env.NODE_ENV,
  appName: process.env.APP_NAME || 'NestApplication',
  port: parseInt(process.env.PORT, 10) || 3000
})
