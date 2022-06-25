import { render, screen, within } from "../../test-utils/testing-library-utils";
import "@testing-library/jest-dom";
import Home from "./Home";

describe("Home Page", () => {
  test("renders home title correctly", async () => {
    render(<Home />);
    const title = await screen.findByText(/Welcome Mr Chang!/i);
    expect(title).toBeInTheDocument();
  });

  test("fetches and renders quote correctly", async () => {
    render(<Home />);
    const quoteBox = screen.getByTestId("quote");
    const quote = await within(quoteBox).findByText(/Dummy Quote/i);
    const author = await within(quoteBox).findByText(/Dummy Author/i);
    expect(quote).toBeInTheDocument();
    expect(author).toBeInTheDocument();
  });
});
