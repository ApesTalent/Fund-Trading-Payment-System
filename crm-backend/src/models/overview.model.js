const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { clientConnection } = require("../connections");

const overviewSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      one: {
        type: String,
      },
      city: {
        type: String,
      },
      region: {
        type: String,
      },
      code: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    accounts: {
      type: Array,
      default: [],
    },
    notes: {
      type: Array,
      default: [],
    },
    emails: {
      type: Array,
      default: [],
    },
    notifications: {
      type: Array,
      default: [],
    },

    flags: {
      kyc: {
        type: Boolean,
      },
      contracted: {
        type: Boolean,
      },
    },

    timeAdded: {
      type: Number,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
overviewSchema.plugin(toJSON);
overviewSchema.plugin(paginate);

/**
 * @typedef Overview
 */
const Overview = clientConnection.model("Overview", overviewSchema, "overview");

module.exports = Overview;
