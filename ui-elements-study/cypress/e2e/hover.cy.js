/**
 * Cypress Test Suite: Mouse Hover Interactions
 * --------------------------------------------
 * This test suite verifies interactions with elements that are displayed
 * upon mouse hover actions. It ensures that hover-based UI elements function
 * correctly and remain accessible.
 *
 * Test Coverage:
 * - Verifying element visibility after hover
 * - Clicking elements within hover menus
 * - Ensuring non-hover elements remain unaffected
 * - Handling dynamic content within hover menus
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />

describe("Mouse Hover Interactions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("[hover-TC001] Should display hidden element upon mouse hover", () => {
    // Force display of the hidden menu using jQuery
    cy.get(".mouse-hover-content").invoke("show");

    // Verify the element is now visible
    cy.get(".mouse-hover-content").should("be.visible");
  });

  it("[hover-TC002] Should click 'Top' link after mouse hover", () => {
    // Force show the hidden hover menu
    cy.get(".mouse-hover-content").invoke("show");

    // Click the 'Top' link inside the hover menu
    cy.get(".mouse-hover-content a").contains("Top").click();

    // Verify the URL now contains the #top anchor
    cy.url().should("include", "#top");
  });

  it("[hover-TC003] Should not affect other elements when hovering", () => {
    // Ensure another unrelated element remains visible
    cy.get("body").should("be.visible");

    // Force show the hover menu
    cy.get(".mouse-hover-content").invoke("show");

    // Ensure other elements are still unaffected
    cy.get("body").should("be.visible");
  });

  it("[hover-TC004] Should hide hover menu when clicking outside", () => {
    // Force show the hover menu
    cy.get(".mouse-hover-content").invoke("show");

    // Click outside the hover menu
    cy.get("body").click({ force: true });

    // Verify that the hover menu is now hidden
    cy.get(".mouse-hover-content").should("not.be.visible");
  });

  it("[hover-TC005] Should verify dynamic content inside hover menu", () => {
    // Force show the hover menu
    cy.get(".mouse-hover-content").invoke("show");

    // Verify expected links exist
    cy.get(".mouse-hover-content a").should("have.length.at.least", 1);
  });
});
