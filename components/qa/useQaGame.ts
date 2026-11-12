"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bugs, cssValue, isFixed, type Bug, type BugValue } from "@/lib/qa/bugs";

const targetOf = (bug: Bug) => document.querySelector<HTMLElement>(`[data-qa="${bug.target}"]`);

/** Does flagging `el` count as finding `bug`? */
function hits(bug: Bug, el: Element): boolean {
  const target = targetOf(bug);
  if (!target) return false;
  return bug.exact ? el === target : el === target || target.contains(el);
}

/**
 * Game state for QA Mode. Plants every bug as an inline style on mount and
 * restores the page exactly on unmount, so the real site is never left broken.
 */
export function useQaGame() {
  const [values, setValues] = useState<Record<string, BugValue>>(() =>
    Object.fromEntries(bugs.map((bug) => [bug.id, bug.wrong])),
  );
  const [found, setFound] = useState<string[]>([]);
  const [fixed, setFixed] = useState<string[]>([]);
  const [fixing, setFixing] = useState<Bug | null>(null);
  const [misses, setMisses] = useState(0);
  const [hints, setHints] = useState(0);
  const startedAt = useRef(0);
  const [finishedIn, setFinishedIn] = useState<number | null>(null);

  useEffect(() => {
    startedAt.current = performance.now();
    const originals = bugs.map((bug) => {
      const el = targetOf(bug);
      const before = el?.style.getPropertyValue(bug.property) ?? "";
      el?.style.setProperty(bug.property, cssValue(bug, bug.wrong));
      return { el, property: bug.property, before };
    });
    return () => {
      for (const { el, property, before } of originals) {
        if (before) el?.style.setProperty(property, before);
        else el?.style.removeProperty(property);
      }
    };
  }, []);

  useEffect(() => {
    if (fixed.length === bugs.length && finishedIn === null) {
      setFinishedIn(performance.now() - startedAt.current);
    }
  }, [fixed, finishedIn]);

  const setValue = useCallback((bug: Bug, value: BugValue) => {
    targetOf(bug)?.style.setProperty(bug.property, cssValue(bug, value));
    setValues((current) => ({ ...current, [bug.id]: value }));
    if (isFixed(bug, value))
      setFixed((current) => (current.includes(bug.id) ? current : [...current, bug.id]));
  }, []);

  /** Flags an element. Returns the bug it uncovered, or null for a false alarm. */
  const flag = useCallback(
    (el: Element): Bug | null => {
      const bug = bugs.find((b) => !found.includes(b.id) && hits(b, el)) ?? null;
      if (bug) {
        setFound((current) => [...current, bug.id]);
        setFixing(bug);
      } else {
        setMisses((n) => n + 1);
      }
      return bug;
    },
    [found],
  );

  /** Points at the first bug not found yet. */
  const hint = useCallback((): HTMLElement | null => {
    const bug = bugs.find((b) => !found.includes(b.id));
    if (!bug) return null;
    setHints((n) => n + 1);
    return targetOf(bug);
  }, [found]);

  return {
    values,
    found,
    fixed,
    fixing,
    closeFix: () => setFixing(null),
    misses,
    hints,
    startedAt,
    finishedIn,
    setValue,
    flag,
    hint,
  };
}
