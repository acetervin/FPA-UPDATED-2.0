#!/usr/bin/env node
/**
 * PayPal Diagnostic Script
 * Run this to check your PayPal configuration and identify issues
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 PayPal Diagnostic Check');
console.log('=========================\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
const requiredEnvVars = [
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET', 
  'PAYPAL_API_URL'
];

const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file not found');
}

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${envVar.includes('SECRET') ? '***' + value.slice(-4) : value}`);
  } else {
    console.log(`❌ ${envVar}: MISSING`);
  }
});

console.log('\n🔧 Configuration Recommendations:');
console.log('=================================');

if (!process.env.PAYPAL_CLIENT_ID) {
  console.log('1. Add PAYPAL_CLIENT_ID to your .env file');
  console.log('   Example: PAYPAL_CLIENT_ID=your_client_id_here');
}

if (!process.env.PAYPAL_CLIENT_SECRET) {
  console.log('2. Add PAYPAL_CLIENT_SECRET to your .env file');
  console.log('   Example: PAYPAL_CLIENT_SECRET=your_client_secret_here');
}

if (!process.env.PAYPAL_API_URL) {
  console.log('3. Add PAYPAL_API_URL to your .env file');
  console.log('   Sandbox: PAYPAL_API_URL=https://api-m.sandbox.paypal.com');
  console.log('   Production: PAYPAL_API_URL=https://api-m.paypal.com');
}

console.log('\n🧪 Testing Endpoints:');
console.log('===================');
console.log('Visit these URLs in your browser to test:');
console.log('• http://localhost:3000/api/paypal/debug');
console.log('• http://localhost:3000/api/paypal/test');

console.log('\n📱 Browser Console Commands:');
console.log('============================');
console.log('1. Open browser console (F12)');
console.log('2. Try a PayPal donation');
console.log('3. Look for detailed error messages');

console.log('\n📝 Common Issues:');
console.log('================');
console.log('• Missing .env file');
console.log('• Invalid PayPal credentials');
console.log('• Wrong API URL (sandbox vs production)');
console.log('• Amount formatting issues');
console.log('• Network connectivity problems');

console.log('\n✨ Next Steps:');
console.log('==============');
console.log('1. Check the debug endpoint above');
console.log('2. Look at browser console for specific errors');
console.log('3. Verify your PayPal app settings in PayPal Developer Dashboard');
console.log('4. Ensure your PayPal app is approved for live transactions');
