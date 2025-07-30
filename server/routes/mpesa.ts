import express, { Router } from 'express';
import type { Request, Response } from 'express';
import MPesaService from '../services/mpesa';
import { z } from 'zod';
import { currencyConverter } from '../utils/currency';

interface MpesaRequestBody {
  phoneNumber: string;
  amount: string | number;
  currency?: string;
  reference?: string;
  description?: string;
}

interface MpesaStatus {
  status: string;
  message: string;
}

const router = Router();

// Initialize M-Pesa service
const mpesaService = new MPesaService({
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  shortCode: process.env.MPESA_SHORTCODE || '',
  passKey: process.env.MPESA_PASSKEY || '',
  callbackUrl: process.env.MPESA_CALLBACK_URL || '',
  env: (process.env.MPESA_ENV || 'sandbox') as 'sandbox' | 'production'
});

// Validation schemas
const initiatePaymentSchema = z.object({
  phoneNumber: z.string()
    .regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid phone number format'),
  amount: z.number().min(1),
  reference: z.string().optional(),
  description: z.string().optional()
});

// Route to initiate STK push
router.post('/initiate', async (req: Request<{}, {}, MpesaRequestBody>, res: Response) => {
  try {
    console.log('M-Pesa payment initiation request:', req.body);
    
    const { phoneNumber, amount, currency = 'KES', reference, description } = req.body;
    
    // Validate the input
    const validatedData = initiatePaymentSchema.parse({
      phoneNumber,
      amount: Number(amount),
      reference,
      description
    });

    console.log('Validated M-Pesa data:', validatedData);

    // Use the amount directly - client should send the final KES amount
    // This prevents double conversion issues
    const amountInKES = Math.round(Number(amount));

    console.log('Initiating M-Pesa STK push with amount:', amountInKES);

    // Use the amount for the M-Pesa payment
    const response = await mpesaService.initiateSTKPush(
      phoneNumber,
      amountInKES,
      reference || 'Donation',
      description || 'Donation to Family Peace Association'
    );

    console.log('M-Pesa STK push response:', response);

    res.json(response);
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    res.status(400).json({ 
      error: error instanceof z.ZodError 
        ? error.errors 
        : 'Failed to initiate payment' 
    });
  }
});

// Route to check transaction status
router.get('/status/:checkoutRequestId', async (req: Request<{ checkoutRequestId: string }>, res: Response) => {
  try {
    const { checkoutRequestId } = req.params;
    
    if (!checkoutRequestId) {
      return res.status(400).json({ 
        error: 'Missing checkoutRequestId parameter'
      });
    }

    const status = await mpesaService.checkTransactionStatus(checkoutRequestId);
    
    // Always return a consistent response structure
    res.json({
      status: status.status,
      message: status.message,
      checkoutRequestId: checkoutRequestId
    });
  } catch (error) {
    console.error('Error checking M-Pesa status:', error);
    // Return a structured error response
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Failed to check payment status',
      checkoutRequestId: req.params.checkoutRequestId
    });
  }
});

// Callback URL for M-Pesa
router.post('/callback', async (req: Request, res: Response) => {
  try {
    // Log the callback data
    console.log('M-Pesa callback received:', req.body);

    // TODO: Implement callback handling
    // - Verify the transaction
    // - Update the database
    // - Send confirmation to user

    // Send acknowledgment to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

export default router;
