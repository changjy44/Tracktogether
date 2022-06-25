import { render, screen, within } from "../../test-utils/testing-library-utils";
import "@testing-library/jest-dom";
import Groups from "./Groups";
import userEvent from "@testing-library/user-event";

describe("Groups Page", () => {
  test("renders group page correctly", async () => {
    render(<Groups />);
    const groups = await screen.findAllByRole("card");
    console.log(groups);
    expect(groups).toHaveLength(2);
    expect(within(groups[0]).getByText("Final Group")).toBeInTheDocument();
    expect(within(groups[0]).getByText(/26/)).toBeInTheDocument();
    expect(within(groups[1]).getByText("Malaysia")).toBeInTheDocument();
    expect(within(groups[1]).getByText(/27/)).toBeInTheDocument();
  });

  test("create button opens up a popover", async () => {
    render(<Groups />);
    const nullPopover = screen.queryByText(/Create New Group/i);
    expect(nullPopover).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Create" }));
    const popover = await screen.findByText(/Create New Group/i);
    expect(popover).toBeInTheDocument();
  });
});
