export interface DashboardStats {
  totalDonations: number;
  donationCount: number;
  pendingPayments: number;
  successRate: string;
  recentTransactions: Transaction[];
  paymentMethods: Record<string, number>;
  monthlyStats: {
    totalTransactions: number;
    completedTransactions: number;
    failedTransactions: number;
  };
}

export interface Transaction {
  id: number;
  type: 'donation' | 'registration';
  amount: number;
  paymentMethod: string;
  status: string;
  customer: {
    name: string;
    email: string;
  };
  createdAt: string;
}
