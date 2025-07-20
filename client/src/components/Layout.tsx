import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './Toaster';
import { ErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  hideFooter?: boolean;
}

export function Layout({ 
  children, 
  title = 'Family Peace Association', 
  description = 'Empowering families to build a peaceful world',
  hideFooter = false
}: LayoutProps) {
  const [location] = useLocation();
  const isAdminPage = location.startsWith('/admin');

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      {!isAdminPage && <Header />}

      <main className="min-h-screen bg-background">
        {children}
      </main>

      {!isAdminPage && !hideFooter && <Footer />}
      <Toaster />
    </ErrorBoundary>
  );
}
