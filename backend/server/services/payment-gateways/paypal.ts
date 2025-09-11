import { loadScript } from '@paypal/paypal-js';
import { PaymentGateway } from './types';

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
}

interface CreateOrderParams {
  amount: string;
  currency?: string;
}

export class PayPalService implements PaymentGateway {
  private static instance: PayPalService;
  private accessToken = '';
  private accessTokenExpiry: Date | null = null;
  private config: PayPalConfig;

  private async ensureAccessToken() {
    if (this.accessToken && this.accessTokenExpiry && this.accessTokenExpiry > new Date()) {
      return;
    }

    const response = await fetch(`${this.config.apiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(
          `${this.config.clientId}:${this.config.clientSecret}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.accessTokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
  }

  private constructor() {
    const requiredEnvVars = {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      apiUrl: process.env.PAYPAL_API_URL,
    };

    // Log environment variables for debugging (do not log secrets in production!)
    console.log('[PayPalService] PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID);
    console.log('[PayPalService] PAYPAL_CLIENT_SECRET:', process.env.PAYPAL_CLIENT_SECRET ? '***SET***' : '***MISSING***');
    console.log('[PayPalService] PAYPAL_API_URL:', process.env.PAYPAL_API_URL);

    // Validate all required environment variables
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (!value) {
        console.error(`[PayPalService] Missing required environment variable: ${key}`);
        throw new Error(`Missing required environment variable: ${key}`);
      }
    });

    this.config = {
      clientId: process.env.PAYPAL_CLIENT_ID!,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
      apiUrl: process.env.PAYPAL_API_URL!,
    };
  }

  async createOrder({ amount, currency = 'USD' }: CreateOrderParams) {
    try {
      await this.ensureAccessToken();
      const response = await fetch(`${this.config.apiUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: currency,
              value: amount
            }
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PayPalService] PayPal create order error:', errorData);
        throw new Error(`PayPal API error: ${JSON.stringify(errorData)}`);
      }

      return response.json();
    } catch (err) {
      console.error('[PayPalService] createOrder exception:', err);
      throw err;
    }
  }

  public static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService();
    }
    return PayPalService.instance;
  }

  async verifyPayment(paymentId: string): Promise<{
    status: 'success' | 'failed';
    transactionId: string;
  }> {
    await this.ensureAccessToken();
    const token = this.accessToken;
    const response = await fetch(
      `${this.config.apiUrl}/v2/payments/captures/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal API Error: ${data.message}`);
    }

    return {
      status: data.status === 'COMPLETED' ? 'success' : 'failed',
      transactionId: data.id,
    };
  }

  /**
   * Capture a PayPal order after approval
   * @param orderId The PayPal order ID to capture
   */
  public async captureOrder(orderId: string): Promise<any> {
    await this.ensureAccessToken();
    const token = this.accessToken;
    const response = await fetch(
      `${this.config.apiUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal API Error: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }

  async handleWebhook(event: any): Promise<void> {
    // Simplified webhook handling - removed subscription events
    console.log('PayPal webhook received:', event.event_type);
  }
}
