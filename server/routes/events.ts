import { Router } from 'express';
import { db } from '../db.js';
import { events } from '../../shared/schema.js';
import { desc, gte } from 'drizzle-orm';

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

export default router;
