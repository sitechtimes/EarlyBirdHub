// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ["@nuxtjs/tailwindcss", "daisyui", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Roboto: [300, 400, 500, 700],
      "Playfair Display": [400, 500, 600, 700],
      "Source Sans Pro": [400, 600, 700],
      Montserrat: [400, 500, 600, 700],
      "Open Sans": [400, 600, 700],
    },
    display: "swap",
    preload: true,
  },
  nitro: {
    publicAssets: [
      {
        baseURL: "/.well-known",
        dir: "public/.well-known",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      },
    ],
  },
  runtimeConfig: {
    apiSecret: "",
  },
});
