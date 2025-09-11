import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const paypalConfigSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  mode: z.enum(['sandbox', 'live']),
  merchantId: z.string().optional(),
});

const mpesaConfigSchema = z.object({
  consumerKey: z.string().min(1, 'Consumer Key is required'),
  consumerSecret: z.string().min(1, 'Consumer Secret is required'),
  shortCode: z.string().min(1, 'Short Code is required'),
  passKey: z.string().min(1, 'Pass Key is required'),
  callbackUrl: z.string().url('Must be a valid URL'),
});

interface GatewayConfig {
  gateway: string;
  config: Record<string, any>;
  updatedAt: string;
}

type PayPalConfig = z.infer<typeof paypalConfigSchema>;
type MPesaConfig = z.infer<typeof mpesaConfigSchema>;

export function PaymentGatewayConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGateway, setSelectedGateway] = useState<'paypal' | 'mpesa'>('paypal');

  const { data: configs, isLoading } = useQuery<GatewayConfig[]>({
    queryKey: ['admin', 'payment-gateway-configs'],
    queryFn: async () => {
      const response = await fetch('/api/admin/payment-gateway-config');
      if (!response.ok) throw new Error('Failed to fetch configs');
      return response.json();
    },
  });

  const updateConfig = useMutation({
    mutationFn: async ({ gateway, config }: { gateway: string; config: PayPalConfig | MPesaConfig }) => {
      const response = await fetch(`/api/admin/payment-gateway-config/${gateway}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to update config');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payment-gateway-configs'] });
      toast({
        title: 'Settings Updated',
        description: 'Payment gateway configuration has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update configuration',
        variant: 'destructive',
      });
    },
  });

  const paypalForm = useForm<PayPalConfig>({
    resolver: zodResolver(paypalConfigSchema),
    defaultValues: configs?.find((c: GatewayConfig) => c.gateway === 'paypal')?.config || {},
  });

  const mpesaForm = useForm<MPesaConfig>({
    resolver: zodResolver(mpesaConfigSchema),
    defaultValues: configs?.find((c: GatewayConfig) => c.gateway === 'mpesa')?.config || {},
  });

  const onSubmit = async (data: PayPalConfig | MPesaConfig) => {
    updateConfig.mutate({ gateway: selectedGateway, config: data });
  };

  if (isLoading) {
    return <div>Loading payment gateway configurations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Configuration</CardTitle>
        <CardDescription>
          Configure your payment gateway credentials and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Select
            value={selectedGateway}
            onValueChange={(value: 'paypal' | 'mpesa') => setSelectedGateway(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a payment gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="mpesa">M-Pesa</SelectItem>
            </SelectContent>
          </Select>

          {selectedGateway === 'paypal' ? (
            <Form {...paypalForm}>
              <form onSubmit={paypalForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={paypalForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="PayPal Client ID" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paypalForm.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="PayPal Client Secret" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paypalForm.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                          <SelectItem value="live">Live (Production)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paypalForm.control}
                  name="merchantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant ID (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="PayPal Merchant ID" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updateConfig.isPending}>
                  {updateConfig.isPending ? 'Saving...' : 'Save PayPal Configuration'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...mpesaForm}>
              <form onSubmit={mpesaForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={mpesaForm.control}
                  name="consumerKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumer Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="M-Pesa Consumer Key" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mpesaForm.control}
                  name="consumerSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumer Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="M-Pesa Consumer Secret" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mpesaForm.control}
                  name="shortCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="M-Pesa Short Code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mpesaForm.control}
                  name="passKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="M-Pesa Pass Key" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mpesaForm.control}
                  name="callbackUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Callback URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://your-domain.com/api/mpesa/callback" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updateConfig.isPending}>
                  {updateConfig.isPending ? 'Saving...' : 'Save M-Pesa Configuration'}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
