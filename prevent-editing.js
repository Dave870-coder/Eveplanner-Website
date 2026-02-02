// prevent-editing.js — best-effort client-side guard against in-browser editing
// NOTE: This is a best-effort deterrent. Determined users can still edit pages via DevTools.

(function () {
  'use strict';

  function disableEditing() {
    try {
      // Turn off designMode if any script set it
      try { document.designMode = 'off'; } catch (e) {}

      // Remove any existing contenteditable attributes
      document.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

      // Prevent future attempts to set contenteditable via setAttribute
      const origSetAttr = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function (name, value) {
        if (!name) return origSetAttr.apply(this, arguments);
        const n = String(name).toLowerCase();
        if (n === 'contenteditable') return; // ignore attempts to make elements editable
        return origSetAttr.apply(this, arguments);
      };

      // Prevent direct assignment to contentEditable property
      try {
        Object.defineProperty(Element.prototype, 'contentEditable', {
          set: function () {},
          get: function () { return 'false'; },
          configurable: false
        });
      } catch (e) {}

      // Prevent execCommand altering content (best-effort)
      const origExec = document.execCommand;
      document.execCommand = function (cmd) {
        const forbidden = ['contentReadOnly', 'enableObjectResizing', 'enableInlineTableEditing'];
        if (forbidden.includes(String(cmd))) return false;
        return origExec.apply(document, arguments);
      };

      // Disable drag & drop that could inject editable elements
      window.addEventListener('dragstart', e => e.preventDefault());
      window.addEventListener('drop', e => e.preventDefault());

      // Warn in console to discourage casual tampering
      console.info('Site editing protections are active (deterrent only). For changes, edit source files on the server/repo.');
    } catch (err) {
      // swallow errors - nothing should break the site
      console.error('prevent-editing failure', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableEditing);
  } else {
    disableEditing();
  }
})();
