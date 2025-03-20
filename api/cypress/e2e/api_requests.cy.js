/// <reference types="cypress" />

/**
 * @file API Testing with Cypress (No UI)
 * @description This script tests the Simple Books API using Cypress `cy.request()`.
 * It covers:
 * - Public endpoints (checking API status, fetching books).
 * - Authentication (registering an API client).
 * - Private endpoints (creating, fetching, updating, and deleting orders).
 *
 * API testing is crucial for validating backend logic independently of any UI.
 * These tests ensure the API behaves as expected, handles errors correctly,
 * and enforces authentication properly.
 *
 * @author Omar Rizk
 */

describe("Simple Books API - Public Endpoints", () => {
  const baseUrl = "https://simple-books-api.glitch.me"; // Base API URL

  it("Should check API status", () => {
    // The `/status` endpoint should return 200 and indicate that the API is running.
    cy.request("GET", `${baseUrl}/status`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "OK");
      cy.log("API Status Response:", response.body);
    });
  });

  it("Should fetch the list of books", () => {
    // The `/books` endpoint should return a non-empty array of books.
    cy.request("GET", `${baseUrl}/books`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").that.is.not.empty;
      cy.log("Fetched Books:", response.body);
    });
  });

  it("Should fetch books with optional parameters (fiction)", () => {
    // Fetching books that belong to the "fiction" category.
    cy.request("GET", `${baseUrl}/books?type=fiction`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").that.is.not.empty;

      // Ensuring all books returned are of type "fiction"
      response.body.forEach((book) => {
        expect(book).to.have.property("type", "fiction");
      });

      cy.log("Fiction Books:", response.body);
    });
  });

  it("Should fetch books with optional parameters (limit)", () => {
    const limit = 3;
    cy.request("GET", `${baseUrl}/books?limit=${limit}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.at.most(limit);
      cy.log(`Books (Limit ${limit}):`, response.body);
    });
  });

  it("Should return 400 for invalid query parameters", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/books?type=invalid`, // Invalid type parameter
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      cy.log("Invalid Query Response:", response.body);
    });
  });

  it("Should fetch a single book by ID", () => {
    cy.request("GET", `${baseUrl}/books/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", 1);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("type");
      cy.log("Book Details:", response.body);
    });
  });
});

describe("Simple Books API - Authentication & Order Management", () => {
  const baseUrl = "https://simple-books-api.glitch.me";
  let authToken; // Variable to store authentication token
  let orderId; // Variable to store the created order ID

  before(() => {
    // Registering a new API client to get an access token.
    cy.request("POST", `${baseUrl}/api-clients/`, {
      clientName: "CypressTestClient",
      clientEmail: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
    }).then((response) => {
      expect(response.status).to.eq(201);
      authToken = response.body.accessToken;
      cy.log("Generated Auth Token:", authToken);
    });
  });

  it("Should submit a new order", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/orders`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: { bookId: 1, customerName: "John Doe" },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("orderId");
      orderId = response.body.orderId;
      cy.log("Order Created:", orderId);
    });
  });

  it("Should fail to submit an order without authentication", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/orders`,
      body: { bookId: 1, customerName: "Unauthorized User" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      cy.log("Unauthorized Order Response:", response.body);
    });
  });

  it("Should fail to submit an order with missing required fields", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/orders`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: { bookId: 1 }, // Missing customerName
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      cy.log("Order Creation Failure Response:", response.body);
    });
  });

  it("Should fetch all orders", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      cy.log("Orders List:", response.body);
    });
  });

  it("Should fetch a single order by ID and Validate Details", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders/${orderId}`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", orderId);
      expect(response.body).to.have.property("bookId", 1);
      expect(response.body).to.have.property("customerName", "John Doe");
      cy.log("Order Details:", response.body);
    });
  });

  it("Should update an order's customer name", () => {
    cy.request({
      method: "PATCH",
      url: `${baseUrl}/orders/${orderId}`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: { customerName: "Jane Doe" },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    // Verifying the update
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders/${orderId}`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.customerName).to.eq("Jane Doe");
    });
  });

  it("Should delete an order", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/orders/${orderId}`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    // Confirming deletion
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders/${orderId}`,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
