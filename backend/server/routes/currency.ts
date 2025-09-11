import { Router } from 'express';
import { currencyConverter } from '../utils/currency';

const router = Router();

router.post('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    
    if (!amount || !from || !to) {
      return res.status(400).json({ 
        error: 'Missing required parameters: amount, from, to' 
      });
    }

    const convertedAmount = await currencyConverter.convert(
      Number(amount),
      from,
      to
    );

    res.json({ amount: convertedAmount });
  } catch (error) {
    console.error('Currency conversion failed:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

export default router;
