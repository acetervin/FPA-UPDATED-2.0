import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthenticatedUser, useIsAdmin } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuthenticatedUser();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setLocation('/admin/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      setLocation('/admin/unauthorized');
      return;
    }
  }, [isAuthenticated, isAdmin, requireAdmin, setLocation, isLoading]);

  if (isLoading || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
