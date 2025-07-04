import { 
  users, blogPosts, teamMembers, causes, volunteerApplications, 
  contactSubmissions, newsletterSubscriptions,
  type User, type InsertUser, type BlogPost, type InsertBlogPost,
  type TeamMember, type InsertTeamMember, type Cause, type InsertCause,
  type VolunteerApplication, type InsertVolunteerApplication,
  type ContactSubmission, type InsertContactSubmission,
  type NewsletterSubscription, type InsertNewsletterSubscription
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private teamMembers: Map<number, TeamMember>;
  private causes: Map<number, Cause>;
  private volunteerApplications: Map<number, VolunteerApplication>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.teamMembers = new Map();
    this.causes = new Map();
    this.volunteerApplications = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
    this.currentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed blog posts
    const blogPostsData: Omit<BlogPost, 'id'>[] = [
      {
        title: "Building Communication Bridges in Your Family",
        slug: "building-communication-bridges",
        excerpt: "Discover practical strategies to improve family communication and strengthen relationships through active listening and empathy.",
        content: "Communication is the foundation of healthy family relationships. In this comprehensive guide, we explore evidence-based strategies for improving family communication, including active listening techniques, conflict resolution methods, and creating safe spaces for open dialogue.",
        category: "Resources",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        publishedAt: new Date("2024-12-15"),
        featured: true,
      },
      {
        title: "The Power of Community Support in Family Healing",
        slug: "community-support-family-healing",
        excerpt: "Learn about the benefits of community support and how joining support groups can accelerate family healing and growth.",
        content: "Community support plays a crucial role in family healing. This article explores how peer support groups, community networks, and shared experiences can provide the foundation for lasting family change and resilience.",
        category: "Tools",
        imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        publishedAt: new Date("2024-12-12"),
        featured: true,
      },
      {
        title: "Understanding Conflict Resolution in Families",
        slug: "conflict-resolution-families",
        excerpt: "A comprehensive guide to peaceful conflict resolution strategies that strengthen family bonds rather than divide them.",
        content: "Conflict is natural in families, but how we handle it makes all the difference. Learn practical techniques for transforming family conflicts into opportunities for growth and understanding.",
        category: "Education",
        imageUrl: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        publishedAt: new Date("2024-12-10"),
        featured: false,
      }
    ];

    blogPostsData.forEach(post => {
      const id = this.currentId++;
      this.blogPosts.set(id, { ...post, id });
    });

    // Seed team members
    const teamMembersData: Omit<TeamMember, 'id'>[] = [
      {
        name: "Dr. Sarah Johnson",
        slug: "sarah-johnson",
        position: "Executive Director & Family Therapist",
        bio: "Dr. Johnson has over 15 years of experience in family therapy and conflict resolution. She founded the Family Peace Association with a vision of creating stronger, more harmonious families through evidence-based interventions.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        email: "sarah@familypeace.org",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        specialties: ["Family Therapy", "Conflict Resolution", "Child Psychology"],
      },
      {
        name: "Michael Rodriguez",
        slug: "michael-rodriguez",
        position: "Community Outreach Coordinator",
        bio: "Michael leads our community engagement efforts, building partnerships with local organizations and developing programs that reach families where they are.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        email: "michael@familypeace.org",
        linkedin: "https://linkedin.com/in/michaelrodriguez",
        specialties: ["Community Engagement", "Program Development", "Cultural Competency"],
      },
      {
        name: "Dr. Emily Chen",
        slug: "emily-chen",
        position: "Clinical Psychologist",
        bio: "Dr. Chen specializes in trauma-informed care and works with families dealing with complex emotional challenges and healing from past wounds.",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        email: "emily@familypeace.org",
        linkedin: "https://linkedin.com/in/emilychen",
        specialties: ["Trauma Therapy", "Child Development", "Group Therapy"],
      }
    ];

    teamMembersData.forEach(member => {
      const id = this.currentId++;
      this.teamMembers.set(id, { ...member, id });
    });

    // Seed causes
    const causesData: Omit<Cause, 'id'>[] = [
      {
        title: "Family Counseling Program",
        slug: "family-counseling-program",
        description: "Join our team of volunteer counselors and support families in crisis through professional guidance and emotional support.",
        fullDescription: "Our Family Counseling Program provides free therapeutic services to families in need. We train volunteers to work alongside licensed professionals to offer support, guidance, and healing opportunities for families facing challenges.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        goalAmount: 50000,
        raisedAmount: 25000,
        volunteersNeeded: 25,
        active: true,
      },
      {
        title: "Community Outreach Initiative",
        slug: "community-outreach-initiative",
        description: "Help us reach underserved communities by participating in educational workshops and family support events throughout the region.",
        fullDescription: "Our Community Outreach Initiative brings family support services directly to underserved communities. Volunteers help facilitate workshops, distribute resources, and connect families with ongoing support services.",
        imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        goalAmount: 75000,
        raisedAmount: 35000,
        volunteersNeeded: 40,
        active: true,
      }
    ];

    causesData.forEach(cause => {
      const id = this.currentId++;
      this.causes.set(id, { ...cause, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const post: BlogPost = { 
      ...insertPost, 
      id,
      featured: insertPost.featured ?? null
    };
    this.blogPosts.set(id, post);
    return post;
  }

  // Team member methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMember(slug: string): Promise<TeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(member => member.slug === slug);
  }

  async createTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentId++;
    const member: TeamMember = { 
      ...insertMember, 
      id,
      email: insertMember.email ?? null,
      linkedin: insertMember.linkedin ?? null,
      specialties: insertMember.specialties ?? null
    };
    this.teamMembers.set(id, member);
    return member;
  }

  // Cause methods
  async getCauses(): Promise<Cause[]> {
    return Array.from(this.causes.values());
  }

  async getCause(slug: string): Promise<Cause | undefined> {
    return Array.from(this.causes.values()).find(cause => cause.slug === slug);
  }

  async getActiveCauses(): Promise<Cause[]> {
    return Array.from(this.causes.values()).filter(cause => cause.active);
  }

  async createCause(insertCause: InsertCause): Promise<Cause> {
    const id = this.currentId++;
    const cause: Cause = { 
      ...insertCause, 
      id,
      active: insertCause.active ?? null
    };
    this.causes.set(id, cause);
    return cause;
  }

  // Volunteer application methods
  async getVolunteerApplications(): Promise<VolunteerApplication[]> {
    return Array.from(this.volunteerApplications.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async createVolunteerApplication(insertApplication: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const id = this.currentId++;
    const application: VolunteerApplication = { 
      id,
      name: insertApplication.name,
      email: insertApplication.email,
      phone: insertApplication.phone ?? null,
      program: insertApplication.program,
      experience: insertApplication.experience ?? null,
      availability: insertApplication.availability,
      message: insertApplication.message ?? null,
      submittedAt: new Date()
    };
    this.volunteerApplications.set(id, application);
    return application;
  }

  // Contact submission methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      submittedAt: new Date() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  // Newsletter subscription methods
  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values())
      .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const id = this.currentId++;
    const subscription: NewsletterSubscription = { 
      ...insertSubscription, 
      id, 
      subscribedAt: new Date() 
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }
}

export const storage = new MemStorage();
