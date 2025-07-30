import { paypalConfig } from '../config/paypal';

interface PayPalOrder {
    intent: 'CAPTURE';
    purchase_units: Array<{
        amount: {
            currency_code: string;
            value: string;
        };
    }>;
}

interface PayPalAccessToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export class PayPalSandboxTester {
    private static readonly SANDBOX_URL = paypalConfig.endpoints.sandbox;
    private static accessToken: string | null = null;

    private static async getAccessToken(): Promise<string> {
        if (this.accessToken) return this.accessToken;

        console.log('Environment variables:');
        console.log('PAYPAL_MODE:', process.env.PAYPAL_MODE);
        console.log('PAYPAL_SANDBOX_CLIENT_ID:', process.env.PAYPAL_SANDBOX_CLIENT_ID);
        console.log('PAYPAL_SANDBOX_SECRET:', process.env.PAYPAL_SANDBOX_SECRET?.substring(0, 5) + '...');

        const auth = Buffer.from(
            `${process.env.PAYPAL_SANDBOX_CLIENT_ID}:${process.env.PAYPAL_SANDBOX_SECRET}`
        ).toString('base64');

        const response = await fetch(`${this.SANDBOX_URL}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.statusText}`);
        }

        const data = await response.json() as PayPalAccessToken;
        this.accessToken = data.access_token;
        return this.accessToken;
    }

    static async createTestOrder(amount: number, currency = 'USD'): Promise<PayPalOrder> {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.SANDBOX_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: amount.toString(),
                    }
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        return response.json();
    }
}
