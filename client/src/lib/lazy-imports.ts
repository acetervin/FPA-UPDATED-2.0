import { lazy } from 'react';

// Payment Components
export const PayPalButtons = lazy(() => 
  import('@paypal/react-paypal-js').then(mod => ({ default: mod.PayPalButtons }))
);

export const PayPalScriptProvider = lazy(() => 
  import('@paypal/react-paypal-js').then(mod => ({ default: mod.PayPalScriptProvider }))
);

export const MPesaPayment = lazy(() => 
  import('@/components/MPesaPayment').then(mod => ({ default: mod.default }))
);

// Admin Components
export const AdminPayments = lazy(() => 
  import('@/pages/admin/payments').then(mod => ({ default: mod.default }))
);

export const PaymentGatewayStatus = lazy(async () => {
  const Component = await import('@/components/admin/PaymentGatewayStatus');
  return { default: Component.PaymentGatewayStatus };
});

export const PaymentGatewayConfig = lazy(async () => {
  const Component = await import('@/components/admin/PaymentGatewayConfig');
  return { default: Component.PaymentGatewayConfig };
});
