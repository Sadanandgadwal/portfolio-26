import { Suspense } from "react";
import { Container } from "@/components/layout/section";
import type { Portfolio } from "@/lib/content";
import { BackToTop } from "./back-to-top";
import { CopyrightYear } from "./copyright-year";

type SiteFooterProps = Pick<Portfolio, "personal" | "footer">;

export function SiteFooter({ personal, footer }: SiteFooterProps) {
  return (
    <footer className="border-t">
      <Container className="flex flex-col-reverse justify-between gap-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>
          ©{" "}
          <Suspense fallback={null}>
            <CopyrightYear />
          </Suspense>{" "}
          {personal.name}
          {footer.note && ` · ${footer.note}`}
        </p>
        <BackToTop />
      </Container>
    </footer>
  );
}
