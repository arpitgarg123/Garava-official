/**
 * Diagnostic Script for Hostinger SMTP Issues
 * This will test different port/security combinations
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testConfigurations = [
  {
    name: 'Port 587 with STARTTLS (Recommended for Hostinger)',
    config: {
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    }
  },
  {
    name: 'Port 465 with SSL/TLS',
    config: {
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    }
  },
  {
    name: 'Port 25 (Alternative)',
    config: {
      host: 'smtp.hostinger.com',
      port: 25,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    }
  }
];

const diagnose = async () => {
  console.log('🔍 HOSTINGER SMTP DIAGNOSTIC TOOL\n');
  console.log('=' .repeat(60));
  
  // Check credentials
  console.log('\n📋 Checking Environment Variables...');
  const requiredVars = ['SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required variables:', missing.join(', '));
    process.exit(1);
  }
  
  console.log('✅ All required variables present');
  console.log('   User:', process.env.SMTP_USER);
  console.log('   Password:', '***' + process.env.SMTP_PASSWORD?.slice(-4));
  console.log('   From:', process.env.EMAIL_FROM);

  // Test each configuration
  for (const test of testConfigurations) {
    console.log('\n' + '='.repeat(60));
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`   Host: ${test.config.host}`);
    console.log(`   Port: ${test.config.port}`);
    console.log(`   Secure: ${test.config.secure}`);
    console.log(`   User: ${test.config.auth.user}`);
    
    try {
      const transporter = nodemailer.createTransport(test.config);
      
      console.log('\n⏳ Verifying connection...');
      await transporter.verify();
      
      console.log('✅ CONNECTION SUCCESSFUL!');
      console.log('\n🎉 This configuration works! Update your .env:');
      console.log(`   SMTP_PORT=${test.config.port}`);
      console.log(`   SMTP_SECURE="${test.config.secure}"`);
      
      // Try sending a test email
      console.log('\n📧 Attempting to send test email...');
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.SMTP_USER, // Send to yourself
        subject: '✅ Hostinger SMTP Test - SUCCESS',
        html: `
          <h2>Success!</h2>
          <p>Your Hostinger SMTP is working with:</p>
          <ul>
            <li>Port: ${test.config.port}</li>
            <li>Secure: ${test.config.secure}</li>
            <li>Host: ${test.config.host}</li>
          </ul>
          <p>Date: ${new Date().toLocaleString()}</p>
        `
      });
      
      console.log('✅ TEST EMAIL SENT!');
      console.log('   Message ID:', info.messageId);
      console.log('\n✨ ALL TESTS PASSED! Your email is working.');
      console.log('\nUpdate your .env file with the working configuration above.');
      
      process.exit(0);
      
    } catch (error) {
      console.error('❌ FAILED:', error.message);
      
      if (error.code === 'EAUTH') {
        console.log('   Issue: Authentication failed');
        console.log('   Possible causes:');
        console.log('   1. Wrong email address or password');
        console.log('   2. Email account not properly set up in Hostinger');
        console.log('   3. Need to enable "Allow less secure apps" in Hostinger');
      } else if (error.code === 'ECONNECTION') {
        console.log('   Issue: Connection failed');
        console.log('   Possible causes:');
        console.log('   1. Port blocked by firewall');
        console.log('   2. Wrong SMTP host');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('   Issue: Connection timeout');
        console.log('   Possible causes:');
        console.log('   1. Port blocked');
        console.log('   2. Network/firewall issue');
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n❌ All configurations failed.');
  console.log('\n💡 TROUBLESHOOTING STEPS:');
  console.log('\n1. Verify Hostinger Email Account:');
  console.log('   - Log in to Hostinger control panel');
  console.log('   - Go to Emails → Email Accounts');
  console.log('   - Verify info@garava.in exists and is active');
  console.log('   - Try resetting the password');
  
  console.log('\n2. Check Email Settings in Hostinger:');
  console.log('   - Make sure email account is fully set up');
  console.log('   - Check if there are any authentication restrictions');
  console.log('   - Look for "Allow external apps" or similar setting');
  
  console.log('\n3. Try Webmail Login:');
  console.log('   - Go to https://webmail.hostinger.com');
  console.log('   - Try logging in with info@garava.in and your password');
  console.log('   - If webmail login fails, reset password in Hostinger');
  
  console.log('\n4. Contact Hostinger Support:');
  console.log('   - They can verify SMTP settings');
  console.log('   - Ask about SMTP authentication requirements');
  console.log('   - Request correct SMTP host/port for your account');
  
  console.log('\n5. Alternative SMTP Hosts to Try:');
  console.log('   - smtp.hostinger.com (standard)');
  console.log('   - mail.garava.in (if custom)');
  console.log('   - Check Hostinger docs for your specific host');
  
  process.exit(1);
};

diagnose();
