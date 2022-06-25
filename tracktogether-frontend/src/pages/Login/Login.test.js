import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

describe("Login Page", () => {
  test("renders login page correctly", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  // test("returns and stores authentication token upon successful login", async () => {
  //   render(
  //     <Router>
  //       <Login />
  //     </Router>
  //   );
  //   // const setAuthToken = jest.spyOn(localStorage, "setItem");
  //   userEvent.type(screen.getByPlaceholderText("Username"), "Chang");
  //   userEvent.type(screen.getByPlaceholderText("Password"), "heymom");
  //   await userEvent.click(screen.getByRole("button", { name: /Log In/i }));
  //   expect(localStorage.setItem).toHaveBeenCalled();
  //   jest.clearAllMocks;
  // });
});
