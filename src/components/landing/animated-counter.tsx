"use client";

import React from "react";

/**
 * Animated counter that counts up from 0 to a target value
 * when it becomes visible in the viewport.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (prefersReduced) {
            setCount(value);
            return;
          }

          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
