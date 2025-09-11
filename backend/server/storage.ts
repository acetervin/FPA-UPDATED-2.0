import { DbStorage } from './db.js';
import type { 
  User, InsertUser, BlogPost, InsertBlogPost,
  TeamMember, InsertTeamMember, Cause, InsertCause,
  VolunteerApplication, InsertVolunteerApplication,
  ContactSubmission, InsertContactSubmission,
  NewsletterSubscription, InsertNewsletterSubscription
} from '../shared/schema.js';

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(slug: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;

  // Causes
  getCauses(): Promise<Cause[]>;
  getCause(slug: string): Promise<Cause | undefined>;
  getActiveCauses(): Promise<Cause[]>;
  createCause(cause: InsertCause): Promise<Cause>;

  // Volunteer Applications
  getVolunteerApplications(): Promise<VolunteerApplication[]>;
  createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication>;

  // Contact Submissions
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;

  // Newsletter Subscriptions
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
}

export const storage: IStorage = new DbStorage();
