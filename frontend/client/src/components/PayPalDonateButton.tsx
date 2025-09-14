/// <reference types="vite/client" />

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { usePaymentGatewayStatus } from "@/hooks/use-payment-gateway-status";

interface PayPalDonateButtonProps {
  amount: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function PayPalDonateButton({ 
  amount, 
  onSuccess, 
  onError
}: PayPalDonateButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const { checkStatus, isMaintenance } = usePaymentGatewayStatus('paypal');

  // Handle PayPal SDK ready state
  useEffect(() => {
    const checkPayPalSDK = () => {
      if (window.paypal) {
        setIsSdkReady(true);
      }
    };
    
    checkPayPalSDK();
    // If SDK isn't loaded yet, check again in a moment
    const timer = setInterval(checkPayPalSDK, 500);
    
    return () => clearInterval(timer);
  }, []);

  // Reset error when amount changes
  useEffect(() => {
    setError(null);
  }, [amount]);

  const createOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!checkStatus()) {
        setIsLoading(false);
        return;
      }
      console.log('Creating PayPal order for amount:', amount);
      
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Invalid donation amount");
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/paypal/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "USD",
        }),
      });

      const orderData = await response.json();
      console.log('PayPal create order response:', orderData);
      
      if (!response.ok) {
        throw new Error(orderData.error || orderData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error("No order ID received from PayPal");
      }
    } catch (err) {
      const error = err as Error;
      console.error('PayPal create order error:', error);
      const errorMessage = error.message || "Failed to create PayPal order";
      setError(errorMessage);
      onError?.(error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      console.log('PayPal onApprove called with:', data);
      
      if (!data.orderID) {
        throw new Error("No order ID provided by PayPal");
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/paypal/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      const orderData = await response.json();
      console.log('PayPal capture response:', orderData);
      
      if (!response.ok) {
        throw new Error(orderData.error || orderData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (orderData.status === "COMPLETED") {
        console.log('Payment completed successfully');
        onSuccess?.();
      } else {
        console.log('Payment status:', orderData.status, orderData);
        throw new Error(`Payment status: ${orderData.status}. Details: ${JSON.stringify(orderData)}`);
      }
    } catch (err) {
      const error = err as Error;
      console.error('PayPal capture error:', error);
      const errorMessage = error.message || "Failed to complete PayPal payment";
      setError(errorMessage);
      onError?.(error);
    }
  };

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
    <div className="w-full">
      <style>
        {`
          @keyframes loader-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .loader-dot {
            width: 8px;
            height: 8px;
            margin: 0 4px;
            border-radius: 50%;
            display: inline-block;
            background-color: #0070ba;
          }
          .loader-dot:nth-child(1) { animation: loader-bounce 0.6s 0.1s infinite; }
          .loader-dot:nth-child(2) { animation: loader-bounce 0.6s 0.2s infinite; }
          .loader-dot:nth-child(3) { animation: loader-bounce 0.6s 0.3s infinite; }
        `}
      </style>
      {error && (
        <div style={{ color: '#ff0000', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {(!isSdkReady || isLoading) && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
          </div>
          <div style={{ color: '#666666', fontSize: '14px' }}>
            {!isSdkReady ? 'Initializing PayPal...' : 'Processing...'}
          </div>
        </div>
      )}
      <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-200' : ''}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            setError("Something went wrong. Please try again.");
            onError?.(err);
            setIsLoading(false);
          }}
          disabled={!amount || isLoading}
        />
      </div>
    </div>
  );
}
