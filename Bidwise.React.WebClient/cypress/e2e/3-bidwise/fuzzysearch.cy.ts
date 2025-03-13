describe("Fuzzy Search Test", () => {
  it("searching with similar sounding words should return items", () => {
    cy.visit("https://localhost:5173");
    cy.get("#search-bar").type("marseedee").type("{enter}");
    cy.wait(2000);
    cy.contains("Mercedes");
  });
});
