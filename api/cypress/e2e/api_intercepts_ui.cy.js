/// <reference types="cypress" />

/**
 * @file API Testing using Cypress Intercepts
 * @description This test file demonstrates how to intercept and mock API responses using Cypress.
 * It verifies UI behavior based on different API responses.
 * @author Omar Rizk
 */

describe("API Testing - Mocking GET Requests", () => {
  beforeEach(() => {
    // Visiting the base URL before each test in this block
    cy.visit("/");
  });

  it("Should display correct message when only 1 book is available", () => {
    // Mocking API response with a single book
    cy.intercept(
      {
        method: "GET",
        url: "https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty",
      },
      {
        body: [{ book_name: "Book 1", isbn: "B1", aisle: "1001" }],
        statusCode: 200, // Simulating a successful response
      }
    ).as("getBook");

    // Clicking the button that triggers the API call
    cy.get(".btn-primary").click();

    // Waiting for the mocked API response
    cy.wait("@getBook");

    // Validating the displayed message
    cy.get("p").should("have.text", "Oops only 1 Book available");
  });

  it("Should validate that response length matches the number of table rows", () => {
    // Mocking API response with 5 books
    const mockBooks = [
      { book_name: "Book 1", isbn: "B1", aisle: "1001" },
      { book_name: "Book 2", isbn: "B2", aisle: "1002" },
      { book_name: "Book 3", isbn: "B3", aisle: "1003" },
      { book_name: "Book 4", isbn: "B4", aisle: "1004" },
      { book_name: "Book 5", isbn: "B5", aisle: "1005" },
    ];

    cy.intercept(
      {
        method: "GET",
        url: "https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty",
      },
      {
        body: mockBooks, // Sending 5 books in response
        statusCode: 200, // Simulating a successful response
      }
    ).as("getBook");

    // Clicking the button that triggers the API call
    cy.get(".btn-primary").click();

    // Waiting for the mocked API response
    cy.wait("@getBook");

    // Validating that the number of table rows matches the response array length (5)
    cy.get("table tbody tr").should("have.length", mockBooks.length);
  });

  it("Should validate that API returns a 403 error when using an unauthorized author", () => {
    cy.intercept(
      "GET",
      "https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty",
      (req) => {
        // Modifying the request to an unauthorized author
        req.url =
          "https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=malhotra";

        req.continue((resp) => {
          expect(resp.statusCode).to.equal(403); // Asserting the response status code
        });
      }
    ).as("unauthorizedRequest");

    // Clicking the button that triggers the API call
    cy.get(".btn-primary").click();

    // Waiting for the mocked API response
    cy.wait("@unauthorizedRequest");
  });
});
