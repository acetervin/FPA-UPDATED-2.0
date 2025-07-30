import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
      const response = await fetch('/api/admin/payment-gateway-status');
      if (!response.ok) {
        throw new Error('Failed to fetch gateway status');
      }
      const statuses: PaymentGatewayStatus[] = await response.json();
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
