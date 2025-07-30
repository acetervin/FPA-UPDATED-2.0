import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  loadingClassName,
  ...props 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Convert image URL to use Cloudinary or similar service
  const optimizedSrc = src.startsWith('data:') ? src : `${src}?quality=auto&format=webp`;
  
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={cn(
        className,
        !loaded && loadingClassName,
        "transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0"
      )}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
}
