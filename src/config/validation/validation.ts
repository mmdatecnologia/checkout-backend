import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
  APP_NAME: Joi.string().default('NestApplication'),
  APP_DESCRIPTION: Joi.string().default('NestApplication'),
  APP_VERSION: Joi.string().required(),
  PORT: Joi.number().default(3000)
})
