import axios from 'axios';
import { Buffer } from 'buffer';

interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passKey: string;
  callbackUrl: string;
  env: 'sandbox' | 'production';
}

class MPesaService {
  private config: MPesaConfig;
  private baseUrl: string;
  private auth = '';
  private authExpiry: number = 0;

  constructor(config: MPesaConfig) {
    this.config = config;
    this.baseUrl = config.env === 'sandbox' 
      ? 'https://sandbox.safaricom.co.ke' 
      : 'https://api.safaricom.co.ke';
  }

  private async getAuthToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.auth && Date.now() < this.authExpiry) {
      return this.auth;
    }

    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const token = response.data.access_token;
      if (!token) {
        throw new Error('No access token received from M-Pesa');
      }

      this.auth = token;
      // Token expires in 1 hour, we'll cache it for 59 minutes
      this.authExpiry = Date.now() + (59 * 60 * 1000);
      
      return this.auth;
    } catch (error) {
      console.error('Error getting M-Pesa auth token:', error);
      throw new Error('Failed to get M-Pesa authentication token');
    }
  }

  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(timestamp: string): string {
    const str = this.config.shortCode + this.config.passKey + timestamp;
    return Buffer.from(str).toString('base64');
  }

  public async initiateSTKPush(phoneNumber: string, amount: number, accountReference: string, transactionDesc: string) {
    try {
      const token = await this.getAuthToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      // Format phone number (remove leading 0 or +254)
      const formattedPhone = phoneNumber.replace(/^(0|\+254)/, '254');

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.config.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: this.config.shortCode,
          PhoneNumber: formattedPhone,
          CallBackURL: this.config.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating STK push:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  public async checkTransactionStatus(checkoutRequestId: string) {
    try {
      const token = await this.getAuthToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.config.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error checking transaction status:', error);
      throw new Error('Failed to check M-Pesa transaction status');
    }
  }
}

export default MPesaService;
