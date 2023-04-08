const Joi = require('joi');
const { password } = require('./custom.validation');

const createClient = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    portalPassword: Joi.string().required().custom(password),
    phone: Joi.string().required(),
  }).unknown(true),
};

const getClients = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClient = {
  params: Joi.object().keys({
    cId: Joi.string().required(),
  }),
};

const updateClient = {
  params: Joi.object().keys({
    cId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
        email: Joi.string().email(),
        name: Joi.string(),
        portalPassword: Joi.string().custom(password),
        phone: Joi.string(),
    })
    .min(1).unknown(true),
};

const sendEmail = {
  body: Joi.object().keys({
    to: Joi.string(),
    templateId: Joi.string(),
    variables: Joi.string(),
  }),
};

const deleteClient = {
  params: Joi.object().keys({
    cId: Joi.string().required(),
  }),
};

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  sendEmail,
};
