import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

// Create separate loggers for different types of events
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'security-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

// Log security events (authentication, authorization failures, config errors)
export function logSecurityEvent(event: {
  type: 'auth_failure' | 'auth_success' | 'csrf_violation' | 'rate_limit' | 'permission_denied' | 'config_access_error' | 'config_update_error';
  userId?: string;
  ip: string;
  message: string;
  metadata?: any;
}) {
  securityLogger.info(event);
}

// Log audit events (configuration changes, status updates)
export function logAuditEvent(event: {
  type: 'config_update' | 'status_update' | 'gateway_config';
  userId: string;
  action: string;
  resource: string;
  details: any;
}) {
  auditLogger.info(event);
}

// Log payment events
export function logPaymentEvent(event: {
  type: 'payment_initiated' | 'payment_completed' | 'payment_failed';
  gateway: string;
  transactionId: string;
  amount: number;
  status: string;
  metadata?: any;
}) {
  auditLogger.info({ ...event, category: 'payment' });
}

// Convenience methods for common logging operations
export const logError = (error: Error | string, metadata?: any) => {
  auditLogger.error({
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    ...metadata
  });
};

export const logInfo = (message: string, metadata?: any) => {
  auditLogger.info({
    message,
    ...metadata
  });
};

export const logSecurity = (message: string, metadata?: any) => {
  securityLogger.info({
    message,
    ...metadata
  });
};

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  securityLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
  auditLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
