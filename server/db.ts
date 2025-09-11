import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import { IStorage } from './storage.js';
import * as schema from '../shared/schema.js';
import {
  users, blogPosts, teamMembers, causes, volunteerApplications,
  contactSubmissions, newsletterSubscriptions,
  type User, type InsertUser, type BlogPost, type InsertBlogPost,
  type TeamMember, type InsertTeamMember, type Cause, type InsertCause,
  type VolunteerApplication, type InsertVolunteerApplication,
  type ContactSubmission, type InsertContactSubmission,
  type NewsletterSubscription, type InsertNewsletterSubscription
} from '../shared/schema.js';

// Create serverless-optimized database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export class DbStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: Omit<InsertUser, 'id'>): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(schema.blogPosts.publishedAt);
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return result[0];
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.featured, true)).orderBy(schema.blogPosts.publishedAt);
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.category, category)).orderBy(schema.blogPosts.publishedAt);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers);
  }

  async getTeamMember(slug: string): Promise<TeamMember | undefined> {
    const result = await db.select().from(teamMembers).where(eq(teamMembers.slug, slug));
    return result[0];
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const result = await db.insert(teamMembers).values(member).returning();
    return result[0];
  }

  // Causes
  async getCauses(): Promise<Cause[]> {
    return db.select().from(causes);
  }

  async getCause(slug: string): Promise<Cause | undefined> {
    const result = await db.select().from(causes).where(eq(causes.slug, slug));
    return result[0];
  }

  async getActiveCauses(): Promise<Cause[]> {
    return db.select().from(causes).where(eq(causes.active, true));
  }

  async createCause(cause: InsertCause): Promise<Cause> {
    const result = await db.insert(causes).values(cause).returning();
    return result[0];
  }

  // Volunteer Applications
  async getVolunteerApplications(): Promise<VolunteerApplication[]> {
    return db.select().from(volunteerApplications).orderBy(schema.volunteerApplications.submittedAt);
  }

  async createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const result = await db.insert(volunteerApplications).values({ ...application, submittedAt: new Date() }).returning();
    return result[0];
  }

  // Contact Submissions
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(schema.contactSubmissions.submittedAt);
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values({ ...submission, submittedAt: new Date() }).returning();
    return result[0];
  }

  // Newsletter Subscriptions
  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return db.select().from(newsletterSubscriptions).orderBy(schema.newsletterSubscriptions.subscribedAt);
  }

  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const result = await db.insert(newsletterSubscriptions).values({ ...subscription, subscribedAt: new Date() }).returning();
    return result[0];
  }
}

export { db };
