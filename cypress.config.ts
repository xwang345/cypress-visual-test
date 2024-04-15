import { defineConfig } from "cypress";
import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin'
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
import { readPdfFunc } from './cypress/scripts/readPdf';
const { removeDirectory } = require('cypress-delete-downloads-folder');


export default defineConfig({
  projectId: 'dr5boy',
  e2e: {
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        readPdfFunc,
      }),
      on('task',{
         removeDirectory 
      }),
      addMatchImageSnapshotPlugin(on)
      allureWriter(on, config);
      return config;
    },
    downloadsFolder: 'cypress/downloads',
    trashAssetsBeforeRuns: true,
    testIsolation: false,
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

// write a jsDoc comments for the function
// /**
//  * 
//  * @param pathToPdf 
//  * @returns 
//  */
// // const readPdfFunc = (pathToPdf: string): Promise<string> => {
// function readPdfFunc(pathToPdf: string) {
//   return new Promise((resolve) => {
//     if (typeof pathToPdf !== 'string') {
//       throw new Error('pathToPdf must be a string')
//     }

//     const pdfPath = path.resolve(pathToPdf)
//     let dataBuffer = fs.readFileSync(pdfPath);
//     pdf(dataBuffer).then(({ text }) => {
//       resolve(text)
//     });
//   });
// }
