import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
  APP_NAME: Joi.string().default('NestApplication'),
  PORT: Joi.number().default(3000)
})
