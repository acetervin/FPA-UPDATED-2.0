import express from 'express';
import { paypalService } from '../services/paypal';

const router = express.Router();

router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, description } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const order = await paypalService.createOrder(
            amount,
            currency,
            description
        );

        res.json(order);
    } catch (error) {
        console.error('Failed to create PayPal order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

router.post('/capture-order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const capturedOrder = await paypalService.captureOrder(orderId);
        res.json(capturedOrder);
    } catch (error) {
        console.error('Failed to capture PayPal order:', error);
        res.status(500).json({ error: 'Failed to capture order' });
    }
});

export default router;
