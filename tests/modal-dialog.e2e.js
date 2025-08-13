/*
 * End‑to‑end tests for the `modal-dialog` component.
 *
 * These tests exercise the component across browsers with and without
 * native `<dialog>` support.  They load the root page of the Stencil
 * application and interact with the component via its public methods.
 */

const assert = require('assert');

describe('modal-dialog component', () => {
  it('should open and close the dialog via its public API', async () => {
    // Navigate to the root page.  The `baseUrl` is configured in wdio.conf.js.
    await browser.url('/');

    // Locate the custom element on the page.  Stencil defines the custom
    // element globally, so it can be selected directly by tag name.
    const modal = await $('modal-dialog');
    assert.ok(await modal.isExisting(), 'expected modal-dialog element to exist');

    // Ensure the modal is initially closed.  The underlying dialog element
    // should not have the `open` attribute.
    const isOpenInitially = await browser.execute((el) => {
      const dialog = el.shadowRoot.querySelector('dialog');
      return dialog.hasAttribute('open');
    }, modal);
    assert.strictEqual(isOpenInitially, false, 'dialog should start closed');

    // Call the component's `openModal()` method using `execute`.  Methods
    // exposed via the Stencil `@Method()` decorator can be invoked on the
    // custom element directly.  We avoid interacting with internal DOM so
    // that the test remains agnostic of implementation details.
    await browser.execute((el) => el.openModal(), modal);

    // Wait until the dialog has opened.  For browsers using the polyfill
    // this means the `open` attribute is set.  For native support we can
    // either inspect the attribute or rely on the element being displayed.
    await browser.waitUntil(async () => {
      return await browser.execute((el) => {
        const dialog = el.shadowRoot.querySelector('dialog');
        return dialog.hasAttribute('open');
      }, modal);
    }, {
      timeout: 5000,
      timeoutMsg: 'dialog did not open after calling openModal()'
    });

    // Now close the modal via its public API.  Again, we call into the
    // component rather than clicking the button to exercise the method.
    await browser.execute((el) => el.close(), modal);

    // Wait until the dialog is closed.  The `open` attribute should be
    // removed for both native and polyfilled implementations.
    await browser.waitUntil(async () => {
      return await browser.execute((el) => {
        const dialog = el.shadowRoot.querySelector('dialog');
        return !dialog.hasAttribute('open');
      }, modal);
    }, {
      timeout: 5000,
      timeoutMsg: 'dialog did not close after calling close()'
    });
  });
});
