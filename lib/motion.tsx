"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Tick = (time: number, delta: number) => void;

type MotionApi = {
  subscribe: (tick: Tick) => () => void;
  paused: boolean;
  togglePaused: () => void;
  reduced: boolean;
};

const MotionContext = createContext<MotionApi | null>(null);
const PAUSED_KEY = "motion-paused";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * One clock for all JS-driven motion: the currentTime of a long Web Animation
 * on a hidden element, read in a single requestAnimationFrame loop. Pausing
 * the animation (or a recorder seeking it) freezes every card at once.
 * With reduced motion the loop never starts, so cards stay settled.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const clockRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const ticks = useRef(new Set<Tick>());
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    try {
      setPaused(localStorage.getItem(PAUSED_KEY) === "1");
    } catch {
      // Storage unavailable: start playing.
    }
  }, []);

  useEffect(() => {
    const el = clockRef.current;
    if (reduced || !el) return;
    const animation = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1e9 });
    animationRef.current = animation;
    let frame = 0;
    let last = 0;
    const loop = () => {
      const time = Number(animation.currentTime ?? 0);
      const delta = Math.min(Math.max(time - last, 0), 100); // clamp after tab switches
      last = time;
      ticks.current.forEach((tick) => tick(time, delta));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      animation.cancel();
      animationRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    const animation = animationRef.current;
    if (paused) animation?.pause();
    else animation?.play();
    document.documentElement.dataset.motion = paused ? "paused" : "running";
  }, [paused, reduced]);

  const togglePaused = useCallback(() => {
    setPaused((current) => {
      try {
        localStorage.setItem(PAUSED_KEY, current ? "0" : "1");
      } catch {
        // Ignore: the toggle still applies for this visit.
      }
      return !current;
    });
  }, []);

  const subscribe = useCallback((tick: Tick) => {
    ticks.current.add(tick);
    return () => void ticks.current.delete(tick);
  }, []);

  const api = useMemo(
    () => ({ subscribe, paused, togglePaused, reduced }),
    [subscribe, paused, togglePaused, reduced],
  );

  return (
    <MotionContext.Provider value={api}>
      <span ref={clockRef} aria-hidden="true" hidden />
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion(): MotionApi {
  const api = useContext(MotionContext);
  if (!api) throw new Error("useMotion must be used inside <MotionProvider>");
  return api;
}

/** Calls `tick(time, delta)` every frame while motion is running. */
export function useClock(tick: Tick) {
  const { subscribe } = useMotion();
  const latest = useRef(tick);
  useEffect(() => {
    latest.current = tick;
  });
  useEffect(() => subscribe((time, delta) => latest.current(time, delta)), [subscribe]);
}
