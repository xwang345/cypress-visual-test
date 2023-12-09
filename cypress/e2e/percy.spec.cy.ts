describe('Visual Testing with Percy and Cypress', () => {
    it('should take percy snapshot', () => {
        cy.visit('http://example.com')
        cy.wait(1000)
        cy.percySnapshot()
    });
});