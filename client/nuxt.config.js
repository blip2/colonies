import colors from "vuetify/es5/util/colors";

export default {
  target: "static",

  head: {
    titleTemplate: "%s - Bradfield Centre",
    title: "Colonies",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  css: [
    "@mdi/font/css/materialdesignicons.css",
    "@fontsource/roboto/400.css",
    "@fontsource/roboto/500.css",
    "@fontsource/roboto/700.css",
  ],
  plugins: [],
  components: true,
  buildModules: ["@nuxtjs/vuetify"],
  modules: ["nuxt-socket-io"],
  vuetify: {
    defaultAssets: false,
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  build: {},
  server: {
    host: "0",
    port: 3000,
  },
  io: {
    sockets: [
      {
        name: "service",
        url: process.env.NUXT_ENV_SOCKET_URI,
        default: true,
      },
    ],
  },
};
