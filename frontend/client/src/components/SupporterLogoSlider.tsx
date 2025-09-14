import { useEffect, useRef, useState } from 'react';
import { OptimizedImage } from './ui/optimized-image';
import { EventSupporter } from '../types/eventSupporter';


const SCROLL_SPEED = 0.5;

interface SupporterLogoSliderProps {
  supporters: EventSupporter[];
}

export default function SupporterLogoSlider({ supporters }: SupporterLogoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let position = 0;

    const animate = () => {
      if (!sliderRef.current || isPaused) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      position += SCROLL_SPEED;
      const sliderWidth = sliderRef.current.scrollWidth / 2;
      
      if (position >= sliderWidth) {
        position = 0;
      }

      sliderRef.current.style.transform = `translateX(-${position}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  if (!supporters || supporters.length === 0) {
    return null;
  }
  
  const duplicatedSupporters = [...supporters, ...supporters];

  return (
    <div className="relative overflow-hidden py-8">
      <div 
        className="flex items-center relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={sliderRef} 
          className="flex items-center gap-16 absolute left-0"
        >
          {duplicatedSupporters.map((supporter, index) => (
            <a 
              key={`supporter-${index}`}
              href={supporter.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <OptimizedImage 
                src={supporter.logoUrl} 
                alt={supporter.name} 
                className="h-16 w-40 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
