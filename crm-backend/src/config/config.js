const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    FORM_URL: Joi.string().required().description('Form url'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_URL_CRM: Joi.string().required().description('Mongo DB Crm url'),
    MONGODB_URL_CLIENTS: Joi.string().required().description('Mongo DB Client url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    SENDGRID_API_KEY: Joi.string().description('sendgrid api key for this app'),
    TRIPLE_MERCHANT: Joi.string().description('triple merchant for this app'),
    TRIPLE_CLIENT: Joi.string().description('triple client for this app'),
    TRIPLE_KEY: Joi.string().description('triple key for this app'),
    GA_SECRET_KEY: Joi.string().description('GA key for this app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    mongo_url: envVars.MONGODB_URL,
    crm_url: envVars.MONGODB_URL_CRM,
    client_url: envVars.MONGODB_URL_CLIENTS,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  form: envVars.FORM_URL,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  },
  email: {
    sendgrid_api_key: envVars.SENDGRID_API_KEY,
    from: envVars.EMAIL_FROM,
  },
  triple: {
    merchant: envVars.TRIPLE_MERCHANT,
    client: envVars.TRIPLE_CLIENT,
    key: envVars.TRIPLE_KEY,
  },
  ga_secret: envVars.GA_SECRET_KEY,
};
