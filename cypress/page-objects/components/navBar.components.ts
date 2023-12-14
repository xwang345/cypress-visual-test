export default class NavBar {
    static clickOnLineStatementsTab(): void {
        cy.get('#online_statements_tab').click();
    }
}