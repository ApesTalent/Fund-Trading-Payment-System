const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { statusTypes } = require("../config/status");
const { purposeTypes } = require("../config/purpose");

const createPayout = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      name: Joi.string().required(),
      amount: Joi.string().required(),
      tradingAccount: Joi.number().integer(),
      status: Joi.string()
        .required()
        .valid(
          statusTypes.REQUEST,
          statusTypes.REJECTED,
          statusTypes.UNUSED,
          statusTypes.AWAITING_PAYMENT,
          statusTypes.FINALIZED,
          statusTypes.PAID
        ),
      purpose: Joi.string().valid(
        purposeTypes.TRADER,
        purposeTypes.AFFILIATE,
        purposeTypes.SUPPORT,
        purposeTypes.TECHNOLOGY,
        purposeTypes.MANAGEMENT
      ),
      payoutMethod: Joi.string(),
      paidDate: Joi.string(),
      paidBy: Joi.string(),
    })
    .unknown(true),
};

const getPayouts = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPayout = {
  params: Joi.object().keys({
    pId: Joi.string().custom(objectId),
  }),
};

const getFlag = {
  params: Joi.object().keys({
    fId: Joi.string(),
  }),
};

const updatePayout = {
  params: Joi.object().keys({
    pId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string(),
      name: Joi.string(),
      amount: Joi.string(),
      tradingAccount: Joi.number().integer(),
      status: Joi.string()
        .required()
        .valid(
          statusTypes.REQUEST,
          statusTypes.REJECTED,
          statusTypes.UNUSED,
          statusTypes.AWAITING_PAYMENT,
          statusTypes.FINALIZED,
          statusTypes.PAID
        ),
      purpose: Joi.string().valid(
        purposeTypes.TRADER,
        purposeTypes.AFFILIATE,
        purposeTypes.SUPPORT,
        purposeTypes.TECHNOLOGY,
        purposeTypes.MANAGEMENT
      ),
      payoutMethod: Joi.string(),
      paidDate: Joi.string(),
      paidBy: Joi.string(),
    })
    .unknown(true)
    .min(1),
};

const updateForm = {
  params: Joi.object().keys({
    pId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    invoice: Joi.string().required(),
    payoutMethod: Joi.string().required(),
    paidDate: Joi.string().required(),
    accountType: Joi.string().required(),
    payoutDetails: Joi.array().items(
      Joi.object({
        type: Joi.string(),
        value: Joi.string().allow(null, ''),
      })
    ),
    personalDetails: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().allow(null, ''),
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        region: Joi.string().required(),
        country: Joi.string().required(),
        zip: Joi.string().required(),
      }),
      signature: Joi.string().required()
    }),
  }),
};

const deletePayout = {
  params: Joi.object().keys({
    pId: Joi.string().custom(objectId),
  }),
};

const sendEmail = {
  body: Joi.object().keys({
    pId: Joi.string(),
    to: Joi.string(),
  }),
};

const getForm = {
  body: Joi.object().keys({
    token: Joi.string(),
  }),
};

const sendPayout = {
  params: Joi.object().keys({
    pId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createPayout,
  getPayouts,
  getPayout,
  updatePayout,
  deletePayout,
  sendEmail,
  getForm,
  sendPayout,
  updateForm,
  getFlag,
};
