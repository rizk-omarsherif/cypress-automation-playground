/**
 * Cypress Test Suite: JavaScript Alerts & Prompts Handling
 * --------------------------------------------------------
 * This test suite verifies interactions with JavaScript alert, confirm, and prompt dialogs.
 *
 * Test Coverage:
 * - Handling basic alert popups
 * - Handling confirm popups (Accept & Cancel)
 * - Handling prompt popups (Input & Cancel)
 * - Validating UI updates based on user action
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />

describe("JavaScript Alerts Handling", () => {
  beforeEach(() => {
    // Visit the webpage before each test
    cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
  });

  it("[alerts_TC001] Verifies handling of simple JS alert", () => {
    // Click the JS Alert button
    cy.contains("Click for JS Alert").click();

    // Cypress automatically handles alerts, but we assert the alert text
    cy.on("window:alert", (text) => {
      expect(text).to.equal("I am a JS Alert");
    });

    // Verify the result text updated accordingly
    cy.get("#result").should("have.text", "You successfully clicked an alert");
  });

  it("[alerts_TC002] Verifies handling of JS confirm popup (Accept)", () => {
    // Click the JS Confirm button
    cy.contains("Click for JS Confirm").click();

    // Handle confirmation popup (Accept)
    cy.on("window:confirm", () => true);

    // Verify the result text updated accordingly
    cy.get("#result").should("include.text", "Ok");
  });

  it("[alerts_TC003] Verifies handling of JS confirm popup (Cancel)", () => {
    // Click the JS Confirm button
    cy.contains("Click for JS Confirm").click();

    // Handle confirmation popup (Cancel)
    cy.on("window:confirm", () => false);

    // Verify the result text updated accordingly
    cy.get("#result").should("include.text", "Cancel");
  });

  it("[alerts_TC004] Verifies handling of JS prompt popup (Entering Text)", () => {
    // Stub the prompt and return a custom value
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns("Omar Cypress!");
    });

    // Click the JS Prompt button
    cy.contains("Click for JS Prompt").click();

    // Verify the result text is updated correctly
    cy.get("#result").should("have.text", "You entered: Omar Cypress!");
  });

  it("[alerts_TC005] Verifies handling of JS prompt popup (Cancel)", () => {
    // Stub the prompt and return null (Cancel action)
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns(null);
    });

    // Click the JS Prompt button
    cy.contains("Click for JS Prompt").click();

    // Verify the result text is updated accordingly
    cy.get("#result").should("include.text", "null");
  });

  it("[alerts_TC006] Verifies Cypress automatically accepts alerts", () => {
    // Click the JS Alert button
    cy.contains("Click for JS Alert").click();

    // Cypress will auto-accept the alert, we just verify it exists
    cy.get("#result").should(
      "include.text",
      "You successfully clicked an alert"
    );
  });
});
