import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export { createInsertSchema };

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ['admin', 'volunteer', 'donor'] }).notNull().default('donor'),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  active: boolean("active").notNull().default(true),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
});


export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  url: text("url").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const recurringDonations = pgTable("recurring_donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: integer("amount").notNull(),
  causeId: integer("cause_id").references(() => causes.id),
  frequency: text("frequency", { enum: ['monthly', 'quarterly', 'yearly'] }).notNull(),
  nextDonationDate: timestamp("next_donation_date").notNull(),
  status: text("status", { enum: ['active', 'paused', 'cancelled'] }).notNull().default('active'),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastDonationDate: timestamp("last_donation_date"),
  failedAttempts: integer("failed_attempts").notNull().default(0),
});

export const paymentGatewayStatus = pgTable('payment_gateway_status', {
  id: serial('id').primaryKey(),
  gateway: text('gateway').notNull().unique(),
  status: text('status', { enum: ['live', 'maintenance'] }).notNull().default('live'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const paymentGatewayConfig = pgTable('payment_gateway_config', {
  gateway: text('gateway').primaryKey(),
  config: text('config').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: integer("amount").notNull(),
  causeId: integer("cause_id"),
  paymentMethod: text("payment_method").notNull(),
  transactionId: text("transaction_id"),
  status: text("status", { enum: ['pending', 'completed', 'failed'] }).notNull().default('pending'),
  anonymous: boolean("anonymous").notNull().default(false),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  recurringDonationId: integer("recurring_donation_id").references(() => recurringDonations.id),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  endDate: timestamp("end_date"), // Optional, only for events
  featured: boolean("featured").default(false),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  position: text("position").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  email: text("email"),
  linkedin: text("linkedin"),
  specialties: text("specialties").array(),
});

export const causes = pgTable("causes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  fullDescription: text("full_description").notNull(),
  imageUrl: text("image_url").notNull(),
  goalAmount: integer("goal_amount").notNull(),
  raisedAmount: integer("raised_amount").notNull(),
  volunteersNeeded: integer("volunteers_needed").notNull(),
  active: boolean("active").default(true),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date").notNull(), // Event end date
  fee: integer("fee").notNull(),
  location: text("location").notNull(),
  maxParticipants: integer("max_participants"),
  active: boolean("active").default(true),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  fullDescription: text("full_description"), // Extended description for detail page
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  featured: boolean("featured").default(false),
  category: text("category").default("general"), // Event category
  tags: text("tags").array(), // Event tags
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  registrationUrl: text("registration_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event images for multiple photos per event
export const eventImages = pgTable("event_images", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id, { onDelete: 'cascade' }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isPrimary: boolean("is_primary").default(false),
  order: integer("order").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Event supporters/sponsors
export const eventSupporters = pgTable("event_supporters", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  logo: text("logo"),
  website: text("website"),
  type: text("type", { enum: ['sponsor', 'partner', 'organizer', 'supporter'] }).default('supporter'),
  level: text("level", { enum: ['platinum', 'gold', 'silver', 'bronze', 'standard'] }).default('standard'),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  registrationType: text("registration_type").notNull(), // 'individual' or 'organization'
  // Individual fields
  firstName: text("first_name"),
  middleName: text("middle_name"),
  surname: text("surname"),
  // Organization fields
  organizationName: text("organization_name"),
  organizationEmail: text("organization_email"),
  representativeName: text("representative_name"),
  role: text("role"),
  // Common fields
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  paymentStatus: text("payment_status").notNull().default('pending'), // 'pending', 'completed', 'failed'
  paymentReference: text("payment_reference"),
  gateway: text("gateway"),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export const volunteerApplications = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  program: text("program").notNull(),
  experience: text("experience"),
  availability: text("availability").notNull(),
  message: text("message"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull().default('Uncategorized'),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export const insertCauseSchema = createInsertSchema(causes).omit({
  id: true,
});

export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).omit({
  id: true,
  submittedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribedAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  uploadedAt: true,
});

export const insertPaymentGatewayStatusSchema = createInsertSchema(paymentGatewayStatus).omit({
  id: true,
  updatedAt: true,
});

export const insertPaymentGatewayConfigSchema = createInsertSchema(paymentGatewayConfig).omit({
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Cause = typeof causes.$inferSelect;
export type InsertCause = z.infer<typeof insertCauseSchema>;

export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

export type PaymentGatewayStatus = typeof paymentGatewayStatus.$inferSelect;
export type InsertPaymentGatewayStatus = z.infer<typeof insertPaymentGatewayStatusSchema>;

export type PaymentGatewayConfig = typeof paymentGatewayConfig.$inferSelect;
export type InsertPaymentGatewayConfig = z.infer<typeof insertPaymentGatewayConfigSchema>;
