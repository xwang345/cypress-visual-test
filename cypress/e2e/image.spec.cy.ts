const pages = ["https://example.com"];

const sizes: any = ["iphone-6", "ipad-2", [1200, 800]];

describe("Visual Regression", () => {
	sizes.forEach((size) => {
		pages.forEach((page) => {
			it(`Should match ${page} in resolution ${size}`, () => {
				let currentTime = new Date(Date.UTC(2022, 1, 1)).getDate();
				cy.clock(currentTime);
				cy.setResolution(size);
				cy.visit(page);
			});
		});
	});
});

describe("Single Element Snapshot", () => {
	it("Should match a single element on the page", () => {
		cy.visit("https://example.com");
	});
});

describe("Cypress Tests with Docker", () => {
	it("should load website", () => {
		cy.visit("https://example.com");
	});

	it("should load h1 element", () => {
		cy.get("h1").should("be.visible");
	});
});
