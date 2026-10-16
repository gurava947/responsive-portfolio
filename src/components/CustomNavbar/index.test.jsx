import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CustomNavbar from "./index";

describe("CustomNavbar", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("navigates to the selected in-page link and closes the expanded menu", () => {
    render(<CustomNavbar data={{
      openMenuLabel: "Open navigation menu",
      closeMenuLabel: "Close navigation menu",
      navigationLinks: [{ label: "Services", href: "#services" }],
    }} />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const link = screen.getByRole("link", { name: "Services" });
    expect(link).toHaveAttribute("href", "#services");

    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    act(() => link.dispatchEvent(click));

    expect(click.defaultPrevented).toBe(false);
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
