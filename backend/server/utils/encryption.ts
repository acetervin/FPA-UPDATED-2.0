import crypto from 'crypto';

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

// Error class for encryption operations
export class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

// Encrypt sensitive data
export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new EncryptionError('Failed to encrypt data');
  }
}

// Decrypt sensitive data
export function decrypt(text: string): string {
  try {
    const [ivHex, encryptedHex] = text.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new EncryptionError('Failed to decrypt data');
  }
}

// Sanitize error messages for production
export function sanitizeError(error: any): { message: string; code?: string } {
  if (error instanceof EncryptionError) {
    return {
      message: error.message,
      code: 'ENCRYPTION_ERROR'
    };
  }

  if (process.env.NODE_ENV === 'development') {
    return {
      message: error.message || 'An error occurred',
      code: error.code
    };
  }

  return {
    message: 'An error occurred',
    code: 'INTERNAL_ERROR'
  };
}
