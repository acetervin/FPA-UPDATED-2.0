declare namespace Express {
  export interface Request {
    session: {
      userId?: number;
      userRole?: string;
      [key: string]: any;
    };
    validatedData?: any;
  }
}
