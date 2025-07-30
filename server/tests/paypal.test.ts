import { test } from 'node:test';
import assert from 'node:assert';
import { PayPalSandboxTester } from './paypal-sandbox';
import { paypalConfig } from '../config/paypal';

// Ensure we're in sandbox mode
process.env.PAYPAL_MODE = 'sandbox';

test('PayPal Integration Tests', async (t) => {
    await t.test('Authentication', async () => {
        try {
            const order = await PayPalSandboxTester.createTestOrder(100);
            assert(order, 'Order should be created');
            console.log('Authentication successful');
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    });


});
