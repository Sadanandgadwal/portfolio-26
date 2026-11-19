import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { IconButton } from "./icon-button";

describe("Button", () => {
  it("handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("loading: disabled, aria-busy, spinner, and ignores clicks", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("asChild renders the child element with button styles", () => {
    render(
      <Button asChild>
        <a href="#projects">Projects</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link.className).toContain("rounded-full");
  });
});

describe("IconButton", () => {
  it("exposes its aria-label as the accessible name", () => {
    render(
      <IconButton aria-label="Search">
        <svg aria-hidden />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Search" })).toHaveClass("size-11");
  });
});
