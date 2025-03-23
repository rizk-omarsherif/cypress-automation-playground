/**
 * Cypress Test Suite: Element Display & Visibility Tests
 *
 * This test suite verifies interactions with dynamically displayed elements.
 * It covers:
 * - Default visibility checks
 * - Hiding and showing elements using UI buttons
 * - Ensuring elements remain in the DOM even when hidden
 * - Validating accessibility attributes
 * - Testing keyboard interactions for accessibility
 * - Negative tests for handling multiple interactions
 *
 * Author: Omar Rizk
 *
 */

/// <reference types="cypress" />

describe("Element Display & Visibility Tests", () => {
  // Selectors for elements under test
  const hideButton = "#hide-textbox"; // Button that hides the textbox
  const showButton = "#show-textbox"; // Button that shows the textbox
  const textBox = "#displayed-text"; // Input field that is shown/hidden

  beforeEach(() => {
    // Step 1: Visit the target webpage before each test case
    cy.visit("/");

    // Step 2: Ensure all elements exist in the DOM before interacting
    cy.get(hideButton).as("hideBtn").should("exist");
    cy.get(showButton).as("showBtn").should("exist");
    cy.get(textBox).as("textBox").should("exist");
  });

  it("[elementDisplay_TC001] Verifies that the text box is visible by default", () => {
    // The text box should be displayed when the page loads
    cy.get("@textBox").should("be.visible");
  });

  it("[elementDisplay_TC002] Hides the text box when clicking the 'Hide' button", () => {
    // Click the "Hide" button to hide the text box
    cy.get("@hideBtn").click();

    // The text box should no longer be visible
    cy.get("@textBox").should("not.be.visible");
  });

  it("[elementDisplay_TC003] Shows the text box when clicking the 'Show' button after hiding", () => {
    // Step 1: Hide the text box
    cy.get("@hideBtn").click();
    cy.get("@textBox").should("not.be.visible");

    // Step 2: Click the "Show" button to reveal the text box again
    cy.get("@showBtn").click();
    cy.get("@textBox").should("be.visible");
  });

  it("[elementDisplay_TC004] Ensures the text box exists in the DOM even when hidden", () => {
    // Step 1: Click the "Hide" button
    cy.get("@hideBtn").click();

    // Step 2: Ensure the element still exists in the DOM but is not visible
    cy.get("@textBox").should("exist").and("have.css", "display", "none");
  });

  it("[elementDisplay_TC005] Ensures clicking 'Show' does not affect an already visible text box", () => {
    // The text box is visible by default
    cy.get("@textBox").should("be.visible");

    // Clicking "Show" should not cause any errors or unexpected changes
    cy.get("@showBtn").click();
    cy.get("@textBox").should("be.visible");
  });

  it("[elementDisplay_TC006] Ensures clicking 'Hide' multiple times does not cause errors", () => {
    // Clicking "Hide" twice should not break functionality
    cy.get("@hideBtn").click().click();

    // The text box should still be hidden
    cy.get("@textBox").should("not.be.visible");
  });

  it("[elementDisplay_TC007] Validates accessibility attributes of the buttons", () => {
    // Check if the "Hide" button has the correct attributes
    cy.get("@hideBtn")
      .should("have.attr", "type", "submit")
      .and("have.attr", "id", "hide-textbox");

    // Check if the "Show" button has the correct attributes
    cy.get("@showBtn")
      .should("have.attr", "type", "submit")
      .and("have.attr", "id", "show-textbox");
  });

  it("[elementDisplay_TC008] Validates keyboard accessibility by triggering button clicks via keyboard", () => {
    // Simulate pressing "Enter" while focused on "Hide" button
    cy.get("@hideBtn").focus().type("{enter}");
    cy.get("@textBox").should("not.be.visible");

    // Simulate pressing "Enter" while focused on "Show" button
    cy.get("@showBtn").focus().type("{enter}");
    cy.get("@textBox").should("be.visible");
  });

  it("[elementDisplay_TC009] Ensures text input remains editable after hiding and showing", () => {
    // Step 1: Type text into the input field
    cy.get("@textBox")
      .should("be.visible")
      .type("Testing Visibility")
      .should("have.value", "Testing Visibility");

    // Step 2: Hide and show the text box
    cy.get("@hideBtn").click();
    cy.get("@textBox").should("not.be.visible");

    cy.get("@showBtn").click();
    cy.get("@textBox").should("be.visible");

    // Step 3: Verify that the previously entered text is still present
    cy.get("@textBox").should("have.value", "Testing Visibility");
  });

  it("[elementDisplay_TC010] Ensures clicking 'Show' does nothing if the element is already visible", () => {
    // Click "Show" multiple times and verify the text box remains visible
    cy.get("@showBtn").click().click().click();
    cy.get("@textBox").should("be.visible");
  });
});
