import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/Sidebar";
import StatsCards from "@/components/admin/StatsCards";
import TransactionTable from "@/components/admin/TransactionTable";
import { DashboardStats } from "@/types";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json();
    },
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
            {dashboardData && <StatsCards stats={dashboardData} />}
            {transactions && <TransactionTable transactions={transactions} />}
          </div>
        </div>
      </div>
    </div>
  );
}
