import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fixtureContact } from "@/app/design-system/sections/fixtures";
import { SiteFooter } from "@/components/layout/site-footer";
import { portfolio } from "@/lib/content";
import { Contact } from "./contact";

vi.mock("@/components/layout/copyright-year", () => ({ CopyrightYear: () => "2026" }));

const { contact, personal, resume, socials, footer } = portfolio;

describe("Contact", () => {
  it("without contact data: heading only, no dead controls", () => {
    render(
      <Contact
        contact={contact}
        personal={{ ...personal, email: "" }}
        resume={{ ...resume, file: "" }}
        socials={socials.map((s) => ({ ...s, url: "" }))}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: contact.heading })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("with data: mailto CTA, resume download, external socials (email not duplicated)", () => {
    render(<Contact contact={contact} {...fixtureContact} />);
    expect(screen.getByRole("link", { name: new RegExp(contact.cta.label) })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
    const resumeLink = screen.getByRole("link", { name: new RegExp(resume.label) });
    expect(resumeLink).toHaveAttribute("href", "/fixtures/fixture-resume.pdf");
    expect(resumeLink).toHaveAttribute("download");
    const social = within(screen.getByRole("navigation", { name: "Social profiles" }));
    expect(social.getAllByRole("link")).toHaveLength(2);
    expect(social.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
    expect(social.queryByRole("link", { name: /Email/ })).not.toBeInTheDocument();
  });

  it("copies the email and announces it; reports failures", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<Contact contact={contact} {...fixtureContact} />);
    await user.click(screen.getByRole("button", { name: /hello@example.com/ }));
    expect(writeText).toHaveBeenCalledWith("hello@example.com");
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied to clipboard.");

    writeText.mockRejectedValueOnce(new Error("denied"));
    await user.click(screen.getByRole("button", { name: /hello@example.com/ }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/Couldn't copy/));
  });
});

describe("SiteFooter", () => {
  it("renders name, tagline, year, back-to-top, and resolved social links", () => {
    render(
      <SiteFooter
        personal={fixtureContact.personal}
        footer={footer}
        socials={fixtureContact.socials}
      />,
    );
    const contentinfo = screen.getByRole("contentinfo");
    expect(contentinfo).toHaveTextContent(`© 2026 ${personal.name}`);
    expect(contentinfo).toHaveTextContent(footer.tagline);
    const nav = within(screen.getByRole("navigation", { name: "Footer social links" }));
    expect(nav.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
    expect(nav.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
    expect(screen.getByRole("button", { name: "Back to top" })).toBeInTheDocument();
  });

  it("hides the social nav when no links are configured", () => {
    render(
      <SiteFooter
        personal={{ ...personal, email: "" }}
        footer={footer}
        socials={socials.map((s) => ({ ...s, url: "" }))}
      />,
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("back-to-top scrolls to the top", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    render(<SiteFooter personal={personal} footer={footer} socials={[]} />);
    await userEvent.click(screen.getByRole("button", { name: "Back to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
