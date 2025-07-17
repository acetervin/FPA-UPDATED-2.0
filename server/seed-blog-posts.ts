import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import * as schema from '../shared/schema';
import { blogPosts } from '../shared/schema';
import { sql } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding blog posts...');

  // Seed Blog Posts for Events
  await db.insert(blogPosts).values([
    {
      title: "Annual Charity Gala 2025",
      slug: "annual-charity-gala-2025",
      excerpt: "Join us for an evening of celebration and fundraising at our Annual Charity Gala.",
      content: "Join us for an evening of celebration and fundraising. This black-tie event will feature live entertainment, auctions, and gourmet dining.",
      category: "events",
      imageUrl: "/images/events/gala.jpg",
      publishedAt: new Date("2025-07-01T00:00:00"),
      endDate: new Date("2025-08-15T23:59:59"),
      featured: true
    },
    {
      title: "Community Health Workshop",
      slug: "community-health-workshop-2025",
      excerpt: "A comprehensive workshop on preventive healthcare, nutrition, and wellness.",
      content: "A comprehensive workshop on preventive healthcare, nutrition, and wellness. Medical professionals will be present for free consultations.",
      category: "events",
      imageUrl: "/images/events/health-workshop.jpg",
      publishedAt: new Date("2025-07-01T00:00:00"),
      endDate: new Date("2025-07-30T23:59:59"),
      featured: false
    },
    {
      title: "Youth Leadership Conference 2025",
      slug: "youth-leadership-conference-2025",
      excerpt: "Empowering the next generation of leaders with keynote speakers and workshops.",
      content: "Empowering the next generation of leaders. Features keynote speakers, leadership workshops, and networking opportunities.",
      category: "events",
      imageUrl: "/images/events/youth-conference.jpg",
      publishedAt: new Date("2025-07-01T00:00:00"),
      endDate: new Date("2025-09-05T23:59:59"),
      featured: true
    }
  ]).onConflictDoUpdate({
    target: blogPosts.slug,
    set: {
      title: sql`excluded.title`,
      excerpt: sql`excluded.excerpt`,
      content: sql`excluded.content`,
      category: sql`excluded.category`,
      imageUrl: sql`excluded.image_url`,
      publishedAt: sql`excluded.published_at`,
      endDate: sql`excluded.end_date`,
      featured: sql`excluded.featured`
    },
  });

  console.log('Blog posts seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error seeding blog posts:', err);
  process.exit(1);
});
