const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const templateValidation = require('../validations/template.validation');
const templateController = require('../controllers/template.controller');
const router = express.Router();

router
  .route('/')
  .post(auth('manageTemplates'), validate(templateValidation.createTemplate), templateController.createTemplate)
  .get(auth('manageTemplates'), validate(templateValidation.getTemplates), templateController.getTemplates);

module.exports = router;

