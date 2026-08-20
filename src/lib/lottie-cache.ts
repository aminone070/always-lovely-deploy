/**
 * Shared, module-level Lottie cache.
 *
 * Two things are memoized for the whole session (so they survive route changes
 * and component unmounts):
 *  1. the dotLottie player bundle import
 *  2. the fetched animation bytes, keyed by src
 *
 * Everything is promise-cached, so N components asking for the same asset at
 * the same time produce exactly one network request.
 */

type PlayerModule = typeof import("@lottiefiles/dotlottie-react");

let playerPromise: Promise<PlayerModule> | null = null;

/** Self-hosted runtime: avoids a cross-origin DNS+TLS round trip to a CDN. */
const WASM_URL = "/wasm/dotlottie-player.wasm";

/**
 * The dotLottie runtime is a ~1.2 MB WebAssembly download for purely
 * decorative artwork. Skip it entirely when the user asked for less motion,
 * is on a metered/slow connection, or on a low-memory device — the static
 * fallback is shown instead.
 */
export function canLoadLottiePlayer(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  const type = nav.connection?.effectiveType;
  if (type && type !== "4g") return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory < 4)
    return false;
  return true;
}

export function loadLottiePlayer(): Promise<PlayerModule> {
  if (!playerPromise)
    playerPromise = import("@lottiefiles/dotlottie-react").then((mod) => {
      mod.setWasmUrl(WASM_URL);
      return mod;
    });
  return playerPromise;
}

const dataCache = new Map<string, Promise<ArrayBuffer>>();
const resolved = new Map<string, ArrayBuffer>();

export function getCachedLottie(src: string): ArrayBuffer | undefined {
  return resolved.get(src);
}

export function loadLottieData(src: string): Promise<ArrayBuffer> {
  let p = dataCache.get(src);
  if (!p) {
    p = fetch(src, { cache: "force-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load lottie: ${src}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        resolved.set(src, buf);
        return buf;
      })
      .catch((err) => {
        dataCache.delete(src);
        throw err;
      });
    dataCache.set(src, p);
  }
  return p;
}

/** Warm both the player bundle and the animation bytes ahead of first paint. */
export function prefetchLottie(src: string) {
  if (typeof window === "undefined") return;
  if (!canLoadLottiePlayer()) return;
  // Only the (small) animation bytes are warmed on intent. The heavy player
  // runtime is deferred until an animation is actually on screen.
  void loadLottieData(src).catch(() => {});
}
