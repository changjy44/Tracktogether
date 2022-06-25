import { render, screen } from "../../../test-utils/testing-library-utils";
import "@testing-library/jest-dom";
import GroupDetails from "./GroupDetails";

test("Tab renders error 404 correctly", async () => {
  render(<GroupDetails />);

  // Initial Tab open should be initiate payment
  const title = await screen.findByText(/Error 404 not found/i);
  expect(title).toBeInTheDocument();
});
