import { ReactNode } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalProviderProps {
    children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || import.meta.env.PAYPAL_CLIENT_ID;

    if (!clientId) {
        console.error('PayPal client ID is not configured');
        return null;
    }

    return (
        <PayPalScriptProvider options={{
            clientId: clientId,
            'client-id': clientId,
            currency: 'USD',
            vault: false,
            intent: 'capture'
        }}>
            {children}
        </PayPalScriptProvider>
    );
}
