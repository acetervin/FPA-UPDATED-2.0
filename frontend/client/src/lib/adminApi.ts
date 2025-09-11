import { apiClient } from './api';
import type { DashboardStats } from '@/types';

export const adminApi = {
  getDashboardStats: () => 
    apiClient<DashboardStats>('/api/admin/dashboard/stats'),
    
  getPaymentGatewayStatus: () =>
    apiClient('/api/admin/payment-gateway-status'),
    
  getRecentTransactions: () =>
    apiClient('/api/admin/transactions/recent'),
    
  getRecentDonations: () =>
    apiClient('/api/admin/donations/recent'),
    
  getRecentEvents: () =>
    apiClient('/api/admin/events/recent')
};
