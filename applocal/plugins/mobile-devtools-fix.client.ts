// This plugin prevents DevTools-related errors on mobile devices
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Detect mobile devices including iPad
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Disable Vue DevTools completely on mobile
    if (isMobile) {
      // Prevent DevTools hook from being set up
      Object.defineProperty(window, "__VUE_DEVTOOLS_GLOBAL_HOOK__", {
        get() {
          return undefined;
        },
        set() {
          return false;
        },
        configurable: false,
      });

      // Also disable the legacy hook
      Object.defineProperty(window, "__VUE__", {
        get() {
          return undefined;
        },
        set() {
          return false;
        },
        configurable: false,
      });
    }

    // Override console methods to suppress DevTools errors
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = String(args[0] || "");
      if (
        message.includes("__vrv_devtools") ||
        message.includes("devtools") ||
        message.includes("Vue DevTools") ||
        message.includes("instance.__vrv_devtools") ||
        message.includes("null is not an object")
      ) {
        return; // Suppress DevTools errors
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = String(args[0] || "");
      if (
        message.includes("__vrv_devtools") ||
        message.includes("devtools") ||
        message.includes("Vue DevTools")
      ) {
        return; // Suppress DevTools warnings
      }
      originalWarn.apply(console, args);
    };

    // Prevent any DevTools-related code from executing
    if (isMobile) {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (
        type,
        listener,
        options
      ) {
        // Block DevTools-related events
        if (
          typeof listener === "function" &&
          listener.toString().includes("devtools")
        ) {
          return;
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    }
  }
});
