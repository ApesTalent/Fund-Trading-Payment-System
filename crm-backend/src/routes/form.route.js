const express = require('express');
const authForm = require('../middlewares/authForm');
const validate = require('../middlewares/validate');
const payoutValidation = require('../validations/payout.validation');
const payoutController = require('../controllers/payout.controller');

const router = express.Router();

router.get('/', authForm, payoutController.getPayout);
router.patch('/', authForm, validate(payoutValidation.updateForm), payoutController.updateAwaitingPayoutAndSendEmail);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Form
 *   description: Payout management and retrieval
 */

/**
 * @swagger
 * /form:
 *
 *   get:
 *     summary: Get all payouts
 *     description: Only admins can retrieve all payouts.
 *     tags: [Form]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: payout token
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
