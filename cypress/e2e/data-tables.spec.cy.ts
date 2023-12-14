import NavBar from "../page-objects/components/navBar.components";
import OnlineStatementsPage from "../page-objects/pages/onlineStatements.page";

describe('Visual Regression', () => {
    before(() => {
        cy.visit('http://zero.webappsecurity.com/index.html');
        cy.get('#signin_button').click();
        cy.get('#user_login').click().type('username');
        cy.get('#user_password').click().type('password');
        cy.get('#user_remember_me').click();
        cy.get('input[name="submit"]').click();
    });

    it('Should load account activity', () => {
        cy.step('click on account activity tab');
        cy.get('#account_activity_tab').click();
    });

    it('Data table snapshot', () => {
        cy.matchImageSnapshot();
    });

    it('should verify the content of the pdf file', () => {
        NavBar.clickOnLineStatementsTab();

        cy.step('Select statement year and account');
        OnlineStatementsPage.selectAccount('Loan');
        OnlineStatementsPage.selectStatementYear(2012);

        cy.step('Download statement');
        OnlineStatementsPage.downloadStatement('Statement 01/10/12(57K)');

        cy.task('readPdfFunc', 'cypress/downloads/8534567-01-10-12.pdf').then(pdfContent => {
            //verify the content of the pdf file
            expect(pdfContent).to.contain('Customer ID:');
            expect(pdfContent).to.contain('Statements');
            expect(pdfContent).to.contain('Company Name');
        });
    })
})