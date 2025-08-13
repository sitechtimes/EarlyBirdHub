// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: false, // Completely disable for mobile compatibility
    timeline: {
      enabled: false,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "daisyui",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
  ],
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
  ssr: true,
  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      meta: [{ name: "format-detection", content: "telephone=no" }],
    },
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
    public: {
      supabaseUrl: "",
      supabaseAnonKey: "",
      backendUrl: "",
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
