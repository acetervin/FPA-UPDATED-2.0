import { Router } from 'express';
import { TwoFactorAuthService } from '../services/2fa';

const router = Router();

// Generate 2FA secret and QR code
router.post('/2fa/setup', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await TwoFactorAuthService.generateSecret(userId);
    res.json(result);
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ error: 'Failed to set up 2FA' });
  }
});

// Verify 2FA token during setup
router.post('/2fa/verify', async (req, res) => {
  try {
    const { userId, token } = req.body;
    const isValid = await TwoFactorAuthService.verifyToken(userId, token);
    res.json({ success: isValid });
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    res.status(500).json({ error: 'Failed to verify 2FA token' });
  }
});

// Disable 2FA
router.post('/2fa/disable', async (req, res) => {
  try {
    const { userId } = req.body;
    await TwoFactorAuthService.disable(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// Validate 2FA during login
router.post('/2fa/validate', async (req, res) => {
  try {
    const { userId, token } = req.body;
    const isValid = await TwoFactorAuthService.validateLogin(userId, token);
    res.json({ success: isValid });
  } catch (error) {
    console.error('Error validating 2FA:', error);
    res.status(500).json({ error: 'Failed to validate 2FA' });
  }
});

export default router;
