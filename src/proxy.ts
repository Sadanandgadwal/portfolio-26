import { NextResponse, type NextRequest } from "next/server";
import content from "@/data/portfolio.json";
import { isUnknownProjectPath } from "@/lib/content/projects";

const PROJECT_SLUGS = new Set(content.projects.items.map((p) => p.slug));

/**
 * Hard 404 for unknown case studies. With Cache Components the [slug] route streams a static shell,
 * so a late notFound() would otherwise return a "soft 404" (200). Rewriting to an unmatched path makes
 * Next serve its not-found page with a real 404 status.
 */
export function proxy(request: NextRequest) {
  if (isUnknownProjectPath(request.nextUrl.pathname, PROJECT_SLUGS)) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/projects/:slug*",
};
