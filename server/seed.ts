import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import * as schema from '../shared/schema';
import { blogPosts, teamMembers, causes } from '../shared/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(blogPosts);
  await db.delete(teamMembers);
  await db.delete(causes);

  // Seed Blog Posts
  await db.insert(blogPosts).values([
    {
      title: 'The Importance of Clean Water',
      slug: 'importance-of-clean-water',
      excerpt: 'Discover why access to clean water is a fundamental human right and how it impacts communities.',
      content: 'Detailed content about clean water...',
      category: 'Health',
      imageUrl: '/images/blog/water.jpg',
      publishedAt: new Date('2023-01-15'),
      featured: true,
    },
    {
      title: "Empowering Youth Through Education",
      slug: "empowering-youth-through-education",
      excerpt: "Education is a powerful tool for breaking the cycle of poverty. Learn about our educational programs.",
      content: "In-depth article on youth education programs, success stories, and future plans.",
      category: "Education",
      imageUrl: "/images/blog/education.jpg",
      publishedAt: new Date("2023-02-20"),
      featured: false,
    },
    {
      title: "Sustainable Agriculture for a Better Future",
      slug: "sustainable-agriculture-for-a-better-future",
      excerpt: "Our efforts in promoting sustainable farming practices to ensure food security and protect the environment.",
      content: "A comprehensive look at our sustainable agriculture projects, their impact, and how you can get involved.",
      category: "Environment",
      imageUrl: "/images/blog/agriculture.jpg",
      publishedAt: new Date("2023-03-10"),
      featured: true,
    },
    {
      title: "Healthcare for All: A Basic Human Right",
      slug: "healthcare-for-all-a-basic-human-right",
      excerpt: "An overview of our healthcare initiatives aimed at providing medical access to underserved communities.",
      content: "Details about our mobile clinics, vaccination drives, and partnerships with local health centers.",
      category: "Health",
      imageUrl: "/images/blog/healthcare.jpg",
      publishedAt: new Date("2023-04-05"),
      featured: false,
    },
    {
      title: "Women's Empowerment: Driving Change",
      slug: "womens-empowerment-driving-change",
      excerpt: "Highlighting our programs that support women's economic and social empowerment.",
      content: "Stories of women who have transformed their lives through our vocational training and micro-loan programs.",
      category: "Empowerment",
      imageUrl: "/images/blog/women-empowerment.jpg",
      publishedAt: new Date("2023-05-12"),
      featured: true,
    },
    {
      title: "Disaster Relief: Rebuilding Communities",
      slug: "disaster-relief-rebuilding-communities",
      excerpt: "A look at our rapid response and long-term recovery efforts in disaster-stricken areas.",
      content: "An account of our recent disaster relief operations, the challenges faced, and the resilience of communities.",
      category: "Relief",
      imageUrl: "/images/blog/disaster-relief.jpg",
      publishedAt: new Date("2023-06-22"),
      featured: false,
    },
    {
      title: "Upcoming Community Workshop",
      slug: "upcoming-community-workshop",
      excerpt: "Join us for a workshop on community building and sustainable practices.",
      content: "Detailed information about the workshop, including speakers, schedule, and registration details.",
      category: "events",
      imageUrl: "/images/blog/workshop.jpg",
      publishedAt: new Date("2023-07-15"),
      endDate: new Date("2023-07-20"), // Example end date for event
      featured: false,
    }
  ]);

  // Seed Team Members
  await db.insert(teamMembers).values([
    {
      name: 'Jane Doe',
      slug: 'jane-doe',
      position: 'Founder & CEO',
      bio: 'Jane has over 20 years of experience in the non-profit sector...',
      imageUrl: '/images/team/jane.jpg',
      email: 'jane.doe@example.com',
      linkedin: 'https://www.linkedin.com/in/janedoe',
      specialties: ['Leadership', 'Fundraising'],
    },
    {
        name: "John Smith",
        slug: "john-smith",
        position: "Chief Operating Officer",
        bio: "John is responsible for the day-to-day operations and ensuring our programs run smoothly.",
        imageUrl: "/images/team/john.jpg",
        email: "john.smith@example.com",
        linkedin: "https://www.linkedin.com/in/johnsmith",
        specialties: ["Operations", "Logistics", "Program Management"],
      },

      {
        name: "Emily White",
        slug: "emily-white",
        position: "Director of Programs",
        bio: "Emily designs and oversees all our community programs, ensuring they meet the needs of those we serve.",
        imageUrl: "/images/team/emily.jpg",
        email: "emily.white@example.com",
        linkedin: "https://www.linkedin.com/in/emilywhite",
        specialties: ["Program Design", "Community Outreach", "Impact Assessment"],
      },

      {
        name: "Michael Brown",
        slug: "michael-brown",
        position: "Chief Financial Officer",
        bio: "Michael manages our finances, ensuring every donation is used effectively and transparently.",
        imageUrl: "/images/team/michael.jpg",
        email: "michael.brown@example.com",
        linkedin: "https://www.linkedin.com/in/michaelbrown",
        specialties: ["Financial Management", "Compliance", "Strategic Planning"],
      },

      {
        name: "Sarah Green",
        slug: "sarah-green",
        position: "Marketing and Communications Manager",
        bio: "Sarah is the voice of our organization, sharing our stories and impact with the world.",
        imageUrl: "/images/team/sarah.jpg",
        email: "sarah.green@example.com",
        linkedin: "https://www.linkedin.com/in/sarahgreen",
        specialties: ["Digital Marketing", "Public Relations", "Content Creation"],
      },

      {
        name: "David Black",
        slug: "david-black",
        position: "Volunteer Coordinator",
        bio: "David recruits, trains, and manages our dedicated team of volunteers.",
        imageUrl: "/images/team/david.jpg",
        email: "david.black@example.com",
        linkedin: "https://www.linkedin.com/in/davidblack",
        specialties: ["Volunteer Management", "Training & Development", "Community Engagement"],
      }

  ]);

  // Seed Causes
  await db.insert(causes).values([
    {
      title: 'Build a School in Africa',
      slug: 'build-a-school-in-africa',
      description: 'Help us build a school for 200 children in a remote village.',
      fullDescription: 'Detailed description of the school project...',
      imageUrl: '/images/causes/school.jpg',
      goalAmount: 50000,
      raisedAmount: 12000,
      volunteersNeeded: 20,
      active: true,
    },
    {
        title: "Provide Clean Water to a Village",
        slug: "provide-clean-water-to-a-village",
        description: "Fund the construction of a well to provide clean and safe drinking water.",
        fullDescription: "In-depth details about the water well project, including location, community impact, and technology used.",
        imageUrl: "/images/causes/water-well.jpg",
        goalAmount: 15000,
        raisedAmount: 7500,
        volunteersNeeded: 10,
        active: true,
      },

      {
        title: "Sponsor a Child's Education",
        slug: "sponsor-a-childs-education",
        description: "Provide a child with school supplies, uniforms, and tuition for a year.",
        fullDescription: "Information about the sponsorship program, the children it benefits, and how you can connect with your sponsored child.",
        imageUrl: "/images/causes/sponsor-child.jpg",
        goalAmount: 300,
        raisedAmount: 150,
        volunteersNeeded: 0,
        active: true,
      },

      {
        title: "Support a Mobile Health Clinic",
        slug: "support-a-mobile-health-clinic",
        description: "Help us bring essential medical services to remote and underserved areas.",
        fullDescription: "Details about the mobile clinic's services, the areas it covers, and the impact it has on community health.",
        imageUrl: "/images/causes/health-clinic.jpg",
        goalAmount: 25000,
        raisedAmount: 10000,
        volunteersNeeded: 5,
        active: true,
      },

      {
        title: "Fund a Women's Empowerment Workshop",
        slug: "fund-a-womens-empowerment-workshop",
        description: "Empower women with skills and knowledge to start their own businesses.",
        fullDescription: "An overview of the workshop curriculum, the trainers, and the expected outcomes for the participants.",
        imageUrl: "/images/causes/women-workshop.jpg",
        goalAmount: 5000,
        raisedAmount: 2000,
        volunteersNeeded: 2,
        active: false,
      },

      {
        title: "Plant Trees to Combat Deforestation",
        slug: "plant-trees-to-combat-deforestation",
        description: "Join our efforts to reforest areas and combat climate change.",
        fullDescription: "Information about the tree planting project, the types of trees being planted, and the long-term environmental benefits.",
        imageUrl: "/images/causes/plant-trees.jpg",
        goalAmount: 10000,
        raisedAmount: 8000,
        volunteersNeeded: 50,
        active: true,
      }

  ]);

  console.log('Database seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
