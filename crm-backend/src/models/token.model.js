const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
const {crmConnection} = require('../connections');

const tokenSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH,tokenTypes.ACCESS, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = crmConnection.model('Token', tokenSchema);

module.exports = Token;
