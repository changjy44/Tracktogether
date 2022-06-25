import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SignUp from "./SignUp";

describe("Sign Up Page", () => {
  test("renders sign up page correctly", () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // check to ensure that each field exist and can accept only inputs of the corresponding format
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contact Number")).toHaveAttribute(
      "type",
      "number"
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
    expect(screen.getByPlaceholderText("Confirm Password")).toHaveAttribute(
      "type",
      "password"
    );
    expect(screen.getByRole("button")).toHaveTextContent("Sign Up");
  });

  test("button should be disabled and enabled accordingly", () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    userEvent.type(screen.getByPlaceholderText("Username"), "Test");
    userEvent.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    userEvent.type(screen.getByPlaceholderText("Contact Number"), "98765432");
    userEvent.type(screen.getByPlaceholderText("Password"), "testpassword");
    userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "testpassword"
    );

    expect(button).toBeEnabled();
  });

  test("displays error message to users upon invalid entries", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    userEvent.type(screen.getByPlaceholderText("Username"), "");
    userEvent.type(screen.getByPlaceholderText("Email"), "");
    userEvent.type(screen.getByPlaceholderText("Contact Number"), "");
    userEvent.type(screen.getByPlaceholderText("Password"), "");
    userEvent.type(screen.getByPlaceholderText("Confirm Password"), "");
    userEvent.type(screen.getByPlaceholderText("Username"), "");
    const errorMessages = screen.getAllByRole("error");
    expect(errorMessages).toHaveLength(5);
    errorMessages.map((err) => expect(err).toHaveStyle({ color: "red" }));
  });
});
