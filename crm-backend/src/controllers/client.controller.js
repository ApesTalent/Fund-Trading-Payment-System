const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { clientService, emailService } = require("../services");
const HTMLParser = require("node-html-parser");

const createClient = catchAsync(async (req, res) => {
  const client = await clientService.createClient(req.body);
  res.status(httpStatus.CREATED).send(client);
});

const getClients = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await clientService.queryClient(filter, options);
  res.send(result);
});

const getClient = catchAsync(async (req, res) => {
  const client = await clientService.getClientById(req.params.cId);
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found");
  }
  res.send(client);
});

const updateClient = catchAsync(async (req, res) => {
  const client = await clientService.updateClientById(req.params.cId, req.body);
  res.send(client);
});

const deleteClient = catchAsync(async (req, res) => {
  await clientService.deleteClientById(req.params.cId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendEmail = catchAsync(async (req, res) => {
  await emailService.sendInformationEmail(
    req.body.to,
    req.body.templateId,
    req.body.variables
  );
  res.status(httpStatus.OK).send();
});

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  sendEmail,
};
