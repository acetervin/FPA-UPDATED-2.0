# PayPal Testing Configuration

## Sandbox Accounts
1. Business Account (Receiving payments)
   - Email: your_business_sandbox@business.example.com
   - Client ID: your_sandbox_client_id
   - Secret: your_sandbox_secret

2. Personal Account (Making payments)
   - Email: your_personal_sandbox@personal.example.com
   - Password: your_sandbox_password

## Test Cards
1. Visa
   - Number: 4032039832099830
   - Expiry: Any future date
   - CVV: Any 3 digits

2. Mastercard
   - Number: 5453010000064154
   - Expiry: Any future date
   - CVV: Any 3 digits

## Testing Scenarios
1. Successful Subscription
   - Use Personal Account
   - Complete payment flow
   - Expected: Subscription created, webhook received

2. Failed Payment
   - Use card number: 4000000000000002
   - Expected: Payment declined

3. Subscription Cancellation
   - Cancel active subscription
   - Expected: Webhook received, status updated

4. Payment Retry
   - Use card that fails first attempt
   - Update card details
   - Expected: Payment successful on retry
