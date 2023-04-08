const Joi = require("joi");

const createTemplate = {
  body: Joi.object()
    .keys({
      text: Joi.string().required(),
      group: Joi.string().required(),
      friendlyName: Joi.string(),
    })
    .unknown(true),
};

const getTemplates = {
  query: Joi.object().keys({
    group: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createTemplate,
  getTemplates,
};
