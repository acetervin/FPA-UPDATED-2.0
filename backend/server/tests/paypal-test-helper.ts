import { paypalConfig } from '../config/paypal';

interface PayPalOrder {
    intent: 'CAPTURE';
    purchase_units: Array<{
        amount: {
            currency_code: string;
            value: string;
        };
    }>;
    id?: string;
    status?: string;
}

interface PayPalAccessToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export class PayPalTestHelper {
    private static readonly SANDBOX_URL = paypalConfig.endpoints.sandbox;
    private static accessToken: string | null = null;
    private static async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static async getAccessToken(): Promise<string> {
        if (this.accessToken) return this.accessToken;

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

    /**
     * Creates a test order for sandbox testing using actual PayPal API
     */
    static createTestOrder = async (amount: number, currency = 'USD'): Promise<PayPalOrder> => {
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
    };

    /**
     * Creates a test subscription for sandbox testing
     */
    /**
     * Creates a test subscription using actual PayPal API
     */
    static createTestSubscription = async (planId: string) => {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.SANDBOX_URL}/v1/billing/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_id: planId,
                subscriber: {
                    name: {
                        given_name: 'John',
                        surname: 'Doe'
                    },
                    email_address: 'johndoe@personal.example.com'
                },
                application_context: {
                    brand_name: 'Compassion Clone',
                    locale: 'en-US',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'SUBSCRIBE_NOW',
                    payment_method: {
                        payer_selected: 'PAYPAL',
                        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create subscription: ${response.statusText}`);
        }

        return response.json();
    };

    /**
     * Simulates webhook events using PayPal's webhook simulator
     */
    static simulateWebhookEvent = async (eventType: string, resourceId: string) => {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.SANDBOX_URL}/v1/notifications/simulate-event`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                webhook_id: process.env.PAYPAL_SANDBOX_WEBHOOK_ID,
                event_type: eventType,
                resource_id: resourceId,
                create_time: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to simulate webhook event: ${response.statusText}`);
        }

        return response.json();
    };

    /**
     * Helper to validate webhook signatures using PayPal's verification API
     */
    static validateTestWebhook = async (headers: Record<string, string>, body: string) => {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.SANDBOX_URL}/v1/notifications/verify-webhook-signature`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                auth_algo: headers['paypal-auth-algo'],
                cert_url: headers['paypal-cert-url'],
                transmission_id: headers['paypal-transmission-id'],
                transmission_sig: headers['paypal-transmission-sig'],
                transmission_time: headers['paypal-transmission-time'],
                webhook_id: process.env.PAYPAL_SANDBOX_WEBHOOK_ID,
                webhook_event: JSON.parse(body)
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to verify webhook signature: ${response.statusText}`);
        }

        const result = await response.json();
        return result.verification_status === 'SUCCESS';
    };
}
