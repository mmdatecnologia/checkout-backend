import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
  APP_NAME: Joi.string().default('NestApplication'),
  APP_DESCRIPTION: Joi.string().default('NestApplication'),
  APP_VERSION: Joi.string().required(),
  PORT: Joi.number().default(3000),
  CACHE_STORE: Joi.string().valid('redis', 'memory').default('redis'),
  CACHE_HOST: Joi.string().default('localhost'),
  CACHE_PASSWORD: Joi.string().default('password'),
  CACHE_PORT: Joi.number().default(6379),
  CACHE_PREFIX: Joi.string().allow(null, '').default('cache'),
  DB_TYPE: Joi.string().valid('mongodb').default('mongodb'),
  DB_USERNAME: Joi.string().default('username'),
  DB_PASSWORD: Joi.string().default('password'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(27017),
  DB_NAME: Joi.string().default('database'),
  DB_SSL: Joi.boolean().default(false)
})
