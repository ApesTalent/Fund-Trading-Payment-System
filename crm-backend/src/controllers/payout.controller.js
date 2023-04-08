const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { payoutService, emailService, flagService } = require("../services");
const { statusTypes } = require("../config/status");
const { email } = require("../config/config");

const createPayout = catchAsync(async (req, res) => {
  const payout = await payoutService.createPayout(req.body);
  res.status(httpStatus.CREATED).send(payout);
});

const getPayouts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await payoutService.getPayoutsWithFlag(filter, options);
  res.send(result);
});

const getPayout = catchAsync(async (req, res) => {
  const payout = await payoutService.getPayoutById(req.params.pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }
  res.send(payout);
});

const updatePayout = catchAsync(async (req, res) => {
  const payout = await payoutService.updatePayoutById(req.params.pId, req.body);
  if (req.body.status === statusTypes.FINALIZED) {
    emailService.sendFinalizedEmail(req.params.pId);
  }
  res.send(payout);
});

const deletePayout = catchAsync(async (req, res) => {
  await payoutService.deletePayoutById(req.params.pId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendEmail = catchAsync(async (req, res) => {
  await emailService.sendPendingEmail(req.body.to, req.body.pId, req.user.name);
  res.status(httpStatus.OK).send();
});

const updateAwaitingPayoutAndSendEmail = catchAsync(async (req, res) => {
  req.body.status = statusTypes.AWAITING_PAYMENT;
  const payout = await payoutService.updatePayoutById(req.params.pId, req.body);
  await emailService.sendConfirmedEmail(req.params.pId);
  res.send(payout);
});

const sendPayout = catchAsync(async (req, res) => {
  await payoutService.sendPayoutById(req.params.pId);
  await emailService.sendCryptoPaymentEmail(req.params.pId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getFlag = catchAsync(async (req, res) => {
  const flag = await flagService.getFlagById(req.params.fId);
  if (!flag) {
    throw new ApiError(httpStatus.NOT_FOUND, "Flag not found");
  }
  res.send(flag);
});

module.exports = {
  createPayout,
  getPayouts,
  getPayout,
  updatePayout,
  deletePayout,
  sendEmail,
  updateAwaitingPayoutAndSendEmail,
  sendPayout,
  getFlag
};
