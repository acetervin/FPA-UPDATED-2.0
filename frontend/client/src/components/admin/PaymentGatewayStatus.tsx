import { useQuery } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PaymentGatewayStatus {
  gateway: string;
  status: 'live' | 'maintenance';
  updatedAt: string;
}

export function PaymentGatewayStatus() {
  const { toast } = useToast();

  const { data: gateways = [], isLoading: loadingGateways } = useQuery<PaymentGatewayStatus[]>({
    queryKey: ['admin', 'payment-gateway-status'],
    queryFn: async () => {
      const response = await fetch('/api/admin/payment-gateway-status');
      if (!response.ok) throw new Error('Failed to fetch gateway statuses');
      return response.json();
    },
  });

  const updateGatewayStatus = async (gateway: string, newStatus: 'live' | 'maintenance') => {
    try {
      const response = await fetch('/api/admin/payment-gateway-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateway,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update gateway status');
      
      toast({
        title: 'Success',
        description: `${gateway} payment gateway is now ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating gateway status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment gateway status',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Status</CardTitle>
        <CardDescription>Manage the status of your payment gateways</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingGateways ? (
          <div>Loading payment gateway settings...</div>
        ) : gateways.map((gateway) => (
          <div key={gateway.gateway} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium capitalize">{gateway.gateway}</div>
              <div className="text-sm text-muted-foreground">
                {gateway.status === 'live' ? 'Live - Accepting payments' : 'Maintenance - Payments disabled'}
              </div>
            </div>
            <Switch
              checked={gateway.status === 'live'}
              onCheckedChange={(checked) =>
                updateGatewayStatus(gateway.gateway, checked ? 'live' : 'maintenance')
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
