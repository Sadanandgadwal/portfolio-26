import { Suspense } from "react";
import { Container } from "@/components/layout/section";
import { resolveSocials, type Portfolio } from "@/lib/content";
import { BackToTop } from "./back-to-top";
import { CopyrightYear } from "./copyright-year";
import { Signature } from "./signature";

type SiteFooterProps = Pick<Portfolio, "personal" | "footer" | "socials">;

export function SiteFooter({ personal, footer, socials }: SiteFooterProps) {
  const links = resolveSocials(socials, personal.email);

  return (
    <footer className="border-t">
      <Container className="grid gap-12 py-16 md:py-20">
        <Signature name={personal.name} />

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-medium">{personal.name}</p>
            {footer.tagline && (
              <p className="mt-1 text-sm text-muted-foreground">{footer.tagline}</p>
            )}
          </div>
          {links.length > 0 && (
            <nav aria-label="Footer social links">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {links.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      {...(s.url.startsWith("mailto:")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="flex flex-col-reverse justify-between gap-6 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            ©{" "}
            <Suspense fallback={null}>
              <CopyrightYear />
            </Suspense>{" "}
            {personal.name}
            {footer.note && ` · ${footer.note}`}
          </p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
