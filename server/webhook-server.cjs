/* eslint-disable no-console */
const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

// Load from repo root where symlink exists
const envPath = path.join(__dirname, '..', '.env');
console.log('[DEBUG] Loading .env from:', envPath);
const dotenvResult = require('dotenv').config({ path: envPath });

if (dotenvResult.error) {
  console.error('[ERROR] Failed to load .env:', dotenvResult.error);
  process.exit(1);
}

console.log('[DEBUG] .env loaded successfully');
console.log('[DEBUG] GITHUB_WEBHOOK_SECRET exists:', !!process.env.GITHUB_WEBHOOK_SECRET);
console.log('[DEBUG] GITHUB_WEBHOOK_SECRET length:', process.env.GITHUB_WEBHOOK_SECRET?.length || 0);

const app = express();
const PORT = process.env.PORT || 9000;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET || WEBHOOK_SECRET === 'change-this-secret') {
  console.error('[ERROR] GITHUB_WEBHOOK_SECRET not configured properly!');
  process.exit(1);
}

// We need the raw body for signature verification
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health check
app.get('/webhook', (_req, res) => {
  res.json({ status: 'Webhook server is running', timestamp: new Date().toISOString() });
});

// GitHub webhook
app.post('/webhook', (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
      console.log('No signature provided');
      return res.status(401).send('No signature');
    }

    // Compute HMAC on raw body
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    // Debug logging
    console.log('GitHub signature:', signature);
    console.log('Computed digest:', digest);
    console.log('Secret length:', WEBHOOK_SECRET.length);
    console.log('Body length:', req.rawBody ? req.rawBody.length : 'undefined');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      console.log('Invalid signature');
      return res.status(401).send('Invalid signature');
    }

    const event = req.headers['x-github-event'];
    const branch = req.body?.ref?.replace('refs/heads/', '');
    console.log(`Received ${event} on branch ${branch}`);

    if (event !== 'push' || branch !== 'main') {
      return res.status(200).send('Event ignored');
    }

    console.log('Triggering deployment...');

    // Deploy script lives at repo root
    const DEPLOY_SCRIPT = path.join(__dirname, '..', 'deploy.sh');
    exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Deployment error: ${error.message}`);
        return;
      }
      if (stderr) console.error(`Deployment stderr: ${stderr}`);
      console.log(`Deployment output:\n${stdout}`);
    });

    res.status(200).send('Deployment triggered');
  } catch (e) {
    console.error('Webhook error:', e);
    res.status(500).send('Internal error');
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on ${PORT}`);
  console.log(`Secret configured: ${WEBHOOK_SECRET ? 'yes' : 'no'}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down webhook server...');
  process.exit(0);
});
