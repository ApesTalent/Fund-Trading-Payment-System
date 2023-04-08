const httpStatus = require("http-status");
const { Template } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a Template
 * @param {Object} templateBody
 * @returns {Promise<Template>}
 */
const createTemplate = async (templateBody) => {
  return Template.create(templateBody);
};


/**
 * Get template by id
 * @param {ObjectId} id
 * @returns {Promise<Template>}
 */
const getTemplateById = async (id) => {
  return Template.findById(id);
};

/**
 * Query for Template
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTemplate = async (filter, options) => {
  const templates = await Template.paginate(filter, options);
  return templates;
};

/**
 * Update template by id
 * @param {ObjectId} tId
 * @param {Object} updateBody
 * @returns {Promise<Template>}
 */
const updateTemplateById = async (tId, updateBody) => {
  const template = await getTemplateById(tId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, "Template not found");
  }
  updateBody.invoice = Math.floor(Date.now() / 1000)
  Object.assign(template, updateBody);
  await template.save();
  return template;
};

/**
 * Delete template by id
 * @param {ObjectId} tId
 * @returns {Promise<Template>}
 */
const deleteTemplateById = async (tId) => {
  const template = await getTemplateById(tId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, "Template not found");
  }
  await template.remove();
  return template;
};


module.exports = {
  createTemplate,
  getTemplateById,
  updateTemplateById,
  deleteTemplateById,
  queryTemplate
};
