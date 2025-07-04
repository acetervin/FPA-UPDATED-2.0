import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  animation?: "fade-in" | "slide-up" | "slide-in-left" | "slide-in-right" | "scale-in";
  delay?: number;
  className?: string;
}

export default function ScrollAnimationWrapper({
  children,
  animation = "slide-up",
  delay = 0,
  className = "",
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isIntersecting = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      const timeout = setTimeout(() => {
        setHasAnimated(true);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [isIntersecting, hasAnimated, delay]);

  const animationClass = hasAnimated ? `animate-${animation}` : "opacity-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ${animationClass} ${className}`}
    >
      {children}
    </div>
  );
}
