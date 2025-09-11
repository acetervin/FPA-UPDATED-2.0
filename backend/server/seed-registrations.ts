import { db } from './db';
import { eventRegistrations, events } from '../shared/schema';

export async function seedRegistrations() {
  const existingRegistrations = await db.select().from(eventRegistrations).limit(1);
  if (existingRegistrations.length > 0) {
    console.log('Event registrations already seeded.');
    return;
  }

  const allEvents = await db.select().from(events);
  if (allEvents.length === 0) {
    console.log('No events found to seed registrations for.');
    return;
  }

  console.log('Seeding event registrations...');

  const registrationsToSeed = allEvents.flatMap(event => ([
    {
      eventId: event.id,
      registrationType: 'individual',
      firstName: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      paymentStatus: 'completed',
      amount: event.fee,
    },
    {
      eventId: event.id,
      registrationType: 'individual',
      firstName: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
      paymentStatus: 'pending',
      amount: event.fee,
    },
  ]));

  if (registrationsToSeed.length > 0) {
    await db.insert(eventRegistrations).values(registrationsToSeed);
  }

  console.log('Event registrations seeded successfully.');
}
