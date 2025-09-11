import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface PaymentGatewayStatus {
  gateway: string;
  status: 'live' | 'maintenance';
  updatedAt: string;
}

export function PaymentGatewayManagement() {
  const [gateways, setGateways] = useState<PaymentGatewayStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGatewayStatuses();
  }, []);

  const fetchGatewayStatuses = async () => {
    try {
      const response = await fetch('/api/admin/payment-gateway-status');
      if (!response.ok) throw new Error('Failed to fetch gateway statuses');
      const data = await response.json();
      setGateways(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gateway statuses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment gateway statuses',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

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
      
      const updatedGateway = await response.json();
      setGateways(prevGateways =>
        prevGateways.map(g =>
          g.gateway === gateway ? { ...g, ...updatedGateway } : g
        )
      );

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Payment Gateway Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {gateways.map((gateway) => (
          <Card key={gateway.gateway}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{gateway.gateway}</span>
                <Switch
                  checked={gateway.status === 'live'}
                  onCheckedChange={(checked) =>
                    updateGatewayStatus(gateway.gateway, checked ? 'live' : 'maintenance')
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className={gateway.status === 'live' ? 'text-green-600' : 'text-yellow-600'}>
                    {gateway.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Updated:</span>
                  <span className="text-muted-foreground">
                    {new Date(gateway.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
