export interface PaymentGateway {
  verifyPayment(paymentId: string): Promise<{
    status: 'success' | 'failed';
    transactionId: string;
  }>;

  handleWebhook(event: any): Promise<void>;
}

export interface PaymentMethod {
  id: string;
  type: 'paypal' | 'card' | 'mpesa' | 'pesapal' | 'bank_transfer';
  details: {
    [key: string]: any;
  };
}
