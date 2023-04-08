const httpStatus = require("http-status");
const { Overview } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a Overview
 * @param {Object} clientBody
 * @returns {Promise<Overview>}
 */
const createClient = async (clientBody) => {
  return Overview.create(clientBody);
};

/**
 * Query for Client
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClient = async (filter, options) => {
  var clients = [];
  if (filter.name) {
    clients = await Overview.find({
      $or: [
        { name: { $regex: filter.name, $options: "i" } },
        { email: { $regex: filter.name, $options: "i" } },
        { _id: { $regex: filter.name, $options: "i" } },
        {"accounts.login" : Number(filter.name)}
      ],
    });
  } else {
    clients = await Overview.paginate(filter, options);
  }
  return clients;
};

/**
 * Get Client by id
 * @param {ObjectId} id
 * @returns {Promise<Overview>}
 */
const getClientById = async (id) => {
  return Overview.findById(id);
};

/**
 * Get Client by email
 * @param {string} email
 * @returns {Promise<Overview>}
 */
const getClientByName = async (email) => {
  return Overview.find({ email });
};

/**
 * Get Client by email
 * @param {string} email
 * @returns {Promise<Overview>}
 */
const getClientByEmail = async (name) => {
  return Overview.find({ name });
};

/**
 * Update client by id
 * @param {ObjectId} cId
 * @param {Object} updateBody
 * @returns {Promise<Overview>}
 */
const updateClientById = async (cId, updateBody) => {
  const client = await getClientById(cId);
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found");
  }
  Object.assign(client, updateBody);
  await client.save();
  return client;
};

/**
 * Delete client by id
 * @param {ObjectId} cId
 * @returns {Promise<Overview>}
 */
const deleteClientById = async (cId) => {
  const client = await getClientById(cId);
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found");
  }
  await client.remove();
  return client;
};

module.exports = {
  createClient,
  queryClient,
  getClientById,
  getClientByEmail,
  getClientByName,
  updateClientById,
  deleteClientById,
};
