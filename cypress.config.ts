import { defineConfig } from "cypress";
import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin'

export default defineConfig({
  projectId: "37z5fo",
  e2e: {
    setupNodeEvents(on, conifg) {
      // implement node event listeners here
      addMatchImageSnapshotPlugin(on)
    },
    video: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 10000,
    waitForAnimations: true,
    testIsolation: false
    }
});
