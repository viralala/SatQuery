"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useInView";

/**
 * Steps an index from -1 through `count - 1` once `active` becomes true.
 * Under reduced motion it jumps straight to the finished state so the
 * completed sequence is still readable.
 */
export function useSequence(count: number, active: boolean, interval = 620) {
  const [step, setStep] = useState(-1);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setStep(count - 1);
      return;
    }
    let i = -1;
    const tick = () => {
      i += 1;
      setStep(i);
      if (i < count - 1) timer.current = setTimeout(tick, interval);
    };
    timer.current = setTimeout(tick, 260);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, count, interval, reduced]);

  const reset = () => setStep(-1);
  return { step, done: step >= count - 1, reset, setStep };
}
