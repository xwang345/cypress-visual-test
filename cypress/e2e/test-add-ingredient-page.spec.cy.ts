describe('shopping list page verification', () => {
    it('should able to add recipes to the shopping list', () => {
        cy.visit('localhost:4200/shopping-list')
        cy.wait(300)
        cy.get('#name').type('test');
        cy.get('#amount').type('1');
        cy.get('button:contains("Add")').click();

        cy.get('.list-group-item').last().should('contain', 'test (1)');
    });

    it('should able to delete recipes from the shopping list', () => {
        cy.visit('localhost:4200/shopping-list')
        cy.wait(300)
        cy.get('.list-group-item').last().click();
       
        cy.get('button:contains("Delete")').click();

        cy.get('.list-group-item').last().should('not.contain', ' Tomatoes (10)');
    });

    it('should able to edit recipes from the shopping list', () => {
        cy.visit('localhost:4200/shopping-list')
        cy.wait(300)
        cy.get('.list-group-item').last().click();
       
        cy.get('#amount').clear();
        cy.get('#amount').type('100');
        cy.get('button:contains("Update")').click();

        cy.get('.list-group-item').last().should('contain', 'Tomatoes (100)');
    });

    it('should able to add new recipe', () => {
        cy.visit('localhost:4200/recipes')
        cy.wait(300)
        cy.get('button:contains("New Recipe")').click();
        cy.get('#name').type('test');
        cy.get('#imagePath').type('https://cdn.shopify.com/s/files/1/0271/5870/8303/files/jaycee-xie-aH9Uskj8XTU-unsplash.jpg?v=1680123078');
        cy.get('#description').type("Lorem Ipsum is simply dummy text of the printing and typesetting industry.");
        cy.get('button:contains("Add Ingredient")').click();
        

        cy.get('[formarrayname="ingredients"]').find('[formcontrolname="name"]').type('test');
        cy.get('[formarrayname="ingredients"]').find('[formcontrolname="amount"]').type('123');

        cy.get('button:contains("Save")').click();

        cy.get('.list-group-item').last().should('contain', 'test');
        cy.get('.list-group-item').last().click();
    });
});