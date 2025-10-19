const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 9000;

// GitHub webhook secret - CHANGE THIS!
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your-super-secret-webhook-key';

// Path to deploy script
const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.sh');

app.use(express.json());

// Health check endpoint
app.get('/webhook', (req, res) => {
  res.json({ status: 'Webhook server is running', timestamp: new Date().toISOString() });
});

// GitHub webhook endpoint
app.post('/webhook', (req, res) => {
  // Verify GitHub signature
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.log('❌ No signature provided');
    return res.status(401).send('No signature');
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    console.log('❌ Invalid signature');
    return res.status(401).send('Invalid signature');
  }

  // Check if it's a push event to main branch
  const event = req.headers['x-github-event'];
  const branch = req.body.ref?.replace('refs/heads/', '');

  console.log(`📨 Received ${event} event for branch ${branch}`);

  if (event !== 'push' || branch !== 'main') {
    console.log('ℹ️  Ignoring non-push or non-main branch event');
    return res.status(200).send('Event ignored');
  }

  console.log('🚀 Triggering deployment...');

  // Execute deploy script
  exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Deployment error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️  Deployment stderr: ${stderr}`);
    }
    console.log(`✅ Deployment output:\n${stdout}`);
  });

  res.status(200).send('Deployment triggered');
});

// Start server
app.listen(PORT, () => {
  console.log(`🔗 Webhook server listening on port ${PORT}`);
  console.log(`📍 Endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🔐 Secret configured: ${WEBHOOK_SECRET.substring(0, 5)}...`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down webhook server...');
  process.exit(0);
});
