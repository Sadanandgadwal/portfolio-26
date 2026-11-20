import { cacheLife } from "next/cache";

/**
 * Current year without breaking static prerendering (Cache Components): cached, refreshed daily
 * where revalidation is supported, and on every build.
 */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
