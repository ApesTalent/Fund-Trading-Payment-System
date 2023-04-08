const httpStatus = require("http-status");
const { Overview } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a Overview
 * @param {Object} body
 * @returns {Promise<Overview>}
 */
const createOverview = async (body) => {
  return Overview.create(body);
};

/**
 * Get Overview by id
 * @param {ObjectId} id
 * @returns {Promise<Overview>}
 */
const getOverviewById = async (id) => {
  return Overview.findById(id);
};

/**
 * Update Overview by id
 * @param {ObjectId} oId
 * @param {Object} updateBody
 * @returns {Promise<Overview>}
 */
const updateOverviewById = async (oId, updateBody) => {
  const overview = await getOverviewById(oId);
  if (!overview) {
    throw new ApiError(httpStatus.NOT_FOUND, "overview not found");
  }
  Object.assign(overview, updateBody);
  await overview.save();
  return overview;
};

/**
 * Update Overview by email
 * @param {String} email
 * @param {Object} updateBody
 * @returns {Promise<Overview>}
 */
const updateOverviewEmails = async (email, updateBody) => {
  const overview = await Overview.findOne({ email });
  if (!overview) {
    return;
  }

  var uItem = new Array();
  uItem = [...overview.emails];
  uItem.push(updateBody);
  Object.assign(overview, {
    emails: uItem,
  });
  await overview.save();
  return overview;
};

/**
 * Delete Overview by id
 * @param {ObjectId} oId
 * @returns {Promise<Overview>}
 */
const deleteOverviewById = async (oId) => {
  const overview = await getOverviewById(oId);
  if (!overview) {
    throw new ApiError(httpStatus.NOT_FOUND, "overview not found");
  }
  await overview.remove();
  return overview;
};

module.exports = {
  createOverview,
  getOverviewById,
  updateOverviewById,
  deleteOverviewById,
  updateOverviewEmails,
};
