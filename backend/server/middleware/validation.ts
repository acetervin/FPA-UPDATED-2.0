import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const gatewayStatusSchema = z.object({
  gateway: z.enum(['paypal', 'mpesa']),
  status: z.enum(['live', 'maintenance'])
});

export const paypalConfigSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  mode: z.enum(['sandbox', 'live']),
  merchantId: z.string().optional(),
});

export const mpesaConfigSchema = z.object({
  consumerKey: z.string().min(1, 'Consumer Key is required'),
  consumerSecret: z.string().min(1, 'Consumer Secret is required'),
  shortCode: z.string().min(1, 'Short Code is required'),
  passKey: z.string().min(1, 'Pass Key is required'),
  callbackUrl: z.string().url('Must be a valid URL'),
});

export const validateGatewayStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    gatewayStatusSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid gateway status data', details: error });
  }
};

export const validateGatewayConfig = (req: Request, res: Response, next: NextFunction) => {
  try {
    const gateway = req.params.gateway;
    const schema = gateway === 'paypal' ? paypalConfigSchema : mpesaConfigSchema;
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid gateway configuration', details: error });
  }
};

// XSS protection middleware
export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (!obj) return obj;
    
    if (typeof obj === 'string') {
      return obj
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    
    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: any, key) => {
        acc[key] = sanitize(obj[key]);
        return acc;
      }, Array.isArray(obj) ? [] : {});
    }
    
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};

// SQL injection protection middleware
export const sqlInjectionCheck = (req: Request, res: Response, next: NextFunction) => {
  const checkValue = (value: string): boolean => {
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 
      'UNION', 'OR', 'AND', '--', ';', '1=1'
    ];
    const valueUpper = value.toUpperCase();
    return !sqlKeywords.some(keyword => valueUpper.includes(keyword));
  };

  const check = (obj: any): boolean => {
    if (!obj) return true;
    if (typeof obj === 'string') return checkValue(obj);
    if (typeof obj === 'object') {
      return Object.values(obj).every(value => check(value));
    }
    return true;
  };

  if (!check(req.body) || !check(req.query) || !check(req.params)) {
    return res.status(400).json({ error: 'Potential SQL injection detected' });
  }

  next();
};
