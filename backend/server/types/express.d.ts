import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
      validatedData?: any;
      // Add other custom properties as needed
    }
  }
}
