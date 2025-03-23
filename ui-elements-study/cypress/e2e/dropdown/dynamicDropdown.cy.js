/**
 * Cypress Test Suite: Dynamic Countries Dropdown (Autocomplete)
 * --------------------------------------------------------------
 * This test suite verifies various interactions with a dynamic autocomplete dropdown,
 * where users type to filter and select a country.
 *
 * Test Coverage:
 * - Basic input functionality (Typing & Fetching Suggestions)
 * - Selecting a country from suggestions
 * - Validating available suggestions based on input
 * - Case-insensitive matching
 * - Handling invalid inputs (Negative Tests)
 * - Keyboard navigation support
 * - Verifying selection persistence after reload
 * - Ensuring accessibility compliance
 * - Clearing selection
 *
 * Author: Omar Rizk
 *
 */

/// <reference types="cypress" />

describe("Dynamic Countries Dropdown Tests", () => {
  const inputSelector = "#autocomplete";

  beforeEach(() => {
    // Visit the target webpage before each test
    cy.visit("/");

    // Ensure the input field exists and is visible before interacting
    cy.get(inputSelector)
      .as("autocompleteInput")
      .should("exist")
      .and("be.visible");
  });

  it("[dynamicDropdown_TC001] Verifies input field visibility and basic interaction", () => {
    // Ensure the input field is visible and accepts text input
    cy.get("@autocompleteInput")
      .should("be.visible")
      .and("have.attr", "placeholder", "Type to Select Countries")
      .type("Canada")
      .should("have.value", "Canada");
  });

  it("[dynamicDropdown_TC002] Displays country suggestions when typing", () => {
    // Type partial country name and check if suggestions appear
    cy.get("@autocompleteInput").type("Ind");

    // Verify suggestions contain "Ind"
    cy.get(".ui-menu-item").should("exist").and("contain.text", "Ind");
  });

  it("[dynamicDropdown_TC003] Selects a country from suggestions", () => {
    // Type "Egypt" and select from suggestions
    cy.get("@autocompleteInput").type("Egy");

    // Click on the correct suggestion
    cy.get(".ui-menu-item").contains("Egypt").click();

    // Verify the selected value is correctly set in the input field
    cy.get("@autocompleteInput").should("have.value", "Egypt");
  });

  it("[dynamicDropdown_TC004] Ensures case-insensitive selection works", () => {
    // Type "Egypt" in lowercase and select the country
    cy.get("@autocompleteInput").type("united arab emirates");

    cy.get(".ui-menu-item").contains("United Arab Emirates").click();

    // Verify correct selection regardless of case
    cy.get("@autocompleteInput").should("have.value", "United Arab Emirates");
  });

  it("[dynamicDropdown_TC005] Ensures only relevant suggestions appear", () => {
    // Type "Uni" to trigger suggestions
    cy.get("@autocompleteInput").type("Uni");

    // Verify all displayed suggestions contain "Uni"
    cy.get(".ui-menu-item").each(($el) => {
      expect($el.text().toLowerCase()).to.include("uni");
    });
  });

  it("[dynamicDropdown_TC006] Handles invalid input (Negative Test)", () => {
    // Type an invalid country name
    cy.get("@autocompleteInput").type("XYZ");

    // Ensure no suggestions appear
    cy.get(".ui-menu-item").should("not.exist");

    // Ensure the input field does not auto-fill with an invalid selection
    cy.get("@autocompleteInput").should("have.value", "XYZ");
  });

  it.only("[dynamicDropdown_TC007] Supports keyboard navigation for selection", () => {
    // Type a partial country name
    cy.get("@autocompleteInput").type("Ind");

    // Use keyboard arrows to navigate through the list and select an option
    cy.get("@autocompleteInput").type(
      "{downarrow}{downarrow}{downarrow}{enter}"
    );

    // Ensure a valid country was selected
    //cy.get("@autocompleteInput").invoke("val").should("not.be.empty");
    cy.get("@autocompleteInput").invoke("val").should("eq", "India");
  });

  it("[dynamicDropdown_TC008] Ensures selection persists after reload", () => {
    not.be.empty;
    cy.get(".ui-menu-item").contains("Egypt").click();

    // Verify correct selection
    cy.get("@autocompleteInput").should("have.value", "Egypt");

    // Reload the page
    cy.reload();

    // Ensure input retains the last selected country after reload
    cy.get("@autocompleteInput").should("have.value", "Egypt");
  });

  it("[dynamicDropdown_TC009] Validates accessibility attributes", () => {
    // Verify essential accessibility attributes
    cy.get("@autocompleteInput").should("have.attr", "autocomplete", "off");
    cy.get("@autocompleteInput").should("have.attr", "type", "text");
  });

  it("[dynamicDropdown_TC010] Ensures user can clear selection", () => {
    // Type and select "Egypt"
    cy.get("@autocompleteInput").type("Egypt");

    cy.get(".ui-menu-item").contains("Egypt").click();

    // Ensure correct selection
    cy.get("@autocompleteInput").should("have.value", "Egypt");

    // Clear the input field
    cy.get("@autocompleteInput").clear().should("have.value", "");
  });
});
