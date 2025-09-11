interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-neutral-600 animate-pulse">{message}</p>
    </div>
  );
}

interface SectionLoadingProps {
  message?: string;
  className?: string;
}

export function SectionLoading({ message, className = '' }: SectionLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="md" className="mb-2" />
      {message && <p className="text-sm text-neutral-600 animate-pulse">{message}</p>}
    </div>
  );
}
