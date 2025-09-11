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
import { rateLimiter, authLimiter, trackSessionActivity } from './middleware/security.js';

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

// Basic middleware (order matters!)

app.use(cookieParser());
app.use(bodyParser.json({ limit: '10kb' })); // Limit JSON payload size
app.use(bodyParser.urlencoded({ extended: false, limit: '10kb' }));

// Security Headers with environment-specific CSP
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: process.env.NODE_ENV === 'production' 
    ? ["'self'", "https://*.paypal.com", "https://js.stripe.com", "https://*.safaricom.co.ke"]
    : ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.paypal.com", "https://js.stripe.com", "https://*.safaricom.co.ke"],
  styleSrc: process.env.NODE_ENV === 'production'
    ? ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"]
    : ["'self'", "'unsafe-inline'", "https:", "http:"],
  imgSrc: ["'self'", "data:", "https:", "blob:", "https://*.paypal.com", "https://*.safaricom.co.ke"],
  fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
  connectSrc: ["'self'", 
              "https://*.paypal.com", "https://api.paypal.com", "https://api-m.sandbox.paypal.com",
              "https://api.stripe.com",
              "https://sandbox.safaricom.co.ke", "https://api.safaricom.co.ke"],
  frameSrc: ["'self'", "https://*.paypal.com", "https://*.safaricom.co.ke"],
  formAction: ["'self'", "https://*.paypal.com", "https://*.safaricom.co.ke"],
  mediaSrc: ["'self'", "data:", "https:"],
  objectSrc: ["'none'"],
  workerSrc: ["'self'", "blob:"],
  baseUri: ["'self'"],
  ...(process.env.NODE_ENV === 'production' && { upgradeInsecureRequests: [] })
};

app.use(helmet({
  contentSecurityPolicy: {
    directives: cspDirectives,
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: process.env.NODE_ENV === 'production' ? 31536000 : 0, // 1 year in production
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration with environment-specific settings
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['https://familypeace.org'])
  : ['http://localhost:5000', 'http://0.0.0.0:5000', 'http://localhost:5173', 'http://localhost:3002', 'http://localhost:5174'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-Requested-With'],
  exposedHeaders: ['x-csrf-token'],
  maxAge: process.env.NODE_ENV === 'production' ? 86400 : 600, // 24 hours in production, 10 minutes in dev
  optionsSuccessStatus: 200
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

// Register API routes first
const httpServerPromise = registerRoutes(app);

// Error handling middleware - MUST come after routes
interface ServerError extends Error {
  status?: number;
  statusCode?: number;
}

app.use((err: ServerError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export the app and httpServerPromise for serverless usage
export { app, httpServerPromise };

// Start the server for development in Replit environment
(async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10); // Use 3001 to avoid conflict with frontend port 5000
    
    const httpServer = await httpServerPromise;
    
    // In development, don't setup Vite here since frontend runs separately on port 5000
    // In production, serve static files from the client build.
    if (process.env.NODE_ENV === 'production') {
      // Serve static files from the client build directory
      app.use(express.static(path.join(__dirname, '..', 'dist', 'client'), {
        index: false, // Don't serve index.html automatically
        maxAge: '1y', // Cache static assets for 1 year
      }));

      // Catch all handler: send back index.html for client-side routing
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'client', 'index.html'));
      });
    }

    // Determine the host based on environment
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    // Start listening on the determined host
    httpServer.listen(port, host, () => {
      console.log(`Backend server started: listening on ${host}:${port}`);
      console.log(`Health check available at: http://${host}:${port}/api/health`);
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
