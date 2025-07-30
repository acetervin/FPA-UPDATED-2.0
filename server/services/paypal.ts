import { paypalConfig } from '../config/paypal';

interface PayPalOrder {
    id: string;
    status: string;
    intent: 'CAPTURE';
    purchase_units: Array<{
        reference_id?: string;
        amount: {
            currency_code: string;
            value: string;
        };
        description?: string;
    }>;
    create_time: string;
    links: Array<{
        href: string;
        rel: string;
        method: string;
    }>;
}

interface PayPalError {
    name: string;
    message: string;
    debug_id: string;
    details?: Array<{
        field: string;
        value: string;
        issue: string;
    }>;
}

class PayPalService {
    private accessToken: string | null = null;
    private readonly apiBase: string;

    constructor() {
        this.apiBase = process.env.PAYPAL_MODE === 'sandbox' 
            ? paypalConfig.endpoints.sandbox 
            : paypalConfig.endpoints.production;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken) return this.accessToken;

        if (!process.env.PAYPAL_SANDBOX_CLIENT_ID || !process.env.PAYPAL_SANDBOX_SECRET) {
            throw new Error('PayPal credentials are not configured');
        }

        const auth = Buffer.from(
            `${process.env.PAYPAL_SANDBOX_CLIENT_ID}:${process.env.PAYPAL_SANDBOX_SECRET}`
        ).toString('base64');

        const response = await fetch(`${this.apiBase}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`PayPal authentication failed: ${error.error_description}`);
        }

        const data = await response.json();
        if (!data.access_token) {
            throw new Error('Failed to obtain PayPal access token');
        }
        this.accessToken = data.access_token;
        return data.access_token;
    }

    async createOrder(amount: number, currency = 'USD', description?: string): Promise<PayPalOrder> {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.apiBase}/v2/checkout/orders`, {
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
                    },
                    description
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json() as PayPalError;
            throw new Error(`Failed to create order: ${error.message}`);
        }

        return response.json();
    }

    async captureOrder(orderId: string): Promise<PayPalOrder> {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.apiBase}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json() as PayPalError;
            throw new Error(`Failed to capture order: ${error.message}`);
        }

        return response.json();
    }

    async verifyWebhookSignature(
        headers: Record<string, string>,
        body: string
    ): Promise<boolean> {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.apiBase}/v1/notifications/verify-webhook-signature`, {
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
            const error = await response.json() as PayPalError;
            throw new Error(`Failed to verify webhook signature: ${error.message}`);
        }

        const result = await response.json();
        return result.verification_status === 'SUCCESS';
    }

    async handleWebhookEvent(event: any): Promise<void> {
        // Handle different webhook event types
        switch (event.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                await this.handlePaymentCompleted(event);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
                await this.handlePaymentDenied(event);
                break;
            case 'PAYMENT.CAPTURE.PENDING':
                await this.handlePaymentPending(event);
                break;
            default:
                console.log(`Unhandled PayPal webhook event: ${event.event_type}`);
        }
    }

    private async handlePaymentCompleted(event: any): Promise<void> {
        const { id, status, amount } = event.resource;
        // TODO: Update payment status in database
        // TODO: Send confirmation email
        console.log(`Payment ${id} completed: ${amount.value} ${amount.currency_code}`);
    }

    private async handlePaymentDenied(event: any): Promise<void> {
        const { id } = event.resource;
        // TODO: Update payment status in database
        // TODO: Send failure notification
        console.log(`Payment ${id} denied`);
    }

    private async handlePaymentPending(event: any): Promise<void> {
        const { id, status } = event.resource;
        // TODO: Update payment status in database
        console.log(`Payment ${id} pending: ${status}`);
    }
}

// Export singleton instance
export const paypalService = new PayPalService();
