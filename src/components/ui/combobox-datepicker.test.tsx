import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Combobox } from "./combobox";
import { DatePicker } from "./date-picker";

const OPTIONS = ["Canada", "France", "Germany", "India"];

function ComboHarness() {
  const [v, setV] = useState("");
  return (
    <>
      <label htmlFor="c">Country</label>
      <Combobox id="c" options={OPTIONS} value={v} onChange={setV} />
      <output data-testid="value">{v}</output>
    </>
  );
}

describe("Combobox", () => {
  it("filters, navigates with arrows, commits with Enter", async () => {
    const user = userEvent.setup();
    render(<ComboHarness />);
    const input = screen.getByRole("combobox", { name: "Country" });
    await user.type(input, "an");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Canada",
      "France",
      "Germany",
    ]);
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", screen.getAllByRole("option")[1].id);
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("value")).toHaveTextContent("France");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("commits an exact typed match on blur, and clears the value when edited", async () => {
    const user = userEvent.setup();
    render(<ComboHarness />);
    const input = screen.getByRole("combobox");
    await user.type(input, "india");
    await user.tab();
    expect(screen.getByTestId("value")).toHaveTextContent("India");
    await user.type(input, "x");
    expect(screen.getByTestId("value")).toBeEmptyDOMElement();
  });

  it("shows an empty state and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ComboHarness />);
    await user.type(screen.getByRole("combobox"), "zz");
    expect(screen.getByText("No matches")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

function DateHarness() {
  const [v, setV] = useState("");
  return <DatePicker id="d" value={v} onChange={setV} defaultMonth="2026-12-01" />;
}

describe("DatePicker", () => {
  it("opens on the default month, moves with arrow keys, selects with Enter", async () => {
    const user = userEvent.setup();
    render(<DateHarness />);
    await user.click(screen.getByRole("button", { name: /Pick a date/ }));
    expect(screen.getByRole("grid", { name: "December 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tue, 1 Dec 2026" })).toHaveFocus();

    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(screen.getByRole("button", { name: "Wed, 9 Dec 2026" })).toHaveFocus();
    await user.keyboard("{PageDown}");
    expect(screen.getByRole("grid", { name: "January 2027" })).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /Sat, 9 Jan 2027/ })).toBeInTheDocument();
  });
});
