import { db } from './db';
import { donations } from '../shared/schema';

export async function seedDonations() {

  const existingDonations = await db.select().from(donations).limit(1);
  if (existingDonations.length > 0) {
    console.log('Donations already seeded.');
    return;
  }

  console.log('Seeding donations...');
  await db.insert(donations).values([
    {
      amount: 50,
      paymentMethod: 'paypal',
      status: 'completed',
      transactionId: 'PAYPAL_TRANS_1',
      message: 'Thank you for your donation!',
      anonymous: false,
    },
    {
      amount: 2500,
      paymentMethod: 'mpesa',
      status: 'completed',
      transactionId: 'MPESA_TRANS_1',
      anonymous: true,
    },
    {
      amount: 10,
      paymentMethod: 'paypal',
      status: 'pending',
      transactionId: 'PAYPAL_TRANS_2',
      anonymous: false,
    },
    {
      amount: 500,
      paymentMethod: 'mpesa',
      status: 'failed',
      transactionId: 'MPESA_TRANS_2',
      message: 'Donation failed.',
      anonymous: false,
    },
  ]);


  console.log('Donations seeded successfully.');
}
