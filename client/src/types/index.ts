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
  id: string;
  type: 'donation' | 'registration';
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  customer: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface PaymentInitiationResponse {
  transactionId: string;
  redirectUrl: string;
  merchantReference: string;
}

export interface DonationData {
  donationType: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  isAnonymous?: boolean;
  message?: string;
}

export interface EventRegistrationData {
  registrationType: "individual" | "organization";
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  organizationName?: string;
}
