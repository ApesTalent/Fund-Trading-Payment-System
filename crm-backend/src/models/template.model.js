const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { crmConnection } = require("../connections");

const templateSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    friendlyName: {
      type: String,
    },
    group: {
      type: String,
    },
    variables: {
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
templateSchema.plugin(toJSON);
templateSchema.plugin(paginate);

/**
 * @typedef Template
 */
const Template = crmConnection.model("Template", templateSchema);

module.exports = Template;
