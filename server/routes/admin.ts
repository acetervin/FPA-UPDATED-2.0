import { Router } from 'express';
import { db } from '../db';
import { donations, eventRegistrations, users, blogPosts, events, volunteerApplications } from '@shared/schema';
import { sql } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

const router = Router();

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalDonations,
      totalRegistrations,
      totalUsers,
      recentDonations
    ] = await Promise.all([
      // Get total donations amount
      db.select({ 
        total: sql<number>`sum(${donations.amount})` 
      }).from(donations).then(rows => rows[0]?.total ?? 0),
      
      // Get total event registrations
      db.select({ 
        count: sql<number>`count(*)` 
      }).from(eventRegistrations).then(rows => rows[0]?.count ?? 0),
      
      // Get total users
      db.select({ 
        count: sql<number>`count(*)` 
      }).from(users).then(rows => rows[0]?.count ?? 0),
      
      // Get recent donations
      db.select().from(donations).orderBy(desc(donations.createdAt)).limit(5)
    ]);

    const [
      successfulDonations,
      pendingDonations,
      monthlyStats
    ] = await Promise.all([
      // Get count of successful donations
      db.select({ count: sql<number>`count(*)` })
        .from(donations)
        .where(sql`${donations.status} = 'completed'`)
        .then(rows => rows[0]?.count ?? 0),
      
      // Get count of pending donations
      db.select({ count: sql<number>`count(*)` })
        .from(donations)
        .where(sql`${donations.status} = 'pending'`)
        .then(rows => rows[0]?.count ?? 0),

      // Get monthly stats
      db.select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(case when ${donations.status} = 'completed' then 1 end)`,
        failed: sql<number>`count(case when ${donations.status} = 'failed' then 1 end)`
      })
      .from(donations)
      .where(sql`${donations.createdAt} >= date_trunc('month', current_date)`)
      .then(rows => rows[0])
    ]);

    // Calculate success rate
    const successRate = successfulDonations > 0 
      ? ((successfulDonations / (successfulDonations + pendingDonations)) * 100).toFixed(1) + '%'
      : '0%';

    // Get payment methods distribution
    const paymentMethods = await db
      .select({
        method: sql<string>`${donations.paymentMethod}`,
        count: sql<number>`count(*)`
      })
      .from(donations)
      .groupBy(donations.paymentMethod)
      .then(rows => rows.reduce((acc, row) => ({
        ...acc,
        [row.method]: row.count
      }), {}));

    res.json({
      totalDonations: totalDonations,
      donationCount: successfulDonations + pendingDonations,
      pendingPayments: pendingDonations,
      successRate,
      recentTransactions: recentDonations.map(d => ({
        id: d.id,
        type: 'donation',
        amount: d.amount,
        paymentMethod: d.paymentMethod,
        status: d.status,
        customer: {
          name: d.userId ? 'Anonymous' : 'User ' + d.userId,  // TODO: Join with users table to get actual name
          email: d.userId ? 'anonymous@example.com' : 'user@example.com'  // TODO: Join with users table to get actual email
        },
        createdAt: d.createdAt.toISOString()
      })),
      paymentMethods,
      monthlyStats: {
        totalTransactions: monthlyStats?.total ?? 0,
        completedTransactions: monthlyStats?.completed ?? 0,
        failedTransactions: monthlyStats?.failed ?? 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get recent transactions
router.get('/transactions', async (req, res) => {
  try {
    const recentTransactions = await db
      .select()
      .from(donations)
      .orderBy(desc(donations.createdAt))
      .limit(10);

    res.json(recentTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// User management routes
router.get('/users', async (req, res) => {
  try {
    const usersList = await db.select().from(users);
    res.json(usersList);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const [newUser] = await db.insert(users).values({
      username: req.body.username,
      password: req.body.password, // Note: Should be hashed before insertion
      email: req.body.email,
      role: req.body.role || 'donor',
      fullName: req.body.fullName,
      active: true
    }).returning();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// All donations route
router.get('/donations', async (req, res) => {
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
        // Join with users table to get donor information
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
router.get('/blog-posts', async (req, res) => {
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
router.get('/events', async (req, res) => {
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
router.get('/volunteer-applications', async (req, res) => {
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

export default router;
