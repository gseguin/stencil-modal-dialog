import { Config } from '@stencil/core';

/*
 * This Stencil configuration defines a simple build for the `modal-dialog`
 * component.  The `dist` output produces a distributable package with
 * ES modules and custom elements, while the `www` output is useful for
 * local development and integration testing.  The service worker is
 * disabled for clarity during testing.
 */
export const config: Config = {
  namespace: 'modal-dialog-component',
  srcDir: 'src',
  buildEs5: false,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'http://localhost:3333',
    },
  ],
};
