import { Component, Host, h, Method, Element } from '@stencil/core';

/**
 * A simple modal dialog component built with Stencil.
 *
 * The component leverages the native `<dialog>` element when it is available in
 * the host browser. For browsers that do not yet support `<dialog>`, it
 * dynamically loads the widely‑used `dialog-polyfill` from a CDN. Once the
 * polyfill module is loaded it registers the dialog and injects the required
 * stylesheet into the document head.
 */
@Component({
  tag: 'modal-dialog',
  styleUrl: 'modal-dialog.css',
  shadow: true,
})
export class ModalDialog {
  /**
   * A reference to the host element.  This is used to look up the `dialog`
   * element once the component has mounted.
   */
  @Element() host!: HTMLElement;

  /** The underlying dialog element within the shadow DOM. */
  private dialogEl?: HTMLDialogElement;

  /**
   * After the component loads, test for native `<dialog>` support.  If it
   * isn't present (or `showModal` is missing) then a polyfill is loaded from
   * jsDelivr.  The polyfill is only fetched when needed which avoids adding
   * unnecessary code to modern browsers.
   */
  async componentDidLoad() {
    // Grab the dialog element from the shadow root.  This is safe here
    // because the element is rendered synchronously.
    this.dialogEl = this.host.shadowRoot!.querySelector('dialog') as HTMLDialogElement;

    // Check for native support.  Some older browsers define the constructor
    // but don't implement `showModal()`.
    const nativeSupported = !!window.HTMLDialogElement && typeof this.dialogEl.showModal === 'function';
    if (!nativeSupported) {
      // Dynamically import the ESM build of dialog‑polyfill from a CDN.  Using
      // import() ensures that the code is only fetched when needed.
      const polyfillModule = await import(
        /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.esm.js'
      );
      // Register the dialog with the polyfill so that it gains `showModal()`
      // behaviour and closes when the user presses Esc or clicks the backdrop.
      polyfillModule.default.registerDialog(this.dialogEl);

      // Load the polyfill stylesheet.  Without this the dialog will not be
      // visually overlayed on older browsers.  Injecting here avoids loading
      // the CSS in browsers that support `<dialog>` natively.
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.css';
      document.head.appendChild(link);
    }
  }

  /**
   * Open the modal dialog.  When native support is present `showModal()` is
   * invoked on the underlying `dialog` element.  If the polyfill is in use
   * (or if the browser exposes a partial implementation without
   * `showModal()`), a fallback of simply setting the `open` attribute is
   * applied.
   */
  @Method()
  async openModal(): Promise<void> {
    if (!this.dialogEl) return;
    if (typeof this.dialogEl.showModal === 'function') {
      this.dialogEl.showModal();
    } else {
      this.dialogEl.setAttribute('open', '');
    }
  }

  /**
   * Close the modal dialog.  Similar to `openModal()`, this method calls
   * the native `.close()` API where available, otherwise it removes the
   * `open` attribute to hide the dialog.  This method is exposed so that
   * external code (or consumers of the component) can programmatically
   * dismiss the dialog.
   */
  @Method()
  async close(): Promise<void> {
    if (!this.dialogEl) return;
    if (typeof this.dialogEl.close === 'function') {
      this.dialogEl.close();
    } else {
      this.dialogEl.removeAttribute('open');
    }
  }

  render() {
    return (
      <Host>
        <dialog>
          <div class="content">
            <slot></slot>
          </div>
          <button class="close-button" onClick={() => this.close()}>
            Close
          </button>
        </dialog>
      </Host>
    );
  }
}
