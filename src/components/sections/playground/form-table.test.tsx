import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { FormSpecimen } from "./form-specimen";
import { TableSpecimen } from "./table-specimen";

const { playground } = portfolio;

describe("FormSpecimen", () => {
  it("shows linked errors on submit, focuses the first invalid field, then succeeds", async () => {
    const user = userEvent.setup();
    render(<FormSpecimen roles={playground.form.roles} />);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    const name = screen.getByLabelText("Name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Enter at least 2 characters.");
    expect(name).toHaveFocus();
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
      "Enter a valid email address.",
    );

    await user.type(name, "Ada");
    expect(name).not.toHaveAttribute("aria-invalid"); // live once touched
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("combobox", { name: "Role" }));
    await user.click(await screen.findByRole("option", { name: playground.form.roles[0] }));
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("Thanks, Ada.", {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it("validates a field on blur only after it was touched", async () => {
    const user = userEvent.setup();
    render(<FormSpecimen roles={playground.form.roles} />);
    const email = screen.getByLabelText("Email");
    expect(email).not.toHaveAttribute("aria-invalid");
    await user.type(email, "nope");
    await user.tab();
    expect(email).toHaveAttribute("aria-invalid", "true");
  });
});

describe("TableSpecimen", () => {
  const rows = playground.table.rows;
  const bodyRows = () => within(screen.getByRole("table")).getAllByRole("row").slice(1);

  it("paginates 5 per page with a range label and disabled bounds", async () => {
    const user = userEvent.setup();
    render(<TableSpecimen rows={rows} />);
    expect(bodyRows()).toHaveLength(5);
    expect(screen.getByTestId("table-range")).toHaveTextContent(`1–5 of ${rows.length}`);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByTestId("table-range")).toHaveTextContent(`6–10 of ${rows.length}`);
  });

  it("sorts via header buttons and exposes aria-sort", async () => {
    const user = userEvent.setup();
    render(<TableSpecimen rows={rows} />);
    const header = screen.getByRole("columnheader", { name: /Name/ });
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    const sorted = [...rows].map((r) => r.name).sort((a, b) => a.localeCompare(b));
    expect(within(bodyRows()[0]).getByText(sorted[0])).toBeInTheDocument();
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(within(bodyRows()[0]).getByText(sorted.at(-1)!)).toBeInTheDocument();
  });

  it("searches and filters, resetting to page 1, with an empty state", async () => {
    const user = userEvent.setup();
    render(<TableSpecimen rows={rows} />);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await user.type(screen.getByRole("searchbox", { name: "Search members" }), "design");
    const designCount = rows.filter((r) => r.team === "Design").length;
    expect(screen.getByTestId("table-range")).toHaveTextContent(
      `1–${Math.min(5, designCount)} of ${designCount}`,
    );

    await user.click(screen.getByRole("combobox", { name: "Filter by status" }));
    await user.click(await screen.findByRole("option", { name: "Suspended" }));
    const both = rows.filter((r) => r.team === "Design" && r.status === "suspended").length;
    expect(bodyRows()).toHaveLength(Math.max(both, 1));

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText("No members match your filters.")).toBeInTheDocument();
  });
});
