describe("Verify drag and drop", () => {
	it("should drag and drop a draggable item - example 1", () => {
		cy.visit("https://jqueryui.com/resources/demos/droppable/default.html");
		cy.get("#draggable").trigger("mousedown", { which: 1 });
		cy.get("#droppable")
			.trigger("mousemove")
			.trigger("mouseup", { force: true });
	});

	it("should able to drag and drop element on Material Angular example page", () => {
		cy.viewport(1920, 1080);
		cy.visit(
			"https://material.angular.io/cdk/drag-drop/overview#cdk-drag-drop-connected-sorting",
		);

		cy.step("Drag and Drop on Angular Material example page");
		cy.get("#cdk-drop-list-1 .cdk-drag").each(($el) => {
			cy.wrap($el)
				.realMouseDown({ button: "left", position: "center" })
				.realMouseMove(0, 10, { position: "center" });

			cy.wait(500); // In our case, we wait 500ms cause we have animations which we are sure that take this amount of time
			cy.get("#cdk-drop-list-2")
				.realMouseMove(0, 0, { position: "center" })
				.realMouseUp();
			cy.wait(500); // In our case, we wait 500ms cause we have animations which we are sure that take this amount of time

			cy.get("#cdk-drop-list-2").should("contain", $el.text());
		});
	});
});
