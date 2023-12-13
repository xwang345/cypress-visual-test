describe('Visual Regression', () => {
    before(() => {
        cy.visit('http://zero.webappsecurity.com/index.html');
        cy.get('#signin_button').click();
        cy.get('#user_login').type('username');
        cy.get('#user_password').type('password');
        cy.get('#user_remember_me').click();
        cy.get('input[name="submit"]').click();
    });

    it('Should load account activity', () => {
        cy.get('#account_activity_tab').click();
    });

    it('Data table snapshot', () => {
        cy.matchImageSnapshot();
    });

    it('should verify the content of the pdf file', () => {
        cy.get('#download_transactions').click();
        cy.wait(3000);
        cy.task('readPdf', 'cypress/downloads/transaction.pdf').then((pdfData) => {
            expect(pdfData.text).to.contain('Date Description Amount');
        });
    })
})