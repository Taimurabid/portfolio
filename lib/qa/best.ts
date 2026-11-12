/**
 * The player's best QA Mode time, kept in their own browser only.
 * Storage can be missing or blocked (private mode), so every access is guarded
 * and the game simply doesn't remember scores there.
 */
const BEST_KEY = "qa-best-ms";

type Store = Pick<Storage, "getItem" | "setItem">;

function store(): Store | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Best time in ms, or null if there isn't one yet. */
export function readBest(storage: Store | null = store()): number | null {
  try {
    const value = Number(storage?.getItem(BEST_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

/** Saves `ms` if it beats the stored best. Returns true when it's a new best. */
export function saveIfBest(ms: number, storage: Store | null = store()): boolean {
  const previous = readBest(storage);
  const isBest = previous === null || ms < previous;
  if (isBest) {
    try {
      storage?.setItem(BEST_KEY, String(Math.round(ms)));
    } catch {
      // Quota or blocked storage: still report the best for this round.
    }
  }
  return isBest;
}
