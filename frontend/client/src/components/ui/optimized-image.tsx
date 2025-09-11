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
  // Simple img component without any loading states or transitions
  return (
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      {...props}
    />
  );
}
