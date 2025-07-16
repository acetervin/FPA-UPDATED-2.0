import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';

// Dummy logo data - replace with your actual logos
const logoUrls = [
    
  "https://media.joomeo.com/large/68776bfeef2aa.jpg",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ28gMTwvdGV4dD48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ28gMjwvdGV4dD48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ28gMzwvdGV4dD48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ28gNDwvdGV4dD48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ28gNTwvdGV4dD48L3N2Zz4="
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
                <img 
                  key={`logo-1-${index}`} 
                  src={url} 
                  alt={`Partner ${index + 1}`} 
                  className="h-16 w-40 object-contain grayscale hover:grayscale-0 transition-all" 
                />
              ))}
              {/* Duplicate set for seamless loop */}
              {logoUrls.map((url, index) => (
                <img 
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
