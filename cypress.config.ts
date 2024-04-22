import { defineConfig } from "cypress";
import { addMatchImageSnapshotPlugin } from "@simonsmith/cypress-image-snapshot/plugin";
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
import { readPdfFunc } from "./cypress/scripts/readPdf";
const { removeDirectory } = require("cypress-delete-downloads-folder");

export default defineConfig({
	projectId: "unvwyq", // your project id from cypress dashboard
	e2e: {
		video: true, // enable video recording
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on("task", {
				readPdfFunc,
			}),
				on("task", {
					removeDirectory,
				}),
				addMatchImageSnapshotPlugin(on);
			allureWriter(on, config); // enable allure report generation
			return config;
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
