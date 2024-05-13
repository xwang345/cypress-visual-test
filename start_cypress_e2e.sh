#!/bin/bash
npm run cy:test
npx mochawesome-merge cypress/reports/mochawesome-report/*.json > cypress/reports/mochawesome-report/combined-report.json
npx marge cypress/reports/mochawesome-report/combined-report.json -f report -o cypress/reports
npx ts-node mochawesome-reporter-server.ts