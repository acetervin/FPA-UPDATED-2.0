import { Router } from 'express';
import { PayPalService } from '../services/payment-gateways/paypal';

const router = Router();

// Create a new order for one-time payment
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;
    
    console.log('PayPal create-order request:', { amount, currency });
    
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ 
        error: 'Invalid amount provided',
        details: 'Amount must be a valid number greater than 0'
      });
    }

    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        details: 'Amount must be greater than 0'
      });
    }

    const formattedAmount = numericAmount.toFixed(2);
    console.log('Creating PayPal order for amount:', formattedAmount);

    const order = await PayPalService.getInstance().createOrder({
      amount: formattedAmount,
      currency: currency
    });

    console.log('PayPal order created:', order);
    res.json(order);
  } catch (error) {
    console.error('PayPal create-order error:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Capture an order after approval
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    console.log('PayPal capture-order request:', { orderId });
    
    if (!orderId) {
      return res.status(400).json({ 
        error: 'Order ID is required',
        details: 'Please provide a valid PayPal order ID'
      });
    }

    // Use the PayPalService's captureOrder method, which handles the token internally
    const captureData = await PayPalService.getInstance().captureOrder(orderId);
    res.json(captureData);
  } catch (error) {
    console.error('PayPal capture-order error:', error);
    res.status(500).json({ 
      error: 'Failed to capture PayPal payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Verify a payment
router.get('/verify-payment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PayPalService.getInstance().verifyPayment(id);
    res.json(result);
  } catch (error) {
    console.error('Failed to verify payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Handle PayPal webhooks
router.post('/webhook', async (req, res) => {
  try {
    await PayPalService.getInstance().handleWebhook({
      body: req.body,
      headers: req.headers
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook handling failed:', error);
    res.sendStatus(500);
  }
});

// Debug endpoint to check PayPal configuration
router.get('/debug', async (req, res) => {
  try {
    const config = {
      apiUrl: process.env.PAYPAL_API_URL,
      clientId: process.env.PAYPAL_CLIENT_ID ? '✓ Configured' : '✗ Missing',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET ? '✓ Configured' : '✗ Missing',
      environment: process.env.PAYPAL_API_URL?.includes('sandbox') ? 'Sandbox' : 'Production'
    };
    
    // Remove direct token check, just return config and timestamp
    res.json({
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Debug check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test endpoint to verify PayPal is working
router.get('/test', async (req, res) => {
  try {
    console.log('PayPal test endpoint hit');
    res.json({ 
      message: 'PayPal routes are working',
      endpoints: [
        'POST /api/paypal/create-order',
        'POST /api/paypal/capture-order',
        'GET /api/paypal/debug',
        'GET /api/paypal/test'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
