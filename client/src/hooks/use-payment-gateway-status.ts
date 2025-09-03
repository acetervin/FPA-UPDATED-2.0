import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';


interface PaymentGatewayStatus {
  gateway: string;
  status: 'live' | 'maintenance';
  updatedAt: string;
}

export function usePaymentGatewayStatus(gateway: 'paypal' | 'mpesa') {
  const { toast } = useToast();

  const { data: status, isLoading, error } = useQuery<PaymentGatewayStatus>({
    queryKey: ['payment-gateway-status', gateway],
    queryFn: async () => {
      const statuses: PaymentGatewayStatus[] = await apiClient('/admin/payment-gateway-status');
      return statuses.find(s => s.gateway === gateway) || {
        gateway,
        status: 'maintenance',
        updatedAt: new Date().toISOString()
      };
    },

  });

  const isLive = status?.status === 'live';
  const isMaintenance = status?.status === 'maintenance';

  const checkStatus = () => {
    if (isMaintenance) {
      toast({
        title: "Payment Gateway Unavailable",
        description: `${gateway.toUpperCase()} payments are currently under maintenance. Please try again later or use a different payment method.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    isLive,
    isMaintenance,
    isLoading,
    error,
    checkStatus,
  };
}
