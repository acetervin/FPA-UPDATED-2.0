import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { usePaymentGatewayStatus } from '../hooks/use-payment-gateway-status';
import { z } from 'zod';
import { apiClient } from '../lib/api';
import CurrencyAmount from './ui/CurrencyAmount';


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
  const { checkStatus, isMaintenance, isLoading: isStatusLoading } = usePaymentGatewayStatus('mpesa');

  // Fetch KES conversion when amount changes
  useEffect(() => {
    if (isStatusLoading) return; // Wait for status check

    // Using a fixed conversion rate instead of an API call.
    if (isMaintenance) {
      setKesAmount(null);
      return;
    }
    if (amount && Number(amount) > 0) {
      const fixedRate = 150; // Using a fixed rate of 1 USD = 150 KES
      setKesAmount(Math.round(Number(amount) * fixedRate));
    } else {
      setKesAmount(null);
    }
  }, [amount, isMaintenance, isStatusLoading]);

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
      if (!kesAmount) {
        toast({
          title: 'Error',
          description: 'Could not determine KES amount for donation.',
          variant: 'destructive',
        });
        return;
      }
      const data = await apiClient<{ CheckoutRequestID?: string; error?: string }>('/mpesa/initiate', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          amount: kesAmount,
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

  if (isStatusLoading) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Checking payment service status...</p>
      </div>
    );
  }

  if (isMaintenance) {
    return (
      <div className="p-4 text-center text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold">Service Temporarily Unavailable</h3>
        <p className="mt-2">
          Online donations are currently under maintenance. We apologize for any inconvenience. Please consider making a manual donation.
        </p>
      </div>
    );
  }

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
        disabled={isLoading || !kesAmount}
        aria-busy={isLoading}
      >
        {isLoading ? 'Processing...' : `Pay KES ${kesAmount || '0'} via M-Pesa`}
      </Button>

      {isLoading && checkoutId && (
        <div className="text-sm text-center text-gray-600" role="status" aria-live="polite">
          Waiting for M-Pesa confirmation...
        </div>
      )}
    </form>
  );
}
