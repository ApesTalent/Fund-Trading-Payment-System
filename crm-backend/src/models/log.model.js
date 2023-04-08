const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const {crmConnection} = require('../connections');

const logSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    parameters: {
      type: String,
    },
    ip: {
      type: String,
    }
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
logSchema.plugin(toJSON);

/**
 * @typedef Log
 */
const Log = crmConnection.model('Log', logSchema);

module.exports = Log;
