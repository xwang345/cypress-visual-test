/// <reference types="cypress" />
require('cypress-delete-downloads-folder').addCustomCommand();


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
    interface Chainable {
        setResolution(size: string | [number, number]): void;
        // readPdfFile(pathToPdf: string): Cypress.Chainable<string>;
    }
}

Cypress.Commands.add('setResolution', (size: Cypress.ViewportPreset | [number, number]) => {
    if (Array.isArray(size)) {
        if (size.length !== 2 || typeof size[0] !== 'number' || typeof size[1] !== 'number') {
            throw new Error('When size is an array, it must be a two-element array of numbers [width, height]');
        }
        cy.viewport(size[0], size[1]);
    } else if (typeof size === 'string') {
        cy.viewport(size);
    } else {
        throw new Error('Size must be either a string (a preset viewport size) or a two-element array of numbers [width, height]');
    }
});

// Cypress.Commands.add('readPdfFile', (pathToPdf: string) => {
//     if (typeof pathToPdf !== 'string') {
//         throw new Error('pathToPdf must be a string');
//     }

//     const resolvedPath = path.resolve(pathToPdf)
//     let dataBuffer = fs.readFileSync(resolvedPath);
//     return pdf(dataBuffer).then(text => {
//         return text;
//     });
// });