const jwt = require('jsonwebtoken');
const config = require('../config/config');
const payoutService = require('../services/payout.service');

const authForm = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(403).send('Access denied.');
    const payload = jwt.verify(token, config.jwt.secret);
    req.params.pId = payload.sub;
    const payout = await payoutService.getPayoutById(req.params.pId);
    if (!payout) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payout not found');
    }
    if (payout.invoice) {
      res.status(400).send('Used token');
    } else {
      next();
    }
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

module.exports = authForm;
