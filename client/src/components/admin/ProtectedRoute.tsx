import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthenticatedUser, useIsAdmin } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthenticatedUser();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/admin/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      setLocation('/admin/unauthorized');
      return;
    }
  }, [isAuthenticated, isAdmin, requireAdmin, setLocation]);

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
