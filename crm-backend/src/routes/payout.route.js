const express = require('express');
const auth = require('../middlewares/auth');
const authForm = require('../middlewares/authForm');
const validate = require('../middlewares/validate');
const payoutValidation = require('../validations/payout.validation');
const payoutController = require('../controllers/payout.controller');
const router = express.Router();

router.route('/sendEmail').post(auth('managePayout'), validate(payoutValidation.sendEmail), payoutController.sendEmail);

router.route('/getFlag/:fId').get(auth('managePayout'), validate(payoutValidation.getFlag), payoutController.getFlag);

router
  .route('/')
  .post(auth('managePayout'), validate(payoutValidation.createPayout), payoutController.createPayout)
  .get(auth('managePayout'), validate(payoutValidation.getPayouts), payoutController.getPayouts);

router
  .route('/:pId')
  .post(auth('managePayout'), validate(payoutValidation.sendPayout), payoutController.sendPayout)
  .get(auth('managePayout'), validate(payoutValidation.getPayout), payoutController.getPayout)
  .patch(auth('managePayout'), validate(payoutValidation.updatePayout), payoutController.updatePayout)
  .delete(auth('managePayout'), validate(payoutValidation.deletePayout), payoutController.deletePayout);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payouts
 *   description: Payout management and retrieval
 */

/**
 * @swagger
 * /payouts:
 *   post:
 *     summary: Create a payout
 *     description: Only admins can create other payouts.
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - amount
 *               - tradingAccount
 *               - status
 *               - invoice
 *               - payoutMethod
 *               - payoutDetails
 *               - paidDate
 *               - paidBy
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               amount:
 *                  type: string
 *               tradingAccount:
 *                  type: number
 *               status:
 *                 type: string
 *               purpose:
 *                 type: string
 *               invoice:
 *                 type: string
 *               payoutMethod:
 *                  type: string
 *               payoutDetails:
 *                  type: array
 *               paidDate:
 *                  type: string
 *               paidBy:
 *                  type: string
 *             example:
 *               name: Kamile Talha
 *               email: kamile@example.com
 *               amount: 99.99
 *               tradingAccount: 88898095
 *               status: request
 *               purpose: Trader Payout
 *               invoice: 123123454
 *               payoutMethod: cryptocurrency
 *               payoutDetails: [{"type": "IBAN", value: "XXXXXXXXX"}, {"type": "BIC", "value": "XXXXXX"}]
 *               paidDate: 11/30/2022
 *               paidBy: Owner
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Payout'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all payouts
 *     description: Only admins can retrieve all payouts.
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: payout name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: payout status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of payouts
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payout'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /payouts/{id}:
 *   get:
 *     summary: Get a payout
 *     description: Logged in payouts can fetch only their own payout information. Only admins can fetch other payouts.
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: payout id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Payout'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a payout
 *     description: Logged in payouts can only update their own information. Only admins can update other payouts.
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: payout id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               amount:
 *                  type: string
 *               tradingAccount:
 *                  type: number
 *               status:
 *                 type: string
 *               purpose:
 *                 type: string
 *               invoice:
 *                 type: string
 *               payoutMethod:
 *                  type: string
 *               payoutDetails:
 *                  type: object
 *               paidDate:
 *                  type: string
 *               paidBy:
 *                  type: string
 *             example:
 *               name: Kamile Talha
 *               email: kamile@example.com
 *               amount: 99.99
 *               tradingAccount: 88898095
 *               status: Request
 *               purpose: Trader Payout
 *               invoice: 12315464566
 *               payoutMethod: cryptocurrency
 *               payoutDetails: [{"type": "IBAN", value: "XXXXXXXXX"}, {"type": "BIC", "value": "XXXXXX"}]
 *               paidDate: 11/30/2022
 *               paidBy: Owner
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Payout'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a payout
 *     description: Logged in payouts can delete only themselves. Only admins can delete other payouts.
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: payout id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /payouts/sendEmail:
 *   post:
 *     summary: sendEmail
 *     description: Logged in payouts can send email (Information Needed - Pending Payout).
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pId
 *               - to
 *             properties:
 *               pId:
 *                 type: string
 *               to:
 *                 type: string
 *             example:
 *               pId: 63f772fcafc1251ac0442903
 *               to: devmetaverse34@gmail.com
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

