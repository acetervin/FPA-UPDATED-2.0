export interface DashboardStats {
  stats: {
    totalDonations: number;
    donationCount: number;
    totalEvents: number;
    totalUsers: number;
  };
  gatewayStatus: Array<{
    gateway: string;
    status: 'live' | 'maintenance';
    updatedAt: string;
  }>;
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: string | number;
  type: 'donation' | 'registration';
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | string;
  customer: {
    name: string;
    email: string;
  };
  createdAt: string;
  message?: string;
  userId?: number;
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
