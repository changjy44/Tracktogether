import { render, screen } from "../../test-utils/testing-library-utils";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Profile from "./Profile";
import imageAvatar from "../../images/img_avatar.png";

describe("Profile Page", () => {
  test("renders profile page with correct information populated", async () => {
    render(<Profile />);

    const inputFields = screen.getAllByRole("textbox");
    expect(inputFields).toHaveLength(5);

    const nameValue = await screen.findByDisplayValue(/Chang/i);
    expect(nameValue).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Number").value).toBe("99118822");
    expect(screen.getByLabelText("Email").value).toBe("testmode@xyz.com");

    const image = await screen.findByRole("img");
    expect(image.src).toContain(
      "https://orbital.comp.nus.edu.sg/wp-content/uploads/sites/12/2020/04/cropped-cropped-STS-133_Discovery_Lift_Off_Launch_Pad_39A_KSC.jpg"
    );
  });

  test("input fields enabled for edit when button is clicked", async () => {
    render(<Profile />);
    await userEvent.click(
      screen.getByRole("button", { name: /Edit Profile/i })
    );
    expect(screen.getByPlaceholderText("Enter Name")).toBeDisabled();
    expect(screen.getByPlaceholderText("Enter Contact")).toBeEnabled();
    expect(screen.getByPlaceholderText("Enter Email")).toBeEnabled();
  });

  test("able to remove profile picture and revert to image avatar", async () => {
    render(<Profile />);
    await userEvent.click(screen.getByRole("button", { name: /Remove/i }));
    const image = await screen.findByRole("img");
    expect(image.src).toContain(imageAvatar);
  });
});
