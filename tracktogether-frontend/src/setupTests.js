import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
// src/setupTests.js
import { server } from "./mocks/server.js";

// let mockToken = {};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
  // global.Storage.prototype.setItem = jest.fn((key, value) => {
  //   mockToken[key] = value;
  // });
  // global.Storage.prototype.getItem = jest.fn((key) => mockToken[key]);
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  // mockToken = {};
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
  // global.Storage.prototype.setItem.mockReset();
  // global.Storage.prototype.getItem.mockReset();
});
