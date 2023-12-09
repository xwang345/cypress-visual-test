describe('Visual Regression', () => {
    it('visual regression test', () => {
        cy.visit('https://example.com');
        cy.matchImageSnapshot();
    });
});