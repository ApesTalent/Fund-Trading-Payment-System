const mongoose = require("mongoose");
const config = require("./config/config");

const conn = mongoose.createConnection(
  config.mongoose.mongo_url,
  config.mongoose.options
);

const crmConnection = conn.useDb(config.mongoose.crm_url);
const clientConnection = conn.useDb(config.mongoose.client_url);

module.exports = {
  clientConnection,
  crmConnection,
};
