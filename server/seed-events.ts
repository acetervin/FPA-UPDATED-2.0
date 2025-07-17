import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import * as schema from '../shared/schema';
import { events } from '../shared/schema';
import { sql } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding new events...');

  // Seed Events
  await db.insert(events).values([
    {
      name: "Annual Gala Dinner",
      description: "Join us for our annual fundraising gala dinner",
      imageUrl: "/images/events/gala-dinner.jpg",
      date: new Date("2025-08-15T18:00:00"),
      endDate: new Date("2025-08-15T23:00:00"),
      fee: 5000, // KES
      location: "Grand Hotel Nairobi",
      maxParticipants: 200,
      active: true
    },
    {
      name: "Community Workshop",
      description: "A workshop focused on community development",
      imageUrl: "/images/events/community-workshop.jpg",
      date: new Date("2025-07-30T09:00:00"),
      endDate: new Date("2025-07-30T17:00:00"),
      fee: 1000, // KES
      location: "Community Center",
      maxParticipants: 100,
      active: true
    },
    {
      name: "Youth Leadership Summit",
      description: "Empowering youth through leadership training",
      imageUrl: "/images/events/youth-summit.jpg",
      date: new Date("2025-09-05T10:00:00"),
      endDate: new Date("2025-09-05T16:00:00"),
      fee: 2500, // KES
      location: "Youth Development Center",
      maxParticipants: 150,
      active: true
    },
    {
      name: "Family Fun Day",
      description: "A day of fun activities for the whole family",
      imageUrl: "/images/events/family-fun-day.jpg",
      date: new Date("2025-08-01T08:00:00"),
      endDate: new Date("2025-08-01T18:00:00"),
      fee: 500, // KES
      location: "City Park",
      maxParticipants: 300,
      active: true
    }
  ]).onConflictDoUpdate({
    target: events.name,
    set: {
        description: sql`excluded.description`,
        imageUrl: sql`excluded.image_url`,
        date: sql`excluded.date`,
        endDate: sql`excluded.end_date`,
        location: sql`excluded.location`,
        fee: sql`excluded.fee`,
        maxParticipants: sql`excluded.max_participants`,
        active: sql`excluded.active`
    },
  });

  console.log('New events seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error seeding new events:', err);
  process.exit(1);
});
