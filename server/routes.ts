import express from 'express';
import { createServer, type Server } from "http";
import type { Express, Request, Response } from 'express';
import { storage } from "./storage.js";
import { 
  insertVolunteerApplicationSchema,
  insertContactSubmissionSchema,
  insertNewsletterSubscriptionSchema,
  events,
  eventRegistrations,
  blogPosts,
  users,
  donations,
  createInsertSchema,
  galleryImages
} from "../shared/schema.js";



import { z } from "zod";
import { db } from './db.js';
import { sql, gte, desc } from 'drizzle-orm';
import { initiatePayment, handlePaymentCallback } from './payments.js';

import mediaRouter from './routes/media.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import paypalApiRouter from './routes/paypal-api.js';
import paypalWebhookRouter from './routes/paypal-webhook.js';
import mpesaRouter from './routes/mpesa.js';
import currencyRouter from './routes/currency.js';


export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Register auth routes
  app.use('/api/auth', authRouter);
  
  // Register currency routes
  app.use('/api/currency', currencyRouter);
  // Register media routes
  app.use('/api/media', mediaRouter);
  // Register admin routes
  app.use('/api/admin', adminRouter);
  // Register PayPal routes
  app.use('/api/paypal', paypalApiRouter);
  app.use('/api/paypal', paypalWebhookRouter);
  // Register M-Pesa routes
  app.use('/api/mpesa', mpesaRouter);
  // Fetch latest event
  app.get("/api/events/latest", async (req, res) => {
    try {
      const [latestEvent] = await db
        .select()
        .from(events)
        .where(gte(events.date, new Date()))
        .orderBy(desc(events.date))
        .limit(1);

      if (!latestEvent) {
        return res.status(404).json({ message: 'No upcoming events found' });
      }

      res.json(latestEvent);
    } catch (error) {
      console.error('Error fetching latest event:', error);
      res.status(500).json({ message: "Failed to fetch latest event" });
    }
  });
  // Fetch event by name
  app.get("/api/events/by-name/:name", async (req: Request, res: Response) => {

    try {
      const { name } = req.params;
      
      const event = await db.select().from(events)
        .where(sql`${events.name} = ${name} AND ${events.active} = true`)
        .limit(1);

      if (!event.length) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event[0]);
    } catch (error) {
      console.error('Error fetching event by name:', error);
      res.status(500).json({ message: "Failed to fetch event by name" });
    }
  });
  // Payment routes
  app.post("/api/payments/initiate", initiatePayment);
  app.get("/api/payments/callback", handlePaymentCallback);

  // Event routes
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const allEvents = await db.select().from(events)
        .where(sql`${events.active} = true`)
        .orderBy(events.date);
      res.json(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format" });
      }

      const event = await db.select().from(events)
        .where(sql`${events.id} = ${eventId} AND ${events.active} = true`)
        .limit(1);

      if (!event.length) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event[0]);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Blog routes
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/featured", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  app.get("/api/blog-posts/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const posts = await storage.getBlogPostsByCategory(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts by category" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPost(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Team routes
  app.get("/api/team-members", async (req: Request, res: Response) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get("/api/team-members/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const member = await storage.getTeamMember(slug);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  // Causes routes
  app.get("/api/causes", async (req: Request, res: Response) => {
    try {
      const causes = await storage.getCauses();
      res.json(causes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch causes" });
    }
  });

  app.get("/api/causes/active", async (req: Request, res: Response) => {
    try {
      const causes = await storage.getActiveCauses();
      res.json(causes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active causes" });
    }
  });

  app.get("/api/causes/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const cause = await storage.getCause(slug);
      if (!cause) {
        return res.status(404).json({ message: "Cause not found" });
      }
      res.json(cause);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cause" });
    }
  });

  // Volunteer application routes
  app.post("/api/volunteer-applications", async (req: Request, res: Response) => {
    try {
      const validatedData = insertVolunteerApplicationSchema.parse(req.body);
      const application = await storage.createVolunteerApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit volunteer application" });
    }
  });

  // Contact submission routes
  app.post("/api/contact-submissions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Newsletter subscription routes
  app.post("/api/newsletter-subscriptions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(validatedData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.get('/api/gallery', async (req: Request, res: Response) => {
    try {
      const images = await db.select().from(galleryImages);
      const filteredImages = images.filter((image) => image.imageUrl);
      res.json({
        images: filteredImages.map((img) => ({
          imageUrl: img.imageUrl,

          title: img.title,
          description: img.description,
          category: img.category,
          uploadedAt: img.uploadedAt,
        }))
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch gallery images' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
