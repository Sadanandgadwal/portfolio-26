import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { SiteHeader } from "./site-header";

const { personal, navigation } = portfolio;
const renderHeader = () =>
  render(
    <SiteHeader
      name={personal.name}
      shortName={personal.shortName}
      roles={personal.roles}
      items={navigation.items}
    />,
  );

describe("SiteHeader", () => {
  it("renders every nav item from JSON in the primary nav", () => {
    renderHeader();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const item of navigation.items) {
      expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("switches to the floating state after scrolling", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header).not.toHaveAttribute("data-scrolled");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 200, configurable: true });
      fireEvent.scroll(window);
    });
    expect(header).toHaveAttribute("data-scrolled", "true");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("mobile menu opens as an accessible dialog, closes on Escape and on link click", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog", { name: "Menu" });
    const mobileNav = within(dialog).getByRole("navigation", { name: "Mobile" });
    expect(within(mobileNav).getAllByRole("link")).toHaveLength(navigation.items.length);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const reopened = await screen.findByRole("dialog");
    await user.click(within(reopened).getByRole("link", { name: /About/ }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
