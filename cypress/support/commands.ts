/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/*
declare namespace Cypress {
    interface Chainable {
        setResolution(size: string | [number, number]): void;
    }
}

Cypress.Commands.add("setResolution", (size: string | [number, number]) => {
    if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
    } else {
        cy.viewport(size);
    }
});
*/

declare namespace Cypress {
    interface Chainable {
        setResolution(size: string | [number, number]): void;
    }
}

Cypress.Commands.add("setResolution", (size: Cypress.ViewportPreset | [number, number]) => {
    if (Array.isArray(size)) {
        if (size.length !== 2 || typeof size[0] !== 'number' || typeof size[1] !== 'number') {
            throw new Error('When size is an array, it must be a two-element array of numbers');
        }
        cy.viewport(size[0], size[1]);
    } else if (typeof size === 'string') {
        cy.viewport(size);
    } else {
        throw new Error('Size must be either a string or a two-element array of numbers');
    }
});