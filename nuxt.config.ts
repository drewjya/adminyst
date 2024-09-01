// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  devServer: {
    port: 9900,
  },
  imports: {
    autoImport: true,
  },
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    ["@pinia/nuxt", { autoImports: ["defineStore", "defineStore"] }],
  ],

  runtimeConfig: {
    public: {
      // baseUrl: "https://api.ystfamily.com/api",
      imageUrl: "https://api.ystfamily.com/img/",

      baseUrl: "http://localhost:3000/api",

      // imageUrl: "http://localhost:3000/img/",
    },
  },
});
