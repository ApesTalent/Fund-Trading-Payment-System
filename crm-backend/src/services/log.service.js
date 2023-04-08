const { Log, Token } = require('../models');
const userService = require('./user.service');

/**
 * Save a token
 * @param {string} user
 * @param {string} endpoint
 * @param {string} parameters
 * @param {string} ip
 */
const saveLog = async (user, endpoint, parameters, ip) => {
  try {
    await Log.create({
      user,
      endpoint,
      parameters,
      ip
    });
  } catch (err) {
    console.log(err)
  }
};

/**
 * save log with Token
 * @param {string} endpoint
 * @param {string} method
 * @param {object} body
 * @param {string} ip
 * @param {string} token
 */
const saveLogWithToken = async (endpoint, method, body, ip, token) => {
  try {
    const tokenDoc = await Token.findOne({ _id: token });
    const user = await userService.getUserById(tokenDoc.user);
    saveLog(user.email, endpoint + ' ' + method, body, ip);
  } catch (err) {
    console.log(err);
  }
};

/**
 * generate log information 
 * @param {string} endpoint
 * @param {string} method
 * @param {object} body
 * @param {string} bearToken
 */
const generateLogInformation = async (endpoint, method, body, ip, bearToken) => {
  if (endpoint.includes('login')) {
    saveLog(body.email, endpoint + ' ' + method, JSON.stringify({email: body.email, password: "******"}), ip);
  } else if (endpoint.includes('logout')) {
    saveLogWithToken(endpoint, method, JSON.stringify(body), ip, body.refreshToken);
  } else if (endpoint.includes('change-password')) {
    saveLogWithToken(endpoint, method, JSON.stringify(body), ip, body.token);
  } else if (endpoint.includes('users') || endpoint.includes('payouts') || endpoint.includes('client')) {
    saveLogWithToken(endpoint, method, JSON.stringify(body), ip, bearToken.split(' ')[1]);
  }
};

module.exports = {
  saveLog,
  saveLogWithToken,
  generateLogInformation
};
