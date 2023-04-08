const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");
const { statusTypes } = require("../config/status");
const { methodTypes } = require("../config/methods");
const { purposeTypes } = require("../config/purpose");
const { clientConnection } = require("../connections");

const PayoutSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    amount: {
      type: String,
      required: true,
    },
    tradingAccount: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        statusTypes.REQUEST,
        statusTypes.REJECTED,
        statusTypes.UNUSED,
        statusTypes.AWAITING_PAYMENT,
        statusTypes.FINALIZED,
        statusTypes.PAID,
      ],
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: [
        purposeTypes.TRADER,
        purposeTypes.AFFILIATE,
        purposeTypes.SUPPORT,
        purposeTypes.TECHNOLOGY,
        purposeTypes.MANAGEMENT,
      ],
      trim: true,
      default: purposeTypes.TRADER,
    },
    invoice: {
      type: String,
    },
    paidDate: {
      type: String,
      trim: true,
    },
    accountType: {
      type: String,
      trim: true,
    },
    payoutMethod: {
      type: String,
      enum: [
        methodTypes.BANK,
        methodTypes.CRYPTOCURRENCY,
        methodTypes.FINALIZED,
      ],
    },
    personalDetails: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
        region: {
          type: String,
        },
        country: {
          type: String,
        },
        zip: {
          type: String,
        },
      },
      signature: {
        type: String,
      },
    },
    payoutDetails: {
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
PayoutSchema.plugin(toJSON);
PayoutSchema.plugin(paginate);

/**
 * @typedef Payout
 */
const Payout = clientConnection.model("Payout", PayoutSchema);

module.exports = Payout;
