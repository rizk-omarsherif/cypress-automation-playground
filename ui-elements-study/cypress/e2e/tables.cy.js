/**
 * Cypress Test Suite: Handling Web Tables
 * ---------------------------------------
 * This test suite verifies Cypress interactions with web tables.
 *
 * Test Coverage:
 * - Verifying table headers
 * - Verifying table row count
 * - Verifying table column count
 * - Verifying specific cell values
 * - Verifying all cell values in a column
 * - Verifying all cell values in a row
 * - Dynamically retrieving the price of a course containing "Jenkins" in its title
 *
 * Author: Omar Rizk
 */

/// <reference types="cypress" />
// This directive tells the editor to use Cypress type definitions for autocompletion

describe("Web Tables Test Suite", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the base URL before each test
    cy.get('#product[name="courses"]').as("coursesTable"); // Alias the table for easier reference
  });

  it("[table-TC001] Verify table headers", () => {
    cy.get("@coursesTable").find("th").should("have.length", 3); // Verify the number of headers
    cy.get("@coursesTable").find("th").eq(0).should("have.text", "Instructor"); // Verify the text of the first header
    cy.get("@coursesTable").find("th").eq(1).should("have.text", "Course"); // Verify the text of the second header
    cy.get("@coursesTable").find("th").eq(2).should("have.text", "Price"); // Verify the text of the third header
  });

  it("[table-TC002] Verify table row count", () => {
    cy.get("@coursesTable").find("tr").should("have.length", 11); // Verify the number of rows (1 header row + 10 data rows)
  });

  it("[table-TC003] Verify table column count", () => {
    cy.get("@coursesTable")
      .find("tr")
      .each(($row) => {
        cy.wrap($row).find("td, th").should("have.length", 3); // Verify the number of columns in each row
      });
  });

  it("[table-TC004] Verify specific cell value", () => {
    cy.get("@coursesTable")
      .find("tr")
      .eq(1)
      .find("td")
      .eq(1)
      .should(
        "have.text",
        "Selenium Webdriver with Java Basics + Advanced + Interview Guide"
      ); // Verify the text of a specific cell
  });

  it("[table-TC005] Verify all cell values in a column", () => {
    const expectedPrices = [
      "30",
      "25",
      "30",
      "20",
      "25",
      "35",
      "25",
      "25",
      "20",
      "0",
    ]; // Expected values for the Price column
    cy.get("@coursesTable")
      .find("tr")
      .not(":first")
      .each(($row, index) => {
        cy.wrap($row)
          .find("td")
          .eq(2)
          .should("have.text", expectedPrices[index]); // Verify the text of each cell in the Price column
      });
  });

  it("[table-TC006] Verify all cell values in a row", () => {
    const expectedRow = [
      "Rahul Shetty",
      "Learn SQL in Practical + Database Testing from Scratch",
      "25",
    ]; // Expected values for a specific row
    cy.get("@coursesTable")
      .find("tr")
      .eq(2)
      .find("td")
      .each(($cell, index) => {
        cy.wrap($cell).should("have.text", expectedRow[index]); // Verify the text of each cell in the specified row
      });
  });

  it("[table-TC007] Verify price of course containing 'Jenkins' in title", () => {
    cy.get("@coursesTable")
      .find("tr")
      .not(":first") // Exclude the header row
      .each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(1) // Select the Course column
          .invoke("text")
          .then((courseTitle) => {
            if (courseTitle.includes("Jenkins")) {
              cy.wrap($row)
                .find("td")
                .eq(2) // Select the Price column
                .invoke("text")
                .then((price) => {
                  cy.log(`The price of '${courseTitle}' is $${price}`);
                  expect(price).to.equal("20"); // Ensure price is correct
                });
            }
          });
      });
  });

  it.only("[table-TC008] Verify price of course containing 'Jenkins' in title (using specific column selector)", () => {
    cy.get("@coursesTable")
      .find("tr td:nth-child(2)") // Grab all Course column cells directly
      .each(($cell, index) => {
        cy.wrap($cell)
          .invoke("text")
          .then((courseTitle) => {
            if (courseTitle.includes("Jenkins")) {
              cy.get("@coursesTable")
                .find(`tr td:nth-child(3)`) // Grab all Price column cells
                .eq(index) // Get the corresponding row's price
                .invoke("text")
                .then((price) => {
                  cy.log(`The price of '${courseTitle}' is $${price}`);
                  expect(price).to.equal("20");
                });
            }
          });
      });
  });
});
