// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import {addMatchImageSnapshotCommand} from '@simonsmith/cypress-image-snapshot/command'
import '@percy/cypress'
const fs = require('fs')
const path = require('path')
require('cypress-plugin-steps')

addMatchImageSnapshotCommand()

// can also add any default options to be used
// by all instances of `matchImageSnapshot`
addMatchImageSnapshotCommand({
  failureThreshold: 0.2,
  failureThresholdType: 'percent',
  customDiffConfig: {threshold: 0.0},
  capture: 'viewport'
})
