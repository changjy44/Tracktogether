import { render, screen } from "../test-utils/testing-library-utils";
import App from "../App";
import userEvent from "@testing-library/user-event";

test.each([
  { route: "/home" },
  { route: "/personal" },
  { route: "/profile" },
  { route: "/outstanding" },
])(
  "redirects to login page from $route when not authenticated",
  ({ route }) => {
    render(<App />, [route]);
    const loginButton = screen.getByRole("button", { name: /Log In/i });
    expect(loginButton).toBeInTheDocument();
  }
);

test("successful sign-in flow and navigation between pages", () => {
  //go to the protected page
  const { history } = render(<App />, ["/home"]);
  
  //sign in
  const nameField = screen.getByPlaceholderText("Username");
  userEvent.type(nameField, "testuser");

  const passwordField = screen.getByPlaceholderText("Password");
  userEvent.type(passwordField, "testpassword");

  const loginButton = screen.getByRole("button", { name: /Log In/i });
  userEvent.click(loginButton);

  expect(history.location.pathname).toBe("/home");
});
