import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/Sidebar";
import StatsCards from "@/components/admin/StatsCards";
import TransactionTable from "@/components/admin/TransactionTable";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, useAuthenticatedUser } from "@/lib/auth";
import type { DashboardStats, Transaction } from "@/types";
import { useEffect, Suspense } from "react";
import { useLocation } from "wouter";

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-neutral-50">
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);


const fetchDashboardData = async (token: string): Promise<DashboardStats> => {
  const response = await fetch('/api/admin/dashboard', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.text();
    throw new Error(error || 'Failed to fetch dashboard data');
  }
  
  return response.json();
};

const AdminDashboard: React.FC = () => {
  const token = useAuth((state) => state.token);
  const { isAuthenticated, isLoading: authLoading } = useAuthenticatedUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const {
    data: dashboardData,
    isLoading,
    error
  } = useQuery<DashboardStats, Error>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => {
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }
      return fetchDashboardData(token);
    },
    enabled: !!token,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    gcTime: 1800000 // Cache for 30 minutes
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch dashboard data",
        variant: "destructive"
      });
      if (error instanceof Error && error.message.includes('Session expired')) {
        setLocation('/admin/login');
      }
    }
  }, [error, toast, setLocation]);

  useEffect(() => {
    if (dashboardData) {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
    }
  }, [dashboardData, queryClient]);

  const { data: transactions } = useQuery<Transaction[], Error>({
    queryKey: ['admin', 'transactions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch transactions');
      }
      return response.json();
    },
    enabled: !!token
  });

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Dashboard</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'An error occurred while loading the dashboard'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-neutral-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Payment Dashboard</h2>
                <p className="text-neutral-600">Manage donations and event registrations</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-neutral-600">Real-time Updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-neutral-800">Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {dashboardData ? (
              <>
                <StatsCards stats={dashboardData.stats} />
                {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                  <TransactionTable transactions={dashboardData.recentTransactions} />
                ) : (
                  <div className="text-center text-neutral-500 mt-8">No transactions found.</div>
                )}
              </>
            ) : (
              <div className="text-center text-neutral-500">No dashboard data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
