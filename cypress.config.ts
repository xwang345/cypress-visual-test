import { defineConfig } from "cypress";
import { addMatchImageSnapshotPlugin } from "@simonsmith/cypress-image-snapshot/plugin";
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
import { readPdfFunc } from "./cypress/scripts/readPdf";
const { removeDirectory } = require("cypress-delete-downloads-folder");
const cypressSplit = require("cypress-split");

export default defineConfig({
	projectId: "p1ohud", // your project id from cypress dashboard
	video: true, // enable video recording
	videosFolder: "cypress/videos", // videos folder
	screenshotsFolder: "cypress/screenshots", // screenshots folder
	e2e: {
		reporter: "mochawesome",
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on("task", {
				readPdfFunc,
			}),
			on("task", {
				removeDirectory,
			}),
			addMatchImageSnapshotPlugin(on); // enable image snapshot
			allureWriter(on, config); // enable allure report generation
			cypressSplit(on, config);
			return config;
		},
		reporterOptions: {
			reportDir: "cypress/reports/mochawesome-report",
			reportTitle: "Cypress Mochawesome E2E Test Report",
			reportFilename: "[name].html",
			overwrite: true,
			html: true,
			chart: true,
			json: true,
		},
		downloadsFolder: "cypress/downloads",
		trashAssetsBeforeRuns: true, // remove assets before each run
		testIsolation: false, // enable test isolation
		defaultCommandTimeout: 10000,
		pageLoadTimeout: 10000,
		waitForAnimations: true,
		env: {
			allure: true, // enable allure report generation
			allureAttachRequests: true, // enable allure report generation for requests
			allureAddVideoOnPass: true, // enable allure report generation for video on pass
			allureResultsPath: "allure-results", // allure results path
		},
	},
});
