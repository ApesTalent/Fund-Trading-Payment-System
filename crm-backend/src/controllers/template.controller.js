const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { templateService } = require("../services");

const createTemplate = catchAsync(async (req, res) => {
  const template = await templateService.createTemplate(req.body);
  res.status(httpStatus.CREATED).send(template);
});

const getTemplates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["group"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await templateService.queryTemplate(filter, options);
  res.send(result);
});

module.exports = {
    createTemplate,
    getTemplates,
};
