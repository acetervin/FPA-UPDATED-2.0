import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { db } from '../db';
import { users } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

export class TwoFactorAuthService {
  static async generateSecret(userId: number) {
    const secret = speakeasy.generateSecret({
      name: 'Family Peace Association',
      issuer: 'FPA Kenya'
    });

    await db.update(users)
      .set({ 
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false 
      })
      .where(eq(users.id, userId));

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl
    };
  }

  static async verifyToken(userId: number, token: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user?.twoFactorSecret) {
      throw new Error('2FA not set up for this user');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      // If this is the first verification, enable 2FA
      if (!user.twoFactorEnabled) {
        await db.update(users)
          .set({ twoFactorEnabled: true })
          .where(eq(users.id, userId));
      }
      return true;
    }

    return false;
  }

  static async validateLogin(userId: number, token: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user?.twoFactorEnabled) {
      return true; // 2FA not required
    }

    return this.verifyToken(userId, token);
  }

  static async disable(userId: number) {
    await db.update(users)
      .set({ 
        twoFactorEnabled: false,
        twoFactorSecret: null 
      })
      .where(eq(users.id, userId));
  }
}
