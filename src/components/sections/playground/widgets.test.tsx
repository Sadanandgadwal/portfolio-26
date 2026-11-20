import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { portfolio } from "@/lib/content";
import { ButtonsSpecimen } from "./buttons-specimen";
import { ChartSpecimen } from "./chart-specimen";
import { OverlaySpecimen } from "./overlay-specimen";
import { Playground } from "./playground";
import { TabsSpecimen } from "./tabs-specimen";
import { ThemeSpecimen } from "./theme-specimen";

const { playground } = portfolio;

describe("Playground section", () => {
  it("renders all specimens and the sample-data label", () => {
    render(<Playground playground={playground} />);
    expect(screen.getByRole("heading", { level: 2, name: playground.heading })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(8);
    expect(screen.getByText(playground.sampleLabel)).toBeInTheDocument();
  });
});

describe("ButtonsSpecimen", () => {
  it("runs idle → loading → done → idle and announces status", async () => {
    vi.useFakeTimers();
    render(<ButtonsSpecimen />);
    const btn = screen.getByTestId("deploy-button");
    act(() => btn.click());
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    await act(async () => vi.advanceTimersByTime(1400));
    expect(btn).toHaveTextContent("Deployed");
    expect(screen.getByRole("status")).toHaveTextContent("Deployed successfully");
    await act(async () => vi.advanceTimersByTime(1800));
    expect(btn).toHaveTextContent("Deploy");
    vi.useRealTimers();
  });
});

describe("TabsSpecimen", () => {
  it("switches panels by click and arrow keys", async () => {
    const user = userEvent.setup();
    render(<TabsSpecimen tabs={playground.tabs} />);
    const [first, second] = playground.tabs;
    expect(screen.getByRole("tabpanel")).toHaveTextContent(first.body);
    await user.click(screen.getByRole("tab", { name: second.label }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(second.body);
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: first.label })).toHaveAttribute("aria-selected", "true");
  });
});

describe("OverlaySpecimen", () => {
  it("opens the dialog, submits, closes and reports status", async () => {
    const user = userEvent.setup();
    render(<OverlaySpecimen />);
    await user.click(screen.getByRole("button", { name: "Open modal" }));
    const dialog = await screen.findByRole("dialog", { name: "Invite a teammate" });
    expect(dialog).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send invite" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Invite sent (sample).")).toBeInTheDocument();
  });

  it("shows a tooltip on keyboard focus", async () => {
    const user = userEvent.setup();
    render(<OverlaySpecimen />);
    await user.tab(); // modal button
    await user.tab(); // first toolbar action
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy link");
  });
});

describe("ThemeSpecimen", () => {
  it("switches the site theme via a radio group", async () => {
    const user = userEvent.setup();
    render(<ThemeSpecimen />);
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
  });
});

describe("ChartSpecimen", () => {
  it("defaults to the latest point, moves with arrow keys, and switches series/range", async () => {
    const user = userEvent.setup();
    render(<ChartSpecimen chart={playground.chart} />);
    const [revenue, orders] = playground.chart.series;
    const lastLabel = playground.chart.labels.at(-1)!;
    expect(screen.getByTestId("chart-tooltip")).toHaveTextContent(lastLabel);

    screen.getByRole("group", { name: /Revenue chart/ }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByTestId("chart-tooltip")).toHaveTextContent(playground.chart.labels.at(-2)!);

    await user.click(screen.getByRole("radio", { name: orders.label }));
    expect(screen.getByRole("group", { name: /Orders chart/ })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "7D" }));
    const sum7 = orders.values.slice(-7).reduce((a, b) => a + b, 0);
    expect(screen.getByText(sum7.toLocaleString("en-US"))).toBeInTheDocument();
    expect(revenue.values).toHaveLength(playground.chart.labels.length);
  });
});
