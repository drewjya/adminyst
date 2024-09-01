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
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxt/image"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */

    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      // baseUrl: "https://api.ystfamily.com/api",
      imageUrl: "https://api.ystfamily.com/img/",

      baseUrl: "http://localhost:3000/api",

      // imageUrl: "http://localhost:3000/img/",
    },
  },
});
