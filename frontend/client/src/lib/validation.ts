import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Form schemas
export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const userUpdateSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  role: z.enum(['admin', 'volunteer', 'donor']),
  active: z.boolean(),
});

export const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  causeId: z.number().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  anonymous: z.boolean(),
  message: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  imageUrl: z.string().url('Invalid image URL'),
});

// Helper function to handle form validation
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Show validation errors in toast
      error.errors.forEach((err) => {
        useToast().toast({
          title: 'Validation Error',
          description: err.message,
          variant: 'destructive',
        });
      });
      return { success: false, error };
    }
    throw error;
  }
}
