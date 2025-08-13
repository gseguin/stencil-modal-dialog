const path = require('path');

/*
 * WebdriverIO configuration for executing end‑to‑end tests on BrowserStack.
 *
 * This config defines two capabilities: one targeting a modern Chrome
 * version with native `<dialog>` support, and another targeting Internet
 * Explorer 11 which requires the dialog polyfill.  The credentials for
 * BrowserStack should be supplied via the `BROWSERSTACK_USERNAME` and
 * `BROWSERSTACK_ACCESS_KEY` environment variables.
 */
exports.config = {
  // BrowserStack credentials will be read from the environment.  See
  // https://www.browserstack.com/docs/automate/selenium/configure-tests
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  specs: [path.join(__dirname, 'tests', '**', '*.e2e.js')],
  exclude: [],

  maxInstances: 2,
  capabilities: [
    {
      browserName: 'chrome',
      'bstack:options': {
        os: 'Windows',
        osVersion: '11',
        sessionName: 'modal-dialog-native',
        buildName: 'modal-dialog-component-tests',
      },
    },
    {
      browserName: 'internet explorer',
      browserVersion: '11.0',
      'bstack:options': {
        os: 'Windows',
        osVersion: '10',
        sessionName: 'modal-dialog-polyfill',
        buildName: 'modal-dialog-component-tests',
      },
    },
  ],

  logLevel: 'info',
  bail: 0,

  // The default port for a Stencil dev server is 3333.  When using
  // BrowserStack Local this should point at your local instance.  If you
  // change the port for your HTTP server, update this value accordingly.
  baseUrl: 'http://localhost:3333',

  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ['browserstack'],

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
