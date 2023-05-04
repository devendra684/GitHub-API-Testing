// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   reporter: 'cypress-mochawesome-reporter',
//   e2e: {
//     setupNodeEvents(on, config) {
//       require('cypress-mochawesome-reporter/plugin')(on);
//     },
//     specPattern: 'cypress/integration/*'
//   },
// });
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/integration/*'
  },
});

// const { defineConfig } = require("cypress");

// async function setupNodeEvents(on, config) {
//   // implement node event listeners here
//   // this is required for the preprocessor to be generate json, were my test are written
//   return config;
//   }

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents,
//       // implement node event listeners here
//       specPattern: 'cypress/integration/*'
//       // specPattern: 'cypress/UAT/features/*.{js,feature}',
//     },
//     chromeWebSecurity: false
// });

//       // baseUrl: 'https://api.github.com',
