export default defineNuxtPlugin(() => {
  // Suppress Vue Router warnings for image paths in development
  if (process.dev) {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];

      // Suppress Vue Router warnings for image paths
      if (
        typeof message === "string" &&
        message.includes(
          "[Vue Router warn]: No match found for location with path"
        ) &&
        message.includes("/daily-links-images/")
      ) {
        return; // Don't log these specific warnings
      }

      // Log all other warnings normally
      originalWarn.apply(console, args);
    };
  }
});
