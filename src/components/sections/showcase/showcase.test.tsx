import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { formatCurrency } from "@/lib/format";
import { summarize } from "@/lib/showcase/orders";
import { CustomerFormView } from "./customer-form-view";
import { ShowcaseApp } from "./showcase-app";

const { showcase } = portfolio;

describe("ShowcaseApp", () => {
  it("dashboard KPIs are computed from the orders and react to the region filter", async () => {
    const user = userEvent.setup();
    render(<ShowcaseApp data={showcase} />);
    expect(screen.getByTestId("kpi-Revenue")).toHaveTextContent(
      formatCurrency(summarize(showcase.orders).revenue),
    );
    await user.click(screen.getByRole("radio", { name: "North" }));
    const north = showcase.orders.filter((o) => o.region === "North");
    expect(screen.getByTestId("kpi-Orders")).toHaveTextContent(String(north.length));
  });

  it("switches views via the app navigation and marks the current page", async () => {
    const user = userEvent.setup();
    render(<ShowcaseApp data={showcase} />);
    const nav = screen.getByRole("navigation", { name: /sections/ });
    await user.click(within(nav).getByRole("button", { name: "Orders" }));
    expect(within(nav).getByRole("button", { name: "Orders" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("searchbox", { name: "Search orders" })).toBeInTheDocument();
  });

  it("orders: detail modal ships a paid order and the change persists in the table", async () => {
    const user = userEvent.setup();
    render(<ShowcaseApp data={showcase} />);
    await user.click(
      within(screen.getByRole("navigation", { name: /sections/ })).getByRole("button", {
        name: "Orders",
      }),
    );
    const paid = showcase.orders.find((o) => o.status === "paid")!;
    await user.type(screen.getByRole("searchbox", { name: "Search orders" }), paid.id);
    await user.click(screen.getByRole("button", { name: paid.id }));
    const dialog = await screen.findByRole("dialog", { name: `Order ${paid.id}` });
    await user.click(within(dialog).getByRole("button", { name: "Mark as shipped" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("orders-range")).toHaveTextContent(`${paid.id} marked as shipped.`);
    const row = screen.getByRole("button", { name: paid.id }).closest("tr")!;
    expect(row).toHaveTextContent("shipped");
  });

  it("shipped/cancelled orders cannot transition", async () => {
    const user = userEvent.setup();
    render(<ShowcaseApp data={showcase} />);
    await user.click(
      within(screen.getByRole("navigation", { name: /sections/ })).getByRole("button", {
        name: "Orders",
      }),
    );
    const shipped = showcase.orders.find((o) => o.status === "shipped")!;
    await user.type(screen.getByRole("searchbox"), shipped.id);
    await user.click(screen.getByRole("button", { name: shipped.id }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Mark as shipped" })).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "Cancel order" })).toBeDisabled();
  });
});

describe("CustomerFormView", () => {
  it("submitting empty shows a focused error summary linking to fields", async () => {
    const user = userEvent.setup();
    render(<CustomerFormView countries={showcase.countries} defaultMonth="2026-12-01" />);
    await user.click(screen.getByRole("button", { name: "Add customer" }));
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Fix 4 fields");
    expect(within(alert).getByRole("link", { name: "Country" })).toHaveAttribute(
      "href",
      `#${screen.getByRole("combobox").id}`,
    );
    expect(screen.getByLabelText("Company")).toHaveAttribute("aria-invalid", "true");
  });

  it("rejects weekend start dates and unknown countries, then succeeds", async () => {
    const user = userEvent.setup();
    render(<CustomerFormView countries={showcase.countries} defaultMonth="2026-12-01" />);
    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.type(screen.getByLabelText("Billing email"), "billing@example.com");
    await user.type(screen.getByRole("combobox"), "Atlantis");
    await user.tab();
    expect(screen.getByText("Choose a country from the list.")).toBeInTheDocument();

    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "Ireland");
    await user.tab();

    await user.click(screen.getByRole("button", { name: "Contract start Pick a date" }));
    await user.click(screen.getByRole("button", { name: "Sat, 5 Dec 2026" }));
    expect(screen.getByText("Contracts can only start on a weekday.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Contract start Sat, 5 Dec 2026" }));
    await user.click(screen.getByRole("button", { name: "Mon, 7 Dec 2026" }));

    await user.click(screen.getByRole("button", { name: "Add customer" }));
    expect(screen.getByRole("status")).toHaveTextContent("Acme added");
    expect(screen.getByRole("status")).toHaveTextContent("Ireland · starts Mon, 7 Dec 2026");
  });
});
