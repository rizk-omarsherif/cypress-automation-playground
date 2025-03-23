/**
 * Cypress Test Suite: Static Dropdown Interactions
 *
 * This test suite verifies various interactions with a static dropdown in a web application.
 * It covers:
 * - Basic dropdown selection methods (by value, index, and visible text)
 * - Validation of default selection
 * - Ensuring only one option is selected at a time
 * - Persistence of selection after a page reload
 * - Ensuring correct available options
 * - Negative tests for invalid selections
 * - Accessibility validation
 * - Keyboard navigation within the dropdown
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />

describe("Static Dropdown Tests", () => {
  const dropdownSelector = "#dropdown-class-example";

  beforeEach(() => {
    // Visit the target webpage before each test case
    cy.visit("/");

    // Ensure the dropdown exists before interacting with it
    cy.get(dropdownSelector).as("dropdown").should("exist");
  });

  it("[staticDropdown_TC001] Verifies the default selected option", () => {
    // Expected default selection should be "Select" with an empty value
    cy.get("@dropdown").should("have.value", "");
  });

  it("[staticDropdown_TC002] Selects an option by value", () => {
    // Using `.select(value)` to choose the option with value "option1"
    cy.get("@dropdown").select("option1").should("have.value", "option1");
  });

  it("[staticDropdown_TC003] Selects an option by visible text", () => {
    // Selecting an option based on the visible text "Option2"
    cy.get("@dropdown").select("Option2").should("have.value", "option2");
  });

  it("[staticDropdown_TC004] Selects an option by index", () => {
    // 0 = "Select", 1 = "Option1", 2 = "Option2", 3 = "Option3"
    cy.get("@dropdown").select(3).should("have.value", "option3");
  });

  it("[staticDropdown_TC005] Ensures only one option is selected at a time", () => {
    // Select "Option1" first and verify
    cy.get("@dropdown").select("option1").should("have.value", "option1");

    // Now select "Option3" and ensure "Option1" is no longer selected
    cy.get("@dropdown").select("option3").should("have.value", "option3");
  });

  it("[staticDropdown_TC006] Verifies dropdown selection persists after reload", () => {
    cy.get("@dropdown").select("option2").should("have.value", "option2");

    cy.reload();

    // Ensure the page is fully loaded before checking again
    cy.get("@dropdown").should("exist").and("have.value", "option2");
  });

  it("[staticDropdown_TC007] Ensures dropdown contains the correct options", () => {
    // Check that the dropdown contains exactly 4 options (including the default)

    const expectedOptions = ["Select", "Option1", "Option2", "Option3"];

    cy.get("@dropdown")
      .find("option")
      .should("have.length", expectedOptions.length)
      .each(($option, index) => {
        // Iterate over each option and compare with expected values
        cy.wrap($option).should("have.text", expectedOptions[index]);
      });
  });

  it.skip("[staticDropdown_TC008] Ensures non-existent options cannot be selected (negative test)", () => {
    cy.get("@dropdown").find("option").should("not.contain", "InvalidOption");

    cy.get("@dropdown").then(($dropdown) => {
      const availableOptions = [...$dropdown.find("option")].map(
        (option) => option.value
      );
      expect(availableOptions).to.not.include("InvalidOption");
    });

    // Attempting to select an invalid option should not change the dropdown's value
    cy.get("@dropdown").select("InvalidOption").should("not.exist");
  });

  it("[staticDropdown_TC009] Validates accessibility attributes of the dropdown", () => {
    // Check if the dropdown has proper accessibility attributes
    cy.get("@dropdown").should("have.attr", "id", "dropdown-class-example");
    cy.get("@dropdown").should("have.attr", "name", "dropdown-class-example");
  });

  it("[staticDropdown_TC010] Verifies keyboard navigation within the dropdown", () => {
    cy.get("@dropdown").focus().type("{downarrow}");
    cy.get("@dropdown").should("have.value", "option1");

    cy.get("@dropdown").type("{downarrow}");
    cy.get("@dropdown").should("have.value", "option2");

    cy.get("@dropdown").type("{downarrow}");
    cy.get("@dropdown").should("have.value", "option3");
  });
});
