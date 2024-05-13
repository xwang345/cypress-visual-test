describe("shopping list page verification", () => {
	before(() => {
		cy.viewport("macbook-16");
	});

	it("should be able to add youtube channel video", () => {
		cy.viewport("macbook-16");
		cy.visit("localhost:4200/recipe-video");
		cy.wait(3000);
		cy.get(".search-bar")
			.find(".mat-mdc-input-element")
			.click({ force: true })
			.type("UCbEuBDD3xQAxK0zpIP_se-g");
		cy.get('[aria-label="Example icon button with a plus one icon"]')
			.find(".mat-mdc-button-touch-target")
			.click({ force: true });
	});

	it("should able to add recipes to the shopping list", () => {
		cy.visit("localhost:4200/shopping-list");
		cy.wait(300);
		cy.get("#name").type("test");
		cy.get("#amount").type("1");
		cy.get('button:contains("Add")').click();

		cy.get(".list-group-item").last().should("contain", "test (1)");
	});

	it("should able to delete recipes from the shopping list", () => {
		cy.visit("localhost:4200/shopping-list");
		cy.wait(300);
		cy.get(".list-group-item").last().click();

		cy.get('button:contains("Delete")').click();

		cy.get(".list-group-item").last().should("not.contain", " Tomatoes (10)");
	});

	it("should able to edit recipes from the shopping list", () => {
		cy.visit("localhost:4200/shopping-list");
		cy.wait(300);
		cy.get(".list-group-item").last().click();

		cy.get("#amount").clear();
		cy.get("#amount").type("100");
		cy.get('button:contains("Update")').click();

		cy.get(".list-group-item").last().should("contain", "Tomatoes (100)");
	});

	it.skip("should able to add new recipe", () => {
		cy.visit("localhost:4200/recipes");
		cy.wait(300);
		cy.get('button:contains("New Recipe")').click();
		cy.get("#name").type("test");
		cy.get("#imagePath").type(
			'src="https://www.recipetineats.com/wp-content/uploads/2019/04/Beef-Pho_4.jpg"',
		);

		cy.get('[formcontrolname="dietaryPreferences"]').click();
		cy.get("mat-option").contains("Vegetarian").click().wait(1000);
		cy.get('[formcontrolname="dietaryPreferences"]').click();

		cy.get('[formcontrolname="description"]').type(
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
		);
		cy.get('button:contains("Add Ingredient")').click();

		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="name"]')
			.type("test");
		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="amount"]')
			.type("123");

		cy.get('button:contains("Save")').click();

		cy.get(".list-group-item").last().should("contain", "test");
		cy.get(".list-group-item").last().click();
	});

	it("should able to login to the recipe book", () => {
		cy.viewport("macbook-16");
		cy.visit("localhost:4200/auth");
		cy.wait(300);
		cy.get("#email").type("test@test.com");
		cy.get("#password").type("test123");
		cy.get('button:contains("Login")').click();

		cy.get('button:contains("New Recipe")').click();
		cy.get("#name").type("Pho");
		cy.get("#imagePath").type(
			"https://www.recipetineats.com/wp-content/uploads/2019/04/Beef-Pho_4.jpg",
		);
		cy.get('[formcontrolname="description"]').type(
			"Experience the magic of one of the greatest noodle soups in the world with this easy to follow traditional Vietnamese Pho recipe!",
		);

		cy.get('button:contains("Add Ingredient")').scrollIntoView().click();

		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="name"]')
			.type("large onions");
		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="amount"]')
			.type("2");

		cy.get('button:contains("Add Ingredient")').click();

		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="name"]')
			.last()
			.type("star anise");
		cy.get('[formarrayname="ingredients"]')
			.last()
			.find('[formcontrolname="amount"]')
			.last()
			.type("8");

		cy.get('button:contains("Add Ingredient")').click();

		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="name"]')
			.last()
			.type("beef brisket");
		cy.get('[formarrayname="ingredients"]')
			.find('[formcontrolname="amount"]')
			.last()
			.type("3");

		cy.get('[formcontrolname="dietaryPreferences"]')
			.scrollIntoView()
			.click({ force: true });
		cy.get("mat-option")
			.contains("Vegetarian")
			.click({ force: true })
			.wait(1000);
		cy.get('[formcontrolname="dietaryPreferences"]')
			.scrollIntoView()
			.click({ force: true });

		cy.get(".btn-success").click({ force: true });
	});
});
