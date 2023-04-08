const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { crmConnection } = require("../connections");

const flagSchema = mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    partners: {
      type: Array,
      default: [],
    },
    reports: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
flagSchema.plugin(toJSON);

/**
 * @typedef Flag
 */
const Flag = crmConnection.model("Flag", flagSchema);

module.exports = Flag;
