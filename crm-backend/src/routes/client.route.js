const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const clientValidation = require('../validations/client.validation');
const clientController = require('../controllers/client.controller');
const router = express.Router();

router.route('/sendEmail').post(auth('manageClient'), validate(clientValidation.sendEmail), clientController.sendEmail);

router
  .route('/')
  .post(auth('manageClient'), validate(clientValidation.createClient), clientController.createClient)
  .get(auth('manageClient'), validate(clientValidation.getClients), clientController.getClients);

router
  .route('/:cId')
  .get(auth('manageClient'), validate(clientValidation.getClient), clientController.getClient)
  .patch(auth('manageClient'), validate(clientValidation.updateClient), clientController.updateClient)
  .delete(auth('manageClient'), validate(clientValidation.deleteClient), clientController.deleteClient);

module.exports = router;

