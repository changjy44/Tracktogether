import { render, screen } from "../../test-utils/testing-library-utils";
import "@testing-library/jest-dom";
import Outstanding from "./Outstanding";

test("outstanding titles are correct", async () => {
  render(<Outstanding />);
  const title = await screen.findByText(
    /You have no items that require classifications at the moment/i
  );
  expect(title).toBeInTheDocument();

  const groupTitle = await screen.findByText(/Outstanding Payments/i);

  expect(groupTitle).toBeInTheDocument();

  const alertTitle = await screen.findByText(/Alerts/i);

  expect(alertTitle).toBeInTheDocument();

  const monitorPaymentsTitle = await screen.findByText(/Payments to you/i);

  expect(monitorPaymentsTitle).toBeInTheDocument();

  //   const filterButton = screen.getByRole("button", {
  //     name: /Group/i,
  //   });

  //   userEvent.click(filterButton);

  //   const outstandingPaymentsTitle = await screen.findByText(
  //     /Outstanding Payments/i
  //   );
  //   expect(outstandingPaymentsTitle).toBeInTheDocument();
});
