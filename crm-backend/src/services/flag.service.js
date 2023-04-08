const httpStatus = require("http-status");
const { Flag } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a Flag
 * @param {Object} body
 * @returns {Promise<Flag>}
 */
const createFlag = async (body) => {
  return Flag.create(body);
};


/**
 * Get Flag by id
 * @param {ObjectId} id
 * @returns {Promise<Flag>}
 */
const getFlagById = async (id) => {
  return Flag.findById(id);
};

/**
 * Update Flag by id
 * @param {ObjectId} fId
 * @param {Object} updateBody
 * @returns {Promise<Flag>}
 */
const updateFlagById = async (fId, updateBody) => {
  const flag = await getFlagById(fId);
  if (!flag) {
    throw new ApiError(httpStatus.NOT_FOUND, "flag not found");
  }
  Object.assign(flag, updateBody);
  await flag.save();
  return flag;
};

/**
 * Delete Flag by id
 * @param {ObjectId} fId
 * @returns {Promise<Flag>}
 */
const deleteFlagById = async (fId) => {
  const flag = await getFlagById(fId);
  if (!flag) {
    throw new ApiError(httpStatus.NOT_FOUND, "Flag not found");
  }
  await flag.remove();
  return flag;
};


module.exports = {
  createFlag,
  getFlagById,
  updateFlagById,
  deleteFlagById,
};
