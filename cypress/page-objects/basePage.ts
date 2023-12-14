export default class BasePage {
    pause(ms: number): void {
        cy.wait(ms)
    }

    logInfo(message: string): void {
        cy.log(message)
    }

    setMobileViewport(): void {
        cy.viewport('iphone-x')
    }

    setTabletViewport(): void {
        cy.viewport('ipad-2');
    }

    setDesktopViewport(): void {
        cy.viewport('macbook-13');
    }

    setLargeDesktopViewport(): void {
        cy.viewport(1980, 1080);
    }
}