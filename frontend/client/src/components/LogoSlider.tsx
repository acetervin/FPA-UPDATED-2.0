import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { OptimizedImage } from './ui/optimized-image';

// Dummy logo data - replace with your actual logos
const logoUrls = [
    
  "https://media.joomeo.com/large/68776bfeef2aa.jpg",
  "https://media.joomeo.com/large/68c40293bf1f8.jpg",
  "https://media.joomeo.com/large/68c402c813964.jpg",
  "https://media.joomeo.com/large/68c402ec0f9fe.jpg",
  "https://media.joomeo.com/large/68c40304929a1.jpg",
  "https://media.joomeo.com/large/68c4030c28380.jpg",
  "https://media.joomeo.com/large/68c4031b7f4b0.jpg",

];

const SCROLL_SPEED = 0.5; // Reduced speed for smoother animation

export default function LogoSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    let animationFrameId: number;
    let position = 0;

    const animate = () => {
      if (!sliderRef.current || !shouldAnimate || isPaused) {
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

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, shouldAnimate]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Our <span className="primary-text">Partners</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Working together with these amazing organizations to create positive change
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

          <div 
            className="flex items-center py-8 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              ref={sliderRef} 
              className="flex items-center gap-16 transition-transform duration-100 absolute left-0"
            >
              {/* First set of logos */}
              {logoUrls.map((url, index) => (
                <OptimizedImage 
                  key={`logo-1-${index}`} 
                  src={url} 
                  alt={`Partner ${index + 1}`} 
                  className="h-16 w-40 object-contain grayscale hover:grayscale-0 transition-all"
                />
              ))}
              {/* Duplicate set for seamless loop */}
              {logoUrls.map((url, index) => (
                <OptimizedImage 
                  key={`logo-2-${index}`} 
                  src={url} 
                  alt={`Partner ${index + 1}`} 
                  className="h-16 w-40 object-contain grayscale hover:grayscale-0 transition-all"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/contact">
            <Button className="primary-bg text-white hover:opacity-90 px-8 py-6 text-lg">
              Become Our Partner
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
