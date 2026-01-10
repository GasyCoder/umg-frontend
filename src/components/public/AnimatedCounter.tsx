"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
  label: string;
};

export default function AnimatedCounter({
  value,
  suffix = "",
  durationMs = 1200,
  label,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const currentValue = Math.floor(progress * value);
            setDisplayValue(currentValue);
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [durationMs, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
        {displayValue}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
