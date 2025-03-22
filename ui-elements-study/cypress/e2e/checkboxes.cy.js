/**
 * Cypress Test Suite: Checkbox Interactions
 *
 * This test suite verifies different interactions with checkboxes in a web application.
 * It includes:
 * - Selecting and deselecting checkboxes
 * - Verifying multiple checkbox selection
 * - Ensuring checkboxes persist state after reload
 * - Handling dynamically loaded checkboxes
 * - Verifying indeterminate checkboxes (if applicable)
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />

describe("Checkbox Tests", () => {
  const checkboxSelector = 'input[type="checkbox"]';

  beforeEach(() => {
    // Visit the target webpage before each test case
    cy.visit("/");

    // Verify that checkboxes exist before interacting with them
    cy.get(checkboxSelector).as("checkboxes").should("have.length", 3);
  });

  it("Selects a checkbox and verifies it's checked", () => {
    cy.get("@checkboxes").eq(0).check().should("be.checked");
  });

  it("Allows selecting multiple checkboxes", () => {
    // Select all checkboxes at once
    cy.get("@checkboxes").check();

    // Verify all checkboxes are checked
    cy.get("@checkboxes").each(($checkbox) => {
      cy.wrap($checkbox).should("be.checked");
    });
  });

  it("Deselects a checkbox and verifies it's unchecked", () => {
    // Check a checkbox first
    cy.get("@checkboxes").eq(1).check().should("be.checked");

    // Uncheck it
    cy.get("@checkboxes").eq(1).uncheck().should("not.be.checked");
  });

  it("Toggles a checkbox on and off", () => {
    // Toggle checkbox multiple times
    cy.get("@checkboxes").eq(2).check().should("be.checked");
    cy.get("@checkboxes").eq(2).uncheck().should("not.be.checked");
    cy.get("@checkboxes").eq(2).check().should("be.checked");
  });

  it("Ensures checkbox selection persists after reload", () => {
    cy.get("@checkboxes").eq(0).check().should("be.checked");

    // Reload the page
    cy.reload();

    // Verify the checkbox remains checked
    cy.get("@checkboxes").eq(0).should("be.checked");
  });

  it("Waits for dynamically loaded checkboxes and interacts", () => {
    // Ensure dynamically loaded checkboxes exist before proceeding
    cy.get("@checkboxes").should("have.length.at.least", 3);

    // Select the last dynamically loaded checkbox and verify selection
    cy.get("@checkboxes").last().check().should("be.checked");
  });

  it.skip("Verifies an indeterminate checkbox state (if applicable)", () => {
    // Some checkboxes can have an "indeterminate" state in UI
    // This test only applies if your UI has indeterminate checkboxes
    cy.get("@checkboxes").eq(0).invoke("prop", "indeterminate", true);
    cy.get("@checkboxes").eq(0).should("have.prop", "indeterminate", true);
  });

  it("Checks that checkbox values are correct", () => {
    // Ensure the checkboxes have the expected values
    cy.get("@checkboxes").eq(0).should("have.value", "option1");
    cy.get("@checkboxes").eq(1).should("have.value", "option2");
    cy.get("@checkboxes").eq(2).should("have.value", "option3");
  });

  it("Checks all checkboxes at once", () => {
    // Check all checkboxes and ensure they're selected
    cy.get("@checkboxes").check().should("be.checked");
  });
});
