import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { usePaymentGatewayStatus } from '@/hooks/use-payment-gateway-status';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import CurrencyAmount from '@/components/ui/CurrencyAmount';


interface MPesaPaymentProps {
  amount: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const phoneNumberSchema = z.string()
  .regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid phone number format');

export default function MPesaPayment({ amount, onSuccess, onError }: MPesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [kesAmount, setKesAmount] = useState<number | null>(null);
  const { toast } = useToast();
  const { checkStatus, isMaintenance } = usePaymentGatewayStatus('mpesa');

  // Fetch KES conversion when amount changes
  useEffect(() => {
    const fetchKesAmount = async () => {
      try {
        const data = await apiClient<{ amount: number }>('/currency/convert', {
          method: 'POST',
          body: JSON.stringify({
            amount: Number(amount),
            from: 'USD',
            to: 'KES',
          }),
        });
        setKesAmount(data.amount);
      } catch (error) {

        console.error('Failed to convert currency:', error);
        toast({
          variant: "destructive",
          title: "Currency Conversion Failed",
          description: "Unable to convert USD to KES. Please try again.",
        });
      }
    };

    fetchKesAmount();
  }, [amount, toast]);

  const formatPhoneNumber = (number: string) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Format as per Kenyan format
    if (cleaned.length <= 9) return cleaned;
    if (cleaned.startsWith('254')) return cleaned;
    if (cleaned.startsWith('0')) return `254${cleaned.slice(1)}`;
    return `254${cleaned}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const checkPaymentStatus = async (checkoutRequestId: string) => {
    try {
      const data = await apiClient<{ ResultCode?: string; message?: string }>(`/mpesa/status/${checkoutRequestId}`);

      if (data.ResultCode === '0') {

        toast({
          title: 'Payment Successful',
          description: 'Thank you for your donation!',
        });
        onSuccess?.();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking payment status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to check payment status';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(async () => {
      attempts++;
      const success = await checkPaymentStatus(checkoutRequestId);
      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        setIsLoading(false);
        if (!success && attempts >= maxAttempts) {
          toast({
            title: 'Payment Status Unknown',
            description: 'Please check your M-Pesa messages to confirm the payment status.',
            variant: 'destructive',
          });
        }
      }
    }, 5000); // Check every 5 seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!checkStatus()) {
        return;
      }
      // Validate phone number
      phoneNumberSchema.parse(phoneNumber);

      setIsLoading(true);
      const data = await apiClient<{ CheckoutRequestID?: string; error?: string }>('/mpesa/initiate', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          amount: parseFloat(amount),
          reference: 'Donation',
          description: 'Donation to Family Peace Association',
        }),
      });


      if (data.CheckoutRequestID) {
        setCheckoutId(data.CheckoutRequestID);
        toast({
          title: 'Check your phone',
          description: 'Please enter your M-Pesa PIN to complete the payment.',
        });
        pollPaymentStatus(data.CheckoutRequestID);
      } else {
        throw new Error(data.error || 'Failed to initiate payment');
      }

    } catch (error) {
      setIsLoading(false);
      const message = error instanceof z.ZodError 
        ? 'Please enter a valid Kenyan phone number' 
        : 'Failed to initiate payment';
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      onError?.(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label htmlFor="mpesa-phone" className="block text-sm font-medium text-gray-700">
          M-Pesa Phone Number
        </label>
        <Input
          id="mpesa-phone"
          name="phoneNumber"
          type="tel"
          placeholder="e.g., 0712345678"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="block w-full"
          disabled={isLoading}
          autoComplete="tel"
          inputMode="tel"
          required
          aria-describedby="phone-help"
        />
        <p id="phone-help" className="text-sm text-gray-500">
          Enter the phone number registered with M-Pesa
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Processing...' : `Pay ${amount} KES via M-Pesa`}
      </Button>

      {isLoading && checkoutId && (
        <div className="text-sm text-center text-gray-600" role="status" aria-live="polite">
          Waiting for M-Pesa confirmation...
        </div>
      )}
    </form>
  );
}
