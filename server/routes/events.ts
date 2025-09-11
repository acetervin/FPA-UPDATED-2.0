import { Router } from 'express';
import { db } from '../db.js';
import { events, blogPosts } from '../../shared/schema';
import { asc, desc, gte, and, eq } from 'drizzle-orm';


const router = Router();

router.get('/latest', async (req, res, next) => {
  try {
    const latestEvent = await db
      .select()
      .from(events)
      .where(gte(events.date, new Date()))
      .orderBy(desc(events.date))
      .limit(1);

    if (latestEvent.length === 0) {
      return res.status(404).json({ message: 'No upcoming events found' });
    }

    res.json(latestEvent[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/featured-active', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const featuredEvents = await db
      .select()
      .from(events)
      .innerJoin(blogPosts, eq(events.name, blogPosts.title))
      .where(
        and(
          eq(blogPosts.featured, true),
          eq(events.active, true),
          gte(events.endDate, today)
        )
      )
      .orderBy(asc(events.date));


    res.json(featuredEvents);
  } catch (error) {
    console.error('Error fetching featured active events:', error);
    next(error);
  }
});


export default router;
