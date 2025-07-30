// Simple PayPal configuration checker
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('=== PayPal Configuration Check ===\n');

// Check for .env file
try {
  const envPath = join(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf8');
  console.log('✅ .env file found');
  
  // Parse and check PayPal variables
  const lines = envContent.split('\n');
  const paypalVars = lines.filter(line => 
    line.includes('PAYPAL_') && !line.trim().startsWith('#')
  );
  
  if (paypalVars.length > 0) {
    console.log('\n📋 PayPal Environment Variables:');
    paypalVars.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        const maskedValue = key.includes('SECRET') ? '***masked***' : value;
        console.log(`  ${key}=${maskedValue}`);
      }
    });
  } else {
    console.log('❌ No PayPal variables found in .env');
  }
} catch (error) {
  console.log('❌ .env file not found');
}

// Check process.env for PayPal variables
console.log('\n🔍 Process Environment PayPal Variables:');
const envVars = Object.keys(process.env);
const paypalEnvVars = envVars.filter(key => key.startsWith('PAYPAL_'));

if (paypalEnvVars.length > 0) {
  paypalEnvVars.forEach(key => {
    const value = process.env[key];
    const maskedValue = key.includes('SECRET') ? '***masked***' : value;
    console.log(`  ${key}=${maskedValue}`);
  });
} else {
  console.log('  ❌ No PayPal variables in process.env');
}

// Check required variables
console.log('\n🔧 Required PayPal Variables Status:');
const requiredVars = [
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'PAYPAL_API_URL'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ Present' : '❌ Missing';
  console.log(`  ${varName}: ${status}`);
});

console.log('\n=== End Configuration Check ===');
