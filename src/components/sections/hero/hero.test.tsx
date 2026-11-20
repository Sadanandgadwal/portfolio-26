import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { Hero } from "./hero";
import { HeroMockup } from "./hero-mockup";

const { hero, personal } = portfolio;
const mockup = hero.mockup;

describe("Hero", () => {
  it("renders JSON content with a single h1 and CTA links", () => {
    render(<Hero hero={hero} personal={personal} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(hero.heading);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(personal.roles.join(" / "))).toBeInTheDocument();
    expect(screen.getByText(hero.statement)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: hero.primaryCta.label })).toHaveAttribute(
      "href",
      hero.primaryCta.href,
    );
    expect(screen.getByRole("link", { name: hero.secondaryCta.label })).toHaveAttribute(
      "href",
      hero.secondaryCta.href,
    );
  });

  it("hides optional availability/location when empty", () => {
    render(<Hero hero={hero} personal={{ ...personal, availability: "", location: "" }} />);
    expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
  });
});

describe("HeroMockup", () => {
  it("is labelled as sample data", () => {
    render(<HeroMockup data={mockup} />);
    expect(screen.getByRole("group", { name: /sample data/i })).toBeInTheDocument();
    expect(screen.getByText(mockup.sampleLabel)).toBeInTheDocument();
  });

  it("search filters the table and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<HeroMockup data={mockup} />);
    const table = screen.getByRole("table");
    const search = screen.getByRole("searchbox");
    const first = mockup.table.rows[0];

    await user.type(search, first.name.split(" · ")[1]);
    expect(within(table).getAllByRole("row")).toHaveLength(2); // header + 1
    expect(within(table).getByText(first.name)).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "zzz");
    expect(within(table).getByText(/No results/)).toBeInTheDocument();
  });

  it("modal: cancel closes, primary action reopens, confirm shows a status toast", async () => {
    const user = userEvent.setup();
    render(<HeroMockup data={mockup} />);
    expect(screen.getByRole("group", { name: mockup.modal.title })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: mockup.modal.cancel }));
    await waitFor(() =>
      expect(screen.queryByRole("group", { name: mockup.modal.title })).not.toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: mockup.primaryAction }));
    await user.click(await screen.findByRole("button", { name: mockup.modal.confirm }));
    expect(await screen.findByRole("status")).toHaveTextContent(mockup.modal.fieldValue);
  });

  it("chart bars reveal their value on focus", async () => {
    const user = userEvent.setup();
    render(<HeroMockup data={mockup} />);
    const point = mockup.chart.points[3];
    await user.click(screen.getByRole("button", { name: `${point.label}: ${point.value}` }));
    expect(await screen.findByText(String(point.value))).toBeInTheDocument();
  });

  it("sidebar navigation switches the active view", async () => {
    const user = userEvent.setup();
    render(<HeroMockup data={mockup} />);
    const target = screen.getByRole("button", { name: mockup.navItems[2] });
    await user.click(target);
    expect(target).toHaveAttribute("aria-pressed", "true");
  });
});
