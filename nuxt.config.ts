// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: false, // set true setelah install selesai
  },
  runtimeConfig: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || 'rootpassword',
    dbName: process.env.DB_NAME || 'SITJ_DB',
    jwtSecret: process.env.JWT_SECRET || 'sikons-dev-secret-change-in-prod',
  },
})
