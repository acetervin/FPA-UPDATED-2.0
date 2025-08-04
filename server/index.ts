import express from 'express';
import { type Server } from "http";
import { Session, SessionData } from 'express-session';
import type { Request, Response, NextFunction, Express } from 'express';
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const app: Express = express();

// Trust the first proxy to get the real IP address for rate limiting.
app.set('trust proxy', 1);

import { registerRoutes } from "./routes.js";

import { setupVite } from "./vite.js";
import { logError, logSecurity, logInfo } from "./utils/logger.js";
import 'dotenv/config';
import helmet from 'helmet';
import { sessionConfig } from './config/session.js';
import { sessionMiddleware, secureSession, sessionActivityLogger } from './middleware/session.js';
import { csrfProtection, generateCsrfToken, validateCsrfToken } from './middleware/csrf.js';
import { xssSanitizer, sqlInjectionCheck } from './middleware/validation.js';
import { errorHandler } from './middleware/error.js';
import { rateLimiter, authLimiter, ipFilter, trackSessionActivity } from './middleware/security.js';
import session from 'express-session';
import cors from "cors";
import path from "path";


import cookieParser from 'cookie-parser';

// App instance is already created above

// Enable compression
import compression from 'compression';
app.use(compression());

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache control for static assets
app.use(serveStatic('dist/public', {
  
  etag: true,
  lastModified: true
}));

// Basic middleware (order matters!)
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10kb' })); // Limit JSON payload size
app.use(bodyParser.urlencoded({ extended: false, limit: '10kb' }));

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.paypal.com", "https://js.stripe.com", "https://*.safaricom.co.ke"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:", "https://*.paypal.com", "https://*.safaricom.co.ke"],
      fontSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "wss:", "http:", "ws:",
                  "https://*.paypal.com", "https://api.paypal.com", "https://api-m.sandbox.paypal.com",
                  "https://api.stripe.com",
                  "https://sandbox.safaricom.co.ke", "https://api.safaricom.co.ke"],
      frameSrc: ["'self'", "https://*.paypal.com", "https://*.safaricom.co.ke"],
      formAction: ["'self'", "https://*.paypal.com", "https://*.safaricom.co.ke"],
      mediaSrc: ["'self'", "data:", "https:", "http:"],
      objectSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"]
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-Requested-With'],
  exposedHeaders: ['x-csrf-token'],
  maxAge: 86400
}));

// Session management
app.use(session(sessionConfig));
app.use(sessionMiddleware);
app.use(secureSession);
app.use(sessionActivityLogger);

// CSRF Protection - exclude certain API endpoints
app.use((req: Request, res: Response, next: NextFunction) => {
  // List of paths to exclude from CSRF protection
  const excludePaths = [
    '/api/currency/convert',
    '/api/mpesa',  // Add the base path for M-Pesa endpoints
    '/api/webhooks', // Add any webhook endpoints
    '/api/auth/login', // Exclude login endpoint from CSRF
    '/api/auth/register', // Exclude register endpoint from CSRF
    '/auth/login', // Alternative login path
    '/auth/register', // Alternative register path
    '/api/admin/dashboard', // Admin dashboard endpoints
    '/api/admin/stats',
    '/api/admin/payment-gateway-status'
  ];
  
  if (excludePaths.some(path => req.path.startsWith(path))) {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});

app.use(generateCsrfToken);

// Only validate CSRF token in production and for non-excluded paths
if (process.env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const excludePaths = [
      '/api/mpesa',
      '/api/webhooks',
      '/api/auth/login',
      '/api/auth/register',
      '/auth/login',
      '/auth/register',
      '/api/admin/dashboard',
      '/api/admin/stats',
      '/api/admin/payment-gateway-status'
    ];
    if (excludePaths.some(path => req.path.startsWith(path))) {
      next();
    } else {
      validateCsrfToken(req, res, next);
    }
  });
}

// Input validation and security
app.use(xssSanitizer);
app.use(sqlInjectionCheck);

// Security features that are only enabled in production
if (process.env.NODE_ENV === 'production') {
  app.use(ipFilter); // IP blocking for suspicious activity
  app.use(rateLimiter); // General rate limiting
  app.use('/api/auth/*', authLimiter); // Stricter rate limiting for auth routes
}

app.use(trackSessionActivity); // Track session activity for security

// Structured logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  
  // Capture response data
  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any) {
    res.locals.responseData = bodyJson;
    return originalResJson(bodyJson);
  };

  // Log on request completion
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      interface LogData {
        timestamp: string;
        method: string;
        path: string;
        status: number;
        duration: string;
        userId: string;
        ip: string;
        userAgent: string | undefined;
      }
      
      const logData: LogData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: path,
        status: res.statusCode,
        duration: `${duration}ms`,
        userId: (req.session as any)?.userId || 'anonymous',
        ip: req.ip || 'unknown',
        userAgent: req.headers['user-agent']
      };

      // Log at appropriate level based on status code
      if (res.statusCode >= 500) {
        logError('Server error occurred', logData);
      } else if (res.statusCode >= 400) {
        logSecurity('Client error occurred', logData);
      } else {
        logInfo(JSON.stringify(logData));
      }
    }
  });

  next();
});

// Error handling middleware
interface ServerError extends Error {
  status?: number;
  statusCode?: number;
}

app.use((err: ServerError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Start server
(async () => {
  try {
    const port = process.env.PORT || 3001;
    
    // Register API routes first
    const httpServer = await registerRoutes(app);
    
    // Then set up Vite middleware
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, httpServer);
    } else {
      // Serve static files in production
      app.use(serveStatic(path.join(__dirname, '../dist/public')));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../dist/public/index.html'));
      });
    }

    // Start listening
    httpServer.listen(port, () => {
      console.log(`Server started: listening on port ${port}`);
      console.log(`Health check available at: http://localhost:${port}/api/health`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`CORS origin: ${process.env.CORS_ORIGIN}`);
    });

    // Handle server errors
    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please stop other servers or use a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error: unknown) {
    console.error('Server startup error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
})();
