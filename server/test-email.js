/**
 * Test Script for Hostinger SMTP Email Configuration
 * Run this to verify your email setup is working correctly
 * 
 * Usage: node test-email.js
 */

import dotenv from 'dotenv';
import { sendEmail } from './src/config/email.js';

dotenv.config();

const testEmailSetup = async () => {
  console.log('🧪 Testing Hostinger SMTP Email Configuration...\n');
  
  // Display configuration (hide password)
  console.log('📧 SMTP Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  Secure:', process.env.SMTP_SECURE);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  Password:', process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
  console.log('  From:', process.env.EMAIL_FROM);
  console.log('');

  // Check required env vars
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('\nPlease update your .env file with Hostinger SMTP credentials.');
    process.exit(1);
  }

  // Prompt for test recipient
  const testRecipient = process.env.TEST_EMAIL || process.env.SMTP_USER;
  
  console.log(`📮 Sending test email to: ${testRecipient}\n`);

  try {
    const result = await sendEmail({
      to: testRecipient,
      subject: '✅ Test Email from Garava - Hostinger SMTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">🎉 Email Configuration Successful!</h1>
          <p>Congratulations! Your Hostinger SMTP email configuration is working correctly.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📊 Configuration Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li>✅ SMTP Host: ${process.env.SMTP_HOST}</li>
              <li>✅ SMTP Port: ${process.env.SMTP_PORT}</li>
              <li>✅ Sender: ${process.env.EMAIL_FROM}</li>
              <li>✅ Date: ${new Date().toLocaleString()}</li>
            </ul>
          </div>

          <p><strong>What's next?</strong></p>
          <ul>
            <li>Your application can now send emails</li>
            <li>Test user registration to verify verification emails</li>
            <li>Test password reset functionality</li>
            <li>Test contact form submissions</li>
          </ul>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated test email from your Garava application.<br>
            You can safely delete this email.
          </p>
        </div>
      `,
    });

    console.log('✅ SUCCESS! Email sent successfully');
    console.log('📧 Message ID:', result.id);
    console.log('\nNext steps:');
    console.log('1. Check your inbox at:', testRecipient);
    console.log('2. Check spam/junk folder if not in inbox');
    console.log('3. Log in to Hostinger webmail to see the sent email');
    console.log('\n🎉 Your email setup is complete and working!');
    
  } catch (error) {
    console.error('\n❌ FAILED! Error sending email:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Tip: Check your SMTP_USER and SMTP_PASSWORD');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Tip: Check SMTP_HOST and SMTP_PORT, verify internet connection');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Tip: Port might be blocked by firewall, try port 587 with SMTP_SECURE=false');
    }
    
    console.log('\nSee HOSTINGER_EMAIL_SETUP.md for troubleshooting help.');
    process.exit(1);
  }
};

// Run the test
testEmailSetup();
