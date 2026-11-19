import { ArrowUpRight, Download } from "lucide-react";
import { Section, sectionHeadingId } from "@/components/layout/section";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { resolveSocials, type Portfolio } from "@/lib/content";
import { CopyEmail } from "./copy-email";

type ContactProps = Pick<Portfolio, "contact" | "personal" | "resume" | "socials">;

const hostOf = (url: string) => {
  if (url.startsWith("mailto:")) return url.slice(7);
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Final CTA. Each control renders only when its data exists in portfolio.json. */
export function Contact({ contact, personal, resume, socials }: ContactProps) {
  const email = personal.email;
  const links = resolveSocials(socials, email).filter((s) => s.platform !== "email");

  return (
    <Section id="contact" className="border-t">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          {contact.eyebrow && <p className="label-mono">{contact.eyebrow}</p>}
          <h2
            id={sectionHeadingId("contact")}
            className="reveal mt-4 text-[clamp(2.75rem,1.4rem+5.4vw,6.75rem)] leading-[0.95] font-semibold tracking-[-0.045em]"
          >
            {contact.heading}
          </h2>
          {contact.description && (
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {contact.description}
            </p>
          )}

          {(email || resume.file) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {email && (
                <Magnetic>
                  <Button asChild size="lg">
                    <a href={`mailto:${email}`}>
                      {contact.cta.label}
                      <ArrowUpRight aria-hidden data-icon="inline-end" />
                    </a>
                  </Button>
                </Magnetic>
              )}
              {resume.file && (
                <Button asChild size="lg" variant="outline">
                  <a href={resume.file} download>
                    {resume.label}
                    <Download aria-hidden data-icon="inline-end" />
                  </a>
                </Button>
              )}
            </div>
          )}
          {resume.file && resume.updated && (
            <p className="mt-3 text-sm text-muted-foreground">Updated {resume.updated}</p>
          )}
          {email && (
            <div className="mt-8">
              <CopyEmail email={email} label={contact.copyEmailLabel} />
            </div>
          )}
        </div>

        {links.length > 0 && (
          <nav aria-label="Social profiles" className="lg:col-span-5 lg:pt-14">
            <ul className="border-b">
              {links.map((s) => (
                <li key={s.platform} className="border-t">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social grid grid-cols-[1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-subtle/60"
                  >
                    <span className="grid gap-0.5">
                      <span className="text-xl font-medium tracking-tight transition-transform duration-300 ease-out-expo group-hover/social:translate-x-1">
                        {s.label}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {hostOf(s.url)}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5 group-hover/social:text-foreground"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </Section>
  );
}
