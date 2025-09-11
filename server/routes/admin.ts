import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { sql, desc } from 'drizzle-orm';

import { db } from '../db.js';
import { donations, eventRegistrations, users, blogPosts, events, volunteerApplications } from '../../shared/schema.js';
import type { PaymentGatewayStatus, PaymentGatewayConfig } from '../types/payment.js';
import { paymentGatewayStatus } from '../schema/payment_gateway_status.js';
import { paymentGatewayConfig } from '../schema/payment_gateway_config.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { encrypt, decrypt, sanitizeError, EncryptionError } from '../utils/encryption.js';
import { logAuditEvent, logSecurityEvent } from '../utils/logger.js';

// Rate limiting to prevent brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const router = express.Router();

// Apply authentication to all admin routes
router.use(requireAuth);
router.use(requireAdmin);
router.use(apiLimiter);

// Get dashboard stats
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      donationStats,
      eventStats,
      userStats,
      gatewayStatus,
      recentTransactions
    ] = await Promise.all([
      db.select({
        total: sql`sum(amount)`,
        count: sql`count(*)`
      }).from(donations),
      db.select({
        total: sql`count(*)`
      }).from(events),
      db.select({
        total: sql`count(*)`
      }).from(users),
      db.select().from(paymentGatewayStatus),
      db.select()
        .from(donations)
        .orderBy(desc(donations.createdAt))
        .limit(10)
    ]);

    res.json({
      stats: {
        totalDonations: donationStats[0].total || 0,
        donationCount: donationStats[0].count || 0,
        totalEvents: eventStats[0].total || 0,
        totalUsers: userStats[0].total || 0
      },
      gatewayStatus,
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get payment gateway statuses
router.get('/payment-gateway-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statuses = await db.select().from(paymentGatewayStatus);
    res.json(statuses);
  } catch (err) {
    console.error('Error fetching gateway statuses:', err);
    res.status(500).json({ error: 'Failed to fetch gateway statuses' });
  }
});

// Update payment gateway status
router.post('/payment-gateway-status', async (req: Request, res: Response, next: NextFunction) => {
  const { gateway, status } = req.body as PaymentGatewayStatus;
  if (!gateway || !['live', 'maintenance'].includes(status)) {
    return res.status(400).json({ error: 'Invalid gateway or status' });
  }
  try {
    await db
      .update(paymentGatewayStatus)
      .set({ status, updatedAt: new Date() })
      .where(sql`${paymentGatewayStatus.gateway} = ${gateway}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating gateway status:', err);
    res.status(500).json({ error: 'Failed to update gateway status' });
  }
});

// Get payment gateway configurations
router.get('/payment-gateway-config', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await db.select().from(paymentGatewayConfig);
    res.json(configs);
  } catch (err) {
    console.error('Error fetching gateway configs:', err);
    res.status(500).json({ error: 'Failed to fetch gateway configurations' });
  }
});

// Update payment gateway configuration
router.post('/payment-gateway-config', async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as { gateway?: string, config?: any };
  const { gateway, config } = body;
  if (!gateway || !config) {
    return res.status(400).json({ error: 'Invalid gateway or configuration' });
  }
  try {
    await db
      .insert(paymentGatewayConfig)
      .values({ gateway, config: JSON.stringify(config) })
      .onConflictDoUpdate({
        target: paymentGatewayConfig.gateway,
        set: { config: JSON.stringify(config), updatedAt: new Date() }
      });
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating gateway config:', err);
    res.status(500).json({ error: 'Failed to update gateway configuration' });
  }
});

// Get PayPal payments for admin
interface PaymentQuery {
  startDate?: string;
  endDate?: string;
}

router.get('/payments/paypal', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string, endDate?: string };
    let whereClause = sql`${donations.paymentMethod} = 'paypal'`;
    if (startDate && endDate) {
      whereClause = sql`${donations.paymentMethod} = 'paypal' AND ${donations.createdAt} >= ${new Date(startDate)} AND ${donations.createdAt} <= ${new Date(endDate)}`;
    } else if (startDate) {
      whereClause = sql`${donations.paymentMethod} = 'paypal' AND ${donations.createdAt} >= ${new Date(startDate)}`;
    } else if (endDate) {
      whereClause = sql`${donations.paymentMethod} = 'paypal' AND ${donations.createdAt} <= ${new Date(endDate)}`;
    }
    const paypalPayments = await db
      .select({
        id: donations.id,
        orderId: donations.transactionId,
        amount: donations.amount,
        status: donations.status,
        createdAt: donations.createdAt,
        payer: sql`CASE WHEN ${donations.anonymous} = true THEN 'Anonymous' ELSE COALESCE(${users.fullName}, 'Unknown') END`,
      })
      .from(donations)
      .leftJoin(users, sql`${donations.userId} = ${users.id}`)
      .where(whereClause)
      .orderBy(desc(donations.createdAt));
    res.json(paypalPayments);
  } catch (err) {
    console.error('Error fetching PayPal payments:', err);
    res.status(500).json({ error: 'Failed to fetch PayPal payments' });
  }
});

// Get M-Pesa payments for admin
router.get('/payments/mpesa', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string, endDate?: string };
    let whereClause = sql`${donations.paymentMethod} = 'mpesa'`;
    if (startDate && endDate) {
      whereClause = sql`${donations.paymentMethod} = 'mpesa' AND ${donations.createdAt} >= ${new Date(startDate)} AND ${donations.createdAt} <= ${new Date(endDate)}`;
    } else if (startDate) {
      whereClause = sql`${donations.paymentMethod} = 'mpesa' AND ${donations.createdAt} >= ${new Date(startDate)}`;
    } else if (endDate) {
      whereClause = sql`${donations.paymentMethod} = 'mpesa' AND ${donations.createdAt} <= ${new Date(endDate)}`;
    }
    const mpesaPayments = await db
      .select({
        id: donations.id,
        transactionId: donations.transactionId,
        amount: donations.amount,
        status: donations.status,
        createdAt: donations.createdAt,
        payer: sql`CASE WHEN ${donations.anonymous} = true THEN 'Anonymous' ELSE COALESCE(${users.fullName}, 'Unknown') END`,
      })
      .from(donations)
      .leftJoin(users, sql`${donations.userId} = ${users.id}`)
      .where(whereClause)
      .orderBy(desc(donations.createdAt));
    res.json(mpesaPayments);
  } catch (err) {
    console.error('Error fetching M-Pesa payments:', err);
    res.status(500).json({ error: 'Failed to fetch M-Pesa payments' });
  }
});

// User management routes
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await db.select().from(users);
    res.json(usersList);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as { username?: string, password?: string, email?: string, role?: 'admin' | 'volunteer' | 'donor', fullName?: string };
    const { username, password, email, role, fullName } = body;
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check for existing user
    const existing = await db.select().from(users).where(sql`${users.username} = ${username}`);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const allowedRoles = ['admin', 'volunteer', 'donor'] as const;
    const safeRole = allowedRoles.includes(role as any) ? role : 'donor';
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      username,
      password: hashedPassword,
      email,
      role: safeRole,
      fullName,
      active: true
    }).returning();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// All donations route
router.get('/donations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donationsList = await db
      .select({
        id: donations.id,
        amount: donations.amount,
        status: donations.status,
        paymentMethod: donations.paymentMethod,
        createdAt: donations.createdAt,
        message: donations.message,
        anonymous: donations.anonymous,
        userId: donations.userId,
        donorName: sql<string>`CASE 
          WHEN ${donations.anonymous} = true THEN 'Anonymous'
          WHEN ${users.fullName} IS NOT NULL THEN ${users.fullName}
          ELSE 'Unknown'
        END`,
        donorEmail: sql<string>`CASE 
          WHEN ${donations.anonymous} = true THEN 'anonymous@example.com'
          WHEN ${users.email} IS NOT NULL THEN ${users.email}
          ELSE 'unknown@example.com'
        END`
      })
      .from(donations)
      .leftJoin(users, sql`${donations.userId} = ${users.id}`)
      .orderBy(desc(donations.createdAt));
    res.json(donationsList);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Get all blog posts
router.get('/blog-posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        category: blogPosts.category,
        imageUrl: blogPosts.imageUrl,
        publishedAt: blogPosts.publishedAt
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
    res.json(posts);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get all events
router.get('/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventsList = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        date: events.date,
        endDate: events.endDate,
        fee: events.fee,
        location: events.location,
        maxParticipants: events.maxParticipants,
        active: events.active,
        imageUrl: events.imageUrl,
        createdAt: events.createdAt
      })
      .from(events)
      .orderBy(desc(events.date));
    // Get registration counts for each event
    const registrationCounts = await db
      .select({
        eventId: eventRegistrations.eventId,
        count: sql<number>`count(*)`
      })
      .from(eventRegistrations)
      .groupBy(eventRegistrations.eventId);
    const eventsWithRegistrations = eventsList.map(event => ({
      ...event,
      registrations: registrationCounts.find(r => r.eventId === event.id)?.count ?? 0
    }));
    res.json(eventsWithRegistrations);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get all volunteer applications
router.get('/volunteer-applications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await db
      .select({
        id: volunteerApplications.id,
        name: volunteerApplications.name,
        email: volunteerApplications.email,
        phone: volunteerApplications.phone,
        program: volunteerApplications.program,
        experience: volunteerApplications.experience,
        availability: volunteerApplications.availability,
        message: volunteerApplications.message,
        submittedAt: volunteerApplications.submittedAt
      })
      .from(volunteerApplications)
      .orderBy(desc(volunteerApplications.submittedAt));
    res.json(applications);
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    res.status(500).json({ error: 'Failed to fetch volunteer applications' });
  }
});

// Get all event registrations (optionally filtered by eventId)
router.get('/event-registrations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.query as { eventId?: string };
    let registrations;
    if (eventId) {
      registrations = await db
        .select()
        .from(eventRegistrations)
        .where(sql`${eventRegistrations.eventId} = ${Number(eventId)}`)
        .orderBy(desc(eventRegistrations.createdAt));
    } else {
      registrations = await db
        .select()
        .from(eventRegistrations)
        .orderBy(desc(eventRegistrations.createdAt));
    }
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching event registrations:', err);
    res.status(500).json({ error: 'Failed to fetch event registrations' });
  }
});

export default router;
