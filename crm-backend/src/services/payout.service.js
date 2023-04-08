const httpStatus = require("http-status");
const axios = require("axios");
const { Payout } = require("../models");
const { Flag } = require("../models");
const ApiError = require("../utils/ApiError");
const { statusTypes } = require("../config/status");
const config = require("../config/config");
const emailService = require("./email.service");

/**
 * Create a Payout
 * @param {Object} payoutBody
 * @returns {Promise<Payout>}
 */
const createPayout = async (payoutBody) => {
  return Payout.create(payoutBody);
};

/**
 * Query for Payout
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPayout = async (filter, options) => {
  const payouts = await Payout.paginate(filter, options);
  return payouts;
};

/**
 * Query for Payout With Flag left join to crm.flags
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getPayoutsWithFlag = async (filter, options) => {
  const payouts = await queryPayout(filter, options);
  var updatedPayouts = [];
  if (payouts.results.length > 0 && filter.status === statusTypes.REQUEST) {
    await Promise.all(
      payouts.results.map(async (item) => {
        var uItem = {};
        Object.assign(uItem, { flag: false }, item._doc);
        if (item.tradingAccount !== undefined && item.tradingAccount !== null) {
          const flags = await Flag.findById(item.tradingAccount);
          if (flags) {
            uItem = {};
            Object.assign(uItem, { flag: true }, item._doc);
          }
        }
        updatedPayouts.push(uItem);
      })
    );
    payouts.results = updatedPayouts;
  }

  return payouts;
};

/**
 * Get payout by id
 * @param {ObjectId} id
 * @returns {Promise<Payout>}
 */
const getPayoutById = async (id) => {
  return Payout.findById(id);
};

/**
 * Get payout by email
 * @param {string} email
 * @returns {Promise<Payout>}
 */
const getPayoutByEmail = async (email) => {
  return Payout.find({ email });
};

/**
 * Update payout by id
 * @param {ObjectId} pId
 * @param {Object} updateBody
 * @returns {Promise<Payout>}
 */
const updatePayoutById = async (pId, updateBody) => {
  const payout = await getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }
  payout.email = payout.email.trim();
  Object.assign(payout, updateBody);
  await payout.save();
  return payout;
};

/**
 * Delete payout by id
 * @param {ObjectId} pId
 * @returns {Promise<Payout>}
 */
const deletePayoutById = async (pId) => {
  const payout = await getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }
  await payout.remove();
  return payout;
};

/**
 * Send payout by id
 * @param {ObjectId} pId
 * @returns {Promise<Payout>}
 */
const sendPayoutById = async (pId) => {
  const payout = await getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }
  try {
    if (payout.status === statusTypes.AWAITING_PAYMENT) {
      const result = await axios.post(
        "https://api.triple-a.io/api/v2/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: config.triple.client,
          client_secret: config.triple.key,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (result.data.access_token) {
        await axios.post(
          "https://api.triple-a.io/api/v2/payout/withdraw/local/crypto",
          {
            merchant_key: config.triple.merchant,
            name: payout.name,
            email: payout.email,
            withdraw_currency: "USD",
            withdraw_amount: payout.amount,
          },
          {
            headers: {
              Authorization: "Bearer " + result.data.access_token,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      }

      Object.assign(payout, { status: statusTypes.PAID });
      await payout.save();
    }
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.BAD_REQUEST, "Send Funds Failed");
  }
};

module.exports = {
  createPayout,
  queryPayout,
  getPayoutsWithFlag,
  getPayoutById,
  getPayoutByEmail,
  updatePayoutById,
  deletePayoutById,
  sendPayoutById,
};
