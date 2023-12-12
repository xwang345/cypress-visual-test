import { defineConfig } from "cypress";
import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin'
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

export default defineConfig({
  projectId: "37z5fo",
  e2e: {
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      addMatchImageSnapshotPlugin(on)
      allureWriter(on, config);
      return config;
    },
    // testIsolation: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 10000,
    waitForAnimations: true,
    env: {
      allure: true,
      allureAttachRequests: true,
      allureAddVideoOnPass: true
    }
  },
});
