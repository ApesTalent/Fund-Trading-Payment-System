const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const payoutRoute = require('./payout.route');
const formRoute = require('./form.route');
const docsRoute = require('./docs.route');
const clientRoute = require('./client.route');
const templateRoute = require('./template.route');
const config = require('../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/payouts',
    route: payoutRoute,
  },
  {
    path: '/form',
    route: formRoute,
  },
  {
    path:  '/client',
    route: clientRoute,
  },
  {
    path: '/template',
    route: templateRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
