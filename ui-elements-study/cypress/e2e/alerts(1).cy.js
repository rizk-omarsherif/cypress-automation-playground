/**
 * Cypress Test Suite: Alert & Confirm Popups
 * ------------------------------------------
 * This test suite verifies interactions with JavaScript alerts and confirmation dialogs.
 *
 * Test Coverage:
 * - Handling browser alerts (window:alert)
 * - Handling confirmation popups (window:confirm)
 * - Ensuring correct alert text appears
 * - Dismissing or accepting confirmation popups
 * - Validating user input before triggering alerts
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />

describe("Alert & Confirm Popups Tests", () => {
  const nameInput = "#name";
  const alertButton = "#alertbtn";
  const confirmButton = "#confirmbtn";

  beforeEach(() => {
    // Visit the target webpage before each test
    cy.visit("/");

    // Ensure input field and buttons exist
    cy.get(nameInput).as("nameField").should("exist").and("be.visible");
    cy.get(alertButton).as("alertBtn").should("exist");
    cy.get(confirmButton).as("confirmBtn").should("exist");
  });

  it("[alerts_TC001] Verifies alert popup displays correct message", () => {
    cy.get("@nameField").type("Omar");

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.include("Hello Omar, share this practice page");
    });

    cy.get("@alertBtn").click();
  });

  it("[alerts_TC002] Handles confirmation popup by accepting", () => {
    cy.on("window:confirm", (confirmText) => {
      expect(confirmText).to.include("you want to confirm?");
      return true; // Accept
    });

    cy.get("@confirmBtn").click();
  });

  it("[alerts_TC003] Handles confirmation popup by dismissing", () => {
    cy.on("window:confirm", (confirmText) => {
      expect(confirmText).to.include("you want to confirm?");
      return false; // Dismiss
    });

    cy.get("@confirmBtn").click();
  });

  it("[alerts_TC004] Ensures alert is triggered only after input", () => {
    cy.get("@alertBtn").click();

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.not.include("Omar");
    });
  });

  it("[alerts_TC005] Validates confirm dialog behavior dynamically", () => {
    [true, false].forEach((choice) => {
      cy.get("@confirmBtn").click();

      cy.on("window:confirm", (confirmText) => {
        expect(confirmText).to.include("you want to confirm?");
        return choice;
      });
    });
  });

  it("[alerts_TC006] Ensures alert box contains expected keywords", () => {
    cy.get("@nameField").type("John");

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.match(/Hello.*share this practice page/);
    });

    cy.get("@alertBtn").click();
  });
});
