/**
 * Cypress Test Suite: Handling New Tabs
 * -------------------------------------
 * This test suite verifies Cypress interactions with new tabs
 * that open via `<a href target="_blank">`.
 *
 * Cypress does not support switching tabs, so we:
 * - Remove the `target` attribute to force opening in the same tab
 * - Use `cy.origin()` to handle cross-origin navigation
 *
 * Test Coverage:
 * - Ensuring 'Open Tab' link exists and has the correct href
 * - Handling tab navigation with `cy.origin()`
 * - Extracting and manually visiting new tab URLs *
 * -------------------------------------
 * Author: Omar Rizk
 */

/// <reference types="cypress" />
// This directive tells the editor to use Cypress type definitions for autocompletion

describe("New Tab Handling Tests", () => {
  // The describe block groups related tests together

  beforeEach(() => {
    // beforeEach hook runs before each test case
    // Visit the test page before each test to ensure a clean state
    cy.visit("/");
  });

  it("[tab_TC001] Verifies 'Open Tab' button is present and clickable", () => {
    // Test case 1: Checks if the button exists and can be clicked
    // The #opentab selector targets an element with id="opentab"
    cy.get("#opentab")
      .should("be.visible") // Ensures the element is visible on the page
      .and("contain", "Open Tab") // Verifies the element contains the text "Open Tab"
      .click(); // Performs a click action on the element
    // Note: This test doesn't handle the new tab that would open in a real browser
  });

  it("[tab_TC002] Verifies 'Open Tab' link is present and correct", () => {
    // Test case 2: Validates the link's href attribute
    cy.get("#opentab")
      .should("be.visible") // Confirms the element is visible
      .and("have.attr", "href") // Checks that the element has an href attribute
      .and("include", "qaclickacademy.com"); // Verifies the href contains the expected domain
    // This test ensures the link points to the correct website without clicking it
  });

  it("[tab_TC003] Opens the new tab in the same Cypress window", () => {
    // Test case 3: Demonstrates how to handle links that open in new tabs
    // Remove the target="_blank" attribute to force the link to open in the same window
    cy.get("#opentab").invoke("removeAttr", "target").click();

    // cy.origin() allows testing on a different domain than the one we started on
    // This is necessary because Cypress has same-origin restrictions by default
    cy.origin("https://www.qaclickacademy.com", () => {
      // These commands run in the context of the new domain
      cy.url().should("include", "qaclickacademy.com"); // Verifies we navigated to the correct domain
      cy.title().should("contain", "QAClick Academy"); // Checks the page title contains expected text
    });
  });

  it("[tab_TC004] Extracts new tab URL and visits it manually", () => {
    // Test case 4: Alternative approach - extract the URL and navigate to it directly
    cy.get("#opentab").then(($link) => {
      // Use jQuery's prop() method to get the href property value
      const newTabUrl = $link.prop("href");
      // Directly visit the URL instead of clicking the link
      cy.visit(newTabUrl);
    });

    // After visiting the new URL, verify we're on the expected page
    cy.origin("https://www.qaclickacademy.com", () => {
      cy.url().should("include", "qaclickacademy.com"); // Confirm the URL
      // Look for specific content on the page to verify we're in the right place
      cy.contains("Welcome to QAClick Academy").should("be.visible");
    });
  });
});
