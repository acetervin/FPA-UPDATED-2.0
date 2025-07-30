import { db } from './db';
import { paymentGatewayConfig, paymentGatewayStatus } from '../shared/schema';

export async function seedPaymentGateways() {
  try {
    console.log('Seeding payment gateways...');

    // PayPal gateway
    await db.insert(paymentGatewayStatus).values({
      gateway: 'paypal',
      status: 'live',
    }).onConflictDoUpdate({
      target: paymentGatewayStatus.gateway,
      set: { status: 'live' }
    });
    console.log('PayPal gateway status seeded');

    const paypalConfig = {
      mode: process.env.PAYPAL_MODE || 'sandbox',
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    };
    await db.insert(paymentGatewayConfig).values({
      gateway: 'paypal',
      config: JSON.stringify(paypalConfig),
    }).onConflictDoUpdate({
      target: paymentGatewayConfig.gateway,
      set: { config: JSON.stringify(paypalConfig) }
    });
    console.log('PayPal gateway config seeded');

    // M-PESA gateway
    await db.insert(paymentGatewayStatus).values({
      gateway: 'mpesa',
      status: 'live',
    }).onConflictDoUpdate({
      target: paymentGatewayStatus.gateway,
      set: { status: 'live' }
    });
    console.log('M-PESA gateway status seeded');

    const mpesaConfig = {
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      passkey: process.env.MPESA_PASSKEY || '',
      environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    };
    await db.insert(paymentGatewayConfig).values({
      gateway: 'mpesa',
      config: JSON.stringify(mpesaConfig),
    }).onConflictDoUpdate({
      target: paymentGatewayConfig.gateway,
      set: { config: JSON.stringify(mpesaConfig) }
    });
    console.log('M-PESA gateway config seeded');

    console.log('Payment gateways seeded successfully!');
  } catch (error) {
    console.error('Error seeding payment gateways:', error);
    throw error;
  }
}

seedPaymentGateways().catch(console.error);