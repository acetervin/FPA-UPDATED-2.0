import express from 'express';
import { paypalService } from '../services/paypal';

const router = express.Router();

router.post('/webhook', async (req, res) => {
    try {
        // Verify the webhook signature
        const signature = await paypalService.verifyWebhookSignature(
            req.headers as Record<string, string>,
            JSON.stringify(req.body)
        );

        if (!signature) {
            console.error('Invalid PayPal webhook signature');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Handle the webhook event
        await paypalService.handleWebhookEvent(req.body);
        
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('PayPal webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
