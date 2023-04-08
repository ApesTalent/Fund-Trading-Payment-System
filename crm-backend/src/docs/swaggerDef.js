const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Funded Trading Plus API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://gitlab.com/fundedtradingplus/funded-trading-plus-crm',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
    },
  ],
};

module.exports = swaggerDef;
