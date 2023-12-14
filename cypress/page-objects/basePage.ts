export default class BasePage {
    static pause(ms: number): void {
        cy.wait(ms)
    }

    static logInfo(message: string): void {
        cy.log(message)
    }

    static setMobileViewport(): void {
        cy.viewport('iphone-x')
    }

    static setTabletViewport(): void {
        cy.viewport('ipad-2');
    }

    static setDesktopViewport(): void {
        cy.viewport('macbook-13');
    }

    static setLargeDesktopViewport(): void {
        cy.viewport(1980, 1080);
    }
}