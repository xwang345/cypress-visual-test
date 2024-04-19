xdescribe("shopping list page verification", () => {
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

	it("should able to add new recipe", () => {
		cy.visit("localhost:4200/recipes");
		cy.wait(300);
		cy.get('button:contains("New Recipe")').click();
		cy.get("#name").type("test");
		cy.get("#imagePath").type(
			'src="https://www.recipetineats.com/wp-content/uploads/2019/04/Beef-Pho_4.jpg"',
		);
		cy.get("#description").type(
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

	it.only("should able to login to the recipe book", () => {
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
		cy.get("#description").type(
			"Experience the magic of one of the greatest noodle soups in the world with this easy to follow traditional Vietnamese Pho recipe!",
		);
		cy.get('button:contains("Add Ingredient")').click();

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

		cy.get('button:contains("Save")').click();

		cy.get(".list-group-item").last().should("contain", "Pho");
		cy.get(".list-group-item").last().click();

		cy.get(".dropdown").click();
		cy.get('a:contains("Save Data")').click();
	});
});
