import BasePage from "../basePage";

export default class OnlineStatementsPage extends BasePage {
    static verifyOnlineStatementsPage(): void {
        cy.get('.board-header').each((title) => {
            cy.log(title.text());
        });
    }

    static selectStatementYear(year: number): void {
        cy.contains('[data-toggle="pill"]', year).click();
    }

    static selectAccount(account: string): void {
        cy.get('#os_accountId').select(account);

    }

    static downloadStatement(statement: string): void {
        cy.contains('td', statement).click();
        cy.wait(5000); // wait for download to complete
    }
}