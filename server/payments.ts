import { Request, Response } from 'express';
import axios from 'axios';
import { db } from './db';
import { eventRegistrations, events } from '@shared/schema';
import { sql } from 'drizzle-orm';

// Pesapal configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY as string;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET as string;
const PESAPAL_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/v3';

interface PaymentRequest {
  fullName: string;
  email: string;
  phone: string;
  eventName: string;
  amount: number;
}

export async function initiatePayment(req: Request, res: Response) {
  try {
    const { eventId, registrationType, individual, organization, amount } = req.body;

    // Verify event exists and is active
    const event = await db.select().from(events)
      .where(sql`${events.id} = ${eventId} AND ${events.active} = true`)
      .limit(1);

    if (!event.length) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Get auth token from Pesapal
    const authToken = await getPesapalAuthToken();

    // Create registration record
    const [registration] = await db.insert(eventRegistrations).values({
      eventId: eventId,
      registrationType: registrationType,
      firstName: individual?.firstName,
      middleName: individual?.middleName,
      surname: individual?.surname,
      organizationName: organization?.organizationName,
      organizationEmail: organization?.organizationEmail,
      representativeName: organization?.representativeName,
      role: organization?.role,
      email: registrationType === 'individual' ? individual?.email : organization?.organizationEmail,
      phone: registrationType === 'individual' ? individual?.phone : organization?.phone,
      amount: amount,
      paymentStatus: 'pending'
    }).returning();

    // Create payment request
    const paymentRequest = {
      id: `EVT-${registration.id}-${Date.now()}`,
      currency: "KES",
      amount: amount,
      description: `Event Registration for date: ${new Date(event[0].date).toLocaleDateString()}`,
      callback_url: `${process.env.APP_URL}/api/payments/callback`,
      notification_id: `NOTIFY-${registration.id}`,
      billing_address: {
        email_address: registration.email,
        phone_number: registration.phone,
        country_code: "KE",
        first_name: registrationType === 'individual' 
          ? individual?.firstName 
          : organization?.representativeName?.split(' ')[0] || '',
        last_name: registrationType === 'individual'
          ? `${individual?.surname} ${individual?.middleName}`.trim()
          : organization?.representativeName?.split(' ').slice(1).join(' ') || '',
      }
    };

    // Submit order to Pesapal
    const response = await axios.post(
      `${PESAPAL_API_URL}/orders`,
      paymentRequest,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Store the payment request in your database here
    // TODO: Add database storage logic

    res.json({
      success: true,
      paymentUrl: response.data.redirect_url,
      orderId: paymentRequest.id
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate payment'
    });
  }
}

async function getPesapalAuthToken() {
  try {
    const response = await axios({
      method: 'post',
      url: `${PESAPAL_API_URL}/api/Auth/RequestToken`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      },
    });

    return response.data.token;
  } catch (error) {
    console.error('Error getting Pesapal auth token:', error);
    throw new Error('Failed to get Pesapal auth token');
  }
}


export async function handlePaymentCallback(req: Request, res: Response) {
  const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = req.query;

  try {
    // Verify payment status
    const authToken = await getPesapalAuthToken();
    const response = await axios.get(
      `${PESAPAL_API_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );

    // Update the payment status in your database here
    // TODO: Add database update logic

    // Redirect user to appropriate page based on payment status
    if (response.data.payment_status_description === 'Completed') {
      res.redirect('/payment-success');
    } else {
      res.redirect('/payment-failed');
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    res.redirect('/payment-failed');
  }
}
