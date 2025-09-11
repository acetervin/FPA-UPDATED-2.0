import { useEffect, useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function Counter({ target, duration = 2000, suffix = "", className = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  useEffect(() => {
    if (isIntersecting && !hasStarted) {
      setHasStarted(true);
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(target * easeOutExpo);
        
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(updateCounter);
    }
  }, [isIntersecting, hasStarted, target, duration]);

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  );
}
