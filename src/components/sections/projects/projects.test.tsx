import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fixtureProjects } from "@/app/design-system/sections/fixtures";
import { portfolio } from "@/lib/content";
import { ProjectCaseStudy } from "./project-case-study";
import { ProjectPreview } from "./project-preview";
import { Projects, techIconMap } from "./projects";

const [videoProject, tallProject, bareProject] = fixtureProjects.items;
const icons = techIconMap(portfolio.skills);

describe("Projects section", () => {
  it("renders nothing without projects", () => {
    const { container } = render(
      <Projects projects={{ ...fixtureProjects, items: [] }} skills={portfolio.skills} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a card per project linking to its case study, with safe external links", () => {
    render(<Projects projects={fixtureProjects} skills={portfolio.skills} basePath="/x" />);
    const list = screen.getByRole("list", { name: "Projects" });
    expect(within(list).getAllByRole("article")).toHaveLength(3);
    expect(screen.getByRole("link", { name: videoProject.title })).toHaveAttribute(
      "href",
      `/x/${videoProject.slug}`,
    );
    const live = screen.getByRole("link", { name: /Live/ });
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("maps technology names to icon keys from the skills data", () => {
    expect(icons["React.js"]).toBe("react");
    expect(icons["Unknown"]).toBeUndefined();
  });
});

describe("ProjectPreview", () => {
  it("renders a typographic frame when there is no cover", () => {
    render(<ProjectPreview project={bareProject} active={false} sizes="100vw" />);
    expect(screen.getByText(bareProject.title)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("loads the video only once activated, and plays/pauses with hover", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { rerender } = render(
      <ProjectPreview project={videoProject} active={false} sizes="100vw" />,
    );
    expect(screen.queryByTestId("project-preview-video")).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", videoProject.media.coverAlt);

    rerender(<ProjectPreview project={videoProject} active sizes="100vw" />);
    const video = screen.getByTestId("project-preview-video");
    expect(video).toHaveAttribute("preload", "none");
    expect(play).toHaveBeenCalled();

    rerender(<ProjectPreview project={videoProject} active={false} sizes="100vw" />);
    expect(screen.getByTestId("project-preview-video")).toBeInTheDocument(); // stays cached
    expect(pause).toHaveBeenCalled();
  });

  it("never loads previews under reduced motion", () => {
    window.__reduceMotion = true;
    render(<ProjectPreview project={videoProject} active sizes="100vw" />);
    expect(screen.queryByTestId("project-preview-video")).not.toBeInTheDocument();
  });

  it("has no video for projects without a preview", () => {
    render(<ProjectPreview project={tallProject} active sizes="100vw" />);
    expect(screen.queryByTestId("project-preview-video")).not.toBeInTheDocument();
  });
});

describe("ProjectCaseStudy", () => {
  const next = { title: tallProject.title, href: "/x/next" };

  it("renders all populated sections, pairs challenges with solutions, links next project", () => {
    render(
      <ProjectCaseStudy
        project={videoProject}
        next={next}
        backHref="/#projects"
        techIcons={icons}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: videoProject.title })).toBeInTheDocument();
    for (const name of [
      "Overview",
      "Key features",
      "Challenges & solutions",
      "Results",
      "Screens",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByText(videoProject.challenges[0])).toBeInTheDocument();
    expect(screen.getByText(videoProject.solutions[0])).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Live demo/ })).toHaveAttribute(
      "href",
      videoProject.links.live,
    );
    expect(screen.queryByRole("link", { name: /Source/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next project/ })).toHaveAttribute("href", next.href);
    expect(screen.getByRole("link", { name: /All projects/ })).toHaveAttribute(
      "href",
      "/#projects",
    );
  });

  it("omits empty sections", () => {
    render(<ProjectCaseStudy project={bareProject} backHref="/" techIcons={icons} />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Next project/ })).not.toBeInTheDocument();
  });

  it("opens screenshots in an accessible lightbox", async () => {
    const user = userEvent.setup();
    render(<ProjectCaseStudy project={videoProject} backHref="/" techIcons={icons} />);
    const shot = videoProject.media.screenshots[0];
    await user.click(screen.getAllByRole("button", { name: /Open larger view/ })[0]);
    const dialog = await screen.findByRole("dialog", { name: shot.alt });
    expect(within(dialog).getByRole("img", { name: shot.alt })).toBeInTheDocument();
    await act(async () => fireEvent.keyDown(dialog, { key: "Escape" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
