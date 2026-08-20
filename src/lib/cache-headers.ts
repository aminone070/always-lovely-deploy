/**
 * Centralised HTTP caching policy.
 *
 * The app is a static-ish portfolio rendered on the edge, so the whole caching
 * story is decided by response headers. Without them every asset falls back to
 * the browser's heuristic freshness (usually a revalidation round trip per
 * navigation) and shared caches/CDNs cannot store anything at all.
 *
 * Rules (most specific first):
 *  - `/assets/*`, `/_build/*`: content-hashed by Vite → immutable for a year.
 *  - static media (lottie/wasm/images/fonts/icons/cv): long TTL + SWR, since
 *    the filenames are stable but the files can be replaced on a deploy.
 *  - HTML documents: `no-cache` (store, but always revalidate) so a deploy is
 *    picked up immediately while still allowing 304s.
 *  - everything else (server functions, API-ish routes): left untouched.
 */

const YEAR = 31_536_000;
const DAY = 86_400;

const IMMUTABLE = `public, max-age=${YEAR}, immutable`;
const MEDIA = `public, max-age=${DAY}, stale-while-revalidate=${YEAR}`;
const DOCUMENT = "public, no-cache, must-revalidate";

const HASHED_PREFIXES = ["/assets/", "/_build/", "/_serverFn/assets/"];

const MEDIA_PREFIXES = ["/lottie/", "/wasm/", "/images/", "/projects/", "/fonts/", "/cv/"];

const MEDIA_FILES = new Set([
  "/favicon.ico",
  "/favicon.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/robots.txt",
  "/manifest.json",
  "/site.webmanifest",
]);

/** Requests that must never be cached by a shared cache. */
function isPrivatePath(pathname: string): boolean {
  return pathname.startsWith("/_serverFn/") && !pathname.startsWith("/_serverFn/assets/");
}

export function cacheControlFor(pathname: string, contentType: string | null): string | null {
  if (isPrivatePath(pathname)) return "private, no-store";

  if (HASHED_PREFIXES.some((p) => pathname.startsWith(p))) return IMMUTABLE;
  if (MEDIA_PREFIXES.some((p) => pathname.startsWith(p))) return MEDIA;
  if (MEDIA_FILES.has(pathname)) return MEDIA;

  if (contentType?.includes("text/html")) return DOCUMENT;

  return null;
}

/**
 * Apply the policy without ever overriding a handler that already made an
 * explicit decision (e.g. `sitemap.xml`).
 */
export function withCacheHeaders(request: Request, response: Response): Response {
  if (request.method !== "GET" && request.method !== "HEAD") return response;
  // Only successful / not-modified responses are safe to hand a long TTL.
  if (response.status >= 400) return response;

  let pathname: string;
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    return response;
  }

  const value = cacheControlFor(pathname, response.headers.get("content-type"));
  if (!value) return response;

  // A route handler that made its own explicit decision wins (e.g. sitemap).
  // The static-asset layer only ever emits the framework default `no-cache`,
  // which would force a revalidation round trip per asset per navigation, so
  // that one is intentionally upgraded for known-static paths.
  const existing = response.headers.get("cache-control");
  if (existing && !(value !== DOCUMENT && existing === "no-cache")) return response;

  // Response headers are immutable for some runtime-produced responses.
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", value);
  if (value === IMMUTABLE || value === MEDIA) headers.set("Vary", "Accept-Encoding");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
