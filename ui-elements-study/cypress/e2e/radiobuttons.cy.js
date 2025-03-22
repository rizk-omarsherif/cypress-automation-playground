/**
 * Cypress Test Suite: Radio Button Interactions
 *
 * This test suite verifies various interactions with radio buttons in a web application.
 * It includes:
 * - Selecting radio buttons by value and index
 * - Ensuring mutual exclusivity (only one selection at a time)
 * - Handling disabled radio buttons
 * - Verifying state persistence after a page reload
 * - Testing dynamically loaded radio buttons
 * - Handling radio buttons within asynchronous operations
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />

describe("Radio Button Tests", () => {
  const radioSelector = 'input[name="radioButton"]';

  beforeEach(() => {
    // Visit the target webpage before each test case
    cy.visit("/");

    // Verify that the expected number of radio buttons exist before proceeding
    cy.get(radioSelector).as("radioButtons").should("have.length", 3);
  });

  it("[Radio_TC001] Selects a radio button by value", () => {
    // Select a radio button based on its value attribute
    cy.get("@radioButtons")
      .filter('[value="radio1"]') // The 'filter' method is used to find the specific radio button with value 'radio1'
      .check()
      .should("be.checked");
  });

  it("[Radio_TC002] Selects a radio button using index", () => {
    // Use the 'eq' method to select the third radio button (index 2)
    cy.get("@radioButtons").eq(2).check().should("be.checked");
  });

  it("[Radio_TC003] Ensures only one radio button is selected at a time and previous selection is cleared", () => {
    // Select first radio button and verify it's checked
    cy.get("@radioButtons")
      .filter('[value="radio1"]')
      .check()
      .should("be.checked");

    // Select another radio button and verify it's checked
    cy.get("@radioButtons")
      .filter('[value="radio3"]')
      .check()
      .should("be.checked");

    // Ensure the first one is now unchecked
    cy.get("@radioButtons").filter('[value="radio1"]').should("not.be.checked");
  });

  it("[Radio_TC004] Persists radio button selection after page reload", () => {
    // Select a specific radio button (value='radio2') and confirm selection
    cy.get("@radioButtons")
      .filter('[value="radio2"]')
      .check()
      .should("be.checked");

    // Reload the page
    cy.reload();

    // Verify that the selection is retained after the reload
    cy.get("@radioButtons").filter('[value="radio2"]').should("be.checked");
  });

  it("[Radio_TC005] Waits for dynamically loaded radio buttons and interacts", () => {
    // Ensure dynamically loaded radio buttons exist before proceeding
    cy.get("@radioButtons").should("have.length.at.least", 3);

    // Select the last dynamically loaded radio button and verify selection
    cy.get("@radioButtons").last().check().should("be.checked");
  });

  it("[Radio_TC006] Handles radio button interactions with async behavior", () => {
    // Use 'then' to work with the resolved list of radio buttons
    cy.get("@radioButtons").then(($buttons) => {
      // Verify the expected number of radio buttons are present
      expect($buttons).to.have.length(3);

      // Use cy.wrap() because Cypress commands do not work directly on jQuery elements
      // Cypress yields raw jQuery elements inside .then(), so we need to wrap them

      // Select the first radio button and confirm selection
      cy.wrap($buttons.eq(0)).check().should("be.checked");

      // Select the second radio button and confirm selection
      cy.wrap($buttons.eq(1)).check().should("be.checked");

      // Ensure the first button is now unchecked
      cy.wrap($buttons.eq(0)).should("not.be.checked");
    });
  });
});
