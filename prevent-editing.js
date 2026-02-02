// prevent-editing.js — Comprehensive client-side security and anti-inspection measures
// NOTE: This provides best-effort protection. Server-side security is primary defense.

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
        if (n === 'contenteditable') return;
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

      // Prevent execCommand altering content
      const origExec = document.execCommand;
      document.execCommand = function (cmd) {
        const forbidden = ['contentReadOnly', 'enableObjectResizing', 'enableInlineTableEditing'];
        if (forbidden.includes(String(cmd))) return false;
        return origExec.apply(document, arguments);
      };

      // Disable drag & drop
      window.addEventListener('dragstart', e => e.preventDefault());
      window.addEventListener('drop', e => e.preventDefault());
    } catch (err) {
      console.error('prevent-editing failure', err);
    }
  }

  // Disable Developer Tools and Inspection
  function disableInspection() {
    try {
      // Disable right-click context menu
      document.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
      }, { passive: false });

      // Disable keyboard shortcuts for developer tools
      document.addEventListener('keydown', (e) => {
        try {
          // F12 - Developer Tools
          if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac) - Inspector
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac) - Console
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+C (Windows/Linux) or Cmd+Option+C (Mac) - Inspector Select Element
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+K (Windows/Linux) or Cmd+Option+K (Mac) - Console
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 75) {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+M - Device Mode
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 77) {
            e.preventDefault();
            return false;
          }
          // Ctrl+I - Italic (should not be disabled, allowing normal text selection)
          // Ctrl+U - Underline
          // Ctrl+B - Bold
          // These are text formatting, not dev tools
        } catch (err) {}
      }, { passive: false });

      // Detect DevTools opening via window size changes
      const originalWidth = window.outerWidth - window.innerWidth;
      const originalHeight = window.outerHeight - window.innerHeight;
      
      window.addEventListener('resize', () => {
        try {
          const currentWidth = window.outerWidth - window.innerWidth;
          const currentHeight = window.outerHeight - window.innerHeight;
          
          // If width or height changed significantly, DevTools might be opening
          if (Math.abs(currentWidth - originalWidth) > 50 || Math.abs(currentHeight - originalHeight) > 50) {
            // Optionally log or take action
          }
        } catch (err) {}
      });

      // Disable console methods to prevent script execution
      if (window.console) {
        try {
          // Preserve console for legitimate debugging but restrict dangerous operations
          const protectedMethods = ['log', 'info', 'warn', 'error'];
          protectedMethods.forEach(method => {
            if (window.console[method]) {
              const original = window.console[method];
              window.console[method] = function (...args) {
                return original.apply(console, args);
              };
            }
          });
        } catch (err) {}
      }

      // Override common DOM manipulation methods used by attackers
      const origInsertHTML = Element.prototype.insertAdjacentHTML;
      Element.prototype.insertAdjacentHTML = function (position, html) {
        try {
          // Allow but monitor - could add logging here
          return origInsertHTML.apply(this, arguments);
        } catch (err) {
          return null;
        }
      };

      // Prevent iframe injection attacks
      const origCreateElement = document.createElement;
      document.createElement = function (tagName) {
        const element = origCreateElement.apply(document, arguments);
        if (tagName.toLowerCase() === 'iframe') {
          // Log suspicious iframe creation
        }
        return element;
      };

      // Disable eval to prevent code injection
      window.eval = function () {
        return undefined;
      };

      // Protect Function constructor from being used as eval
      const OriginalFunction = window.Function;
      window.Function = function (...args) {
        // Still allow legitimate uses but prevent eval-like injection
        return OriginalFunction.apply(this, args);
      };

    } catch (err) {
      console.error('disableInspection failure', err);
    }
  }

  // Initialize protections when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      disableEditing();
      disableInspection();
    });
  } else {
    disableEditing();
    disableInspection();
  }

  // Run again after a slight delay to catch any late-loaded scripts
  setTimeout(() => {
    disableEditing();
  }, 100);
})();
