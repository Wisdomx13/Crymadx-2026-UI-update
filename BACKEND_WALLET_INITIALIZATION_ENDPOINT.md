# Backend Wallet Initialization Endpoint

## Overview

This document contains the backend code needed to support automatic wallet initialization for users who are missing wallets. The frontend has been updated to call these endpoints on login and when users manually request wallet creation.

## Required Backend Changes

### 1. Add New Route to user-service (or api-gateway)

Add the following endpoint to handle wallet initialization requests:

**File: `/opt/crymadx/services/user-service/routes/wallets.js`** (create if doesn't exist)

```javascript
const express = require('express');
const router = express.Router();
const amqp = require('amqplib');
const { authenticateToken } = require('../middleware/auth');

// Expected wallet chains
const EXPECTED_CHAINS = ['eth', 'sol', 'btc', 'ltc', 'doge', 'xrp', 'xlm', 'bnb', 'trx'];

// RabbitMQ connection string (from .env)
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://crymadx:CryM4dX_R4bb1t_2025!@127.0.0.1:5672';

/**
 * POST /api/user/wallets/initialize
 * Initialize missing wallets for the authenticated user
 */
router.post('/initialize', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;

    console.log(`[WalletInit] Initializing wallets for user: ${userId}`);

    // Get existing wallets from database
    const existingWallets = await getUserWallets(userId);
    const existingChains = existingWallets.map(w => w.chain.toLowerCase());

    // Find missing chains
    const missingChains = EXPECTED_CHAINS.filter(chain => !existingChains.includes(chain));

    if (missingChains.length === 0) {
      return res.json({
        message: 'All wallets already exist',
        queued: [],
        alreadyExists: existingChains
      });
    }

    console.log(`[WalletInit] Missing chains for user ${userId}:`, missingChains);

    // Queue wallet creation message to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue('wallet.create', { durable: true });

    // Send wallet creation message
    const message = {
      userId,
      email: userEmail,
      chains: missingChains,
      timestamp: new Date().toISOString(),
      source: 'wallet-initialization'
    };

    channel.sendToQueue('wallet.create', Buffer.from(JSON.stringify(message)), {
      persistent: true
    });

    console.log(`[WalletInit] Queued wallet creation for chains:`, missingChains);

    await channel.close();
    await connection.close();

    res.json({
      message: 'Wallet creation queued',
      queued: missingChains,
      alreadyExists: existingChains
    });

  } catch (error) {
    console.error('[WalletInit] Error:', error);
    res.status(500).json({
      error: 'Failed to initialize wallets',
      details: error.message
    });
  }
});

/**
 * GET /api/user/wallets/status
 * Get wallet creation status for the authenticated user
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingWallets = await getUserWallets(userId);
    const existingChains = existingWallets.map(w => w.chain.toLowerCase());
    const missingChains = EXPECTED_CHAINS.filter(chain => !existingChains.includes(chain));

    res.json({
      totalExpected: EXPECTED_CHAINS.length,
      created: existingChains.length,
      missing: missingChains,
      wallets: existingWallets
    });

  } catch (error) {
    console.error('[WalletStatus] Error:', error);
    res.status(500).json({
      error: 'Failed to get wallet status',
      details: error.message
    });
  }
});

// Helper function to get user wallets from database
async function getUserWallets(userId) {
  // This should query your Supabase/MongoDB database
  // Example for Supabase:
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('user_wallets')
    .select('chain, address, wallet_id, provider, memo, tag, created_at')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

module.exports = router;
```

### 2. Register the Route in API Gateway

**File: `/opt/crymadx/services/api-gateway/index.js`**

Add near other route registrations:

```javascript
// Wallet initialization routes
const walletRoutes = require('./routes/wallets');
app.use('/api/user/wallets', walletRoutes);
```

Or proxy to user-service:

```javascript
// Proxy wallet routes to user-service
app.use('/api/user/wallets', authenticateToken, proxy('http://127.0.0.1:3002/api/user/wallets'));
```

### 3. Update wallet-creation-service to Handle Re-initialization

**File: `/opt/crymadx/services/wallet-creation-service/worker.js`**

Update the message handler to support partial wallet creation:

```javascript
async function processWalletCreation(message) {
  const { userId, email, chains, source } = JSON.parse(message.content.toString());

  console.log(`[WalletCreation] Processing for user: ${userId}`);
  console.log(`[WalletCreation] Requested chains:`, chains);
  console.log(`[WalletCreation] Source:`, source || 'registration');

  const results = {
    success: [],
    failed: []
  };

  // Determine which wallets to create
  const chainsToCreate = chains || EXPECTED_CHAINS;

  // Group chains by provider
  const circleEvmChains = chainsToCreate.filter(c => ['eth'].includes(c));
  const circleSolChains = chainsToCreate.filter(c => ['sol'].includes(c));
  const tatumChains = chainsToCreate.filter(c => ['btc', 'ltc', 'doge', 'xrp', 'xlm', 'bnb', 'trx'].includes(c));

  // Create Circle EVM wallet (if needed)
  if (circleEvmChains.length > 0) {
    try {
      const evmWallet = await createCircleEvmWallet(userId);
      await saveWallet(userId, 'eth', evmWallet.address, evmWallet.walletId, 'circle');
      results.success.push('eth');
      console.log(`[WalletCreation] Created EVM wallet for user ${userId}`);
    } catch (error) {
      console.error(`[WalletCreation] Failed to create EVM wallet:`, error.message);
      results.failed.push({ chain: 'eth', error: error.message });
    }
  }

  // Create Circle Solana wallet (if needed)
  if (circleSolChains.length > 0) {
    try {
      const solWallet = await createCircleSolanaWallet(userId);
      await saveWallet(userId, 'sol', solWallet.address, solWallet.walletId, 'circle');
      results.success.push('sol');
      console.log(`[WalletCreation] Created Solana wallet for user ${userId}`);
    } catch (error) {
      console.error(`[WalletCreation] Failed to create Solana wallet:`, error.message);
      results.failed.push({ chain: 'sol', error: error.message });
    }
  }

  // Create Tatum wallets (if needed)
  for (const chain of tatumChains) {
    try {
      const wallet = await createTatumWallet(userId, chain);
      await saveWallet(userId, chain, wallet.address, wallet.walletId, 'tatum', wallet.memo, wallet.tag);
      results.success.push(chain);
      console.log(`[WalletCreation] Created ${chain.toUpperCase()} wallet for user ${userId}`);
    } catch (error) {
      console.error(`[WalletCreation] Failed to create ${chain} wallet:`, error.message);
      results.failed.push({ chain, error: error.message });
    }
  }

  console.log(`[WalletCreation] Completed for user ${userId}:`, results);
  return results;
}
```

## Deployment Steps

1. SSH into the backend server:
   ```bash
   ssh root@91.99.210.172
   ```

2. Create/update the wallet routes file:
   ```bash
   nano /opt/crymadx/services/user-service/routes/wallets.js
   # Paste the code from section 1
   ```

3. Update user-service index.js to include the route:
   ```bash
   nano /opt/crymadx/services/user-service/index.js
   # Add: const walletRoutes = require('./routes/wallets');
   # Add: app.use('/wallets', walletRoutes);
   ```

4. Update wallet-creation-service worker:
   ```bash
   nano /opt/crymadx/services/wallet-creation-service/worker.js
   # Update message handler to support partial creation
   ```

5. Restart services:
   ```bash
   systemctl restart crymadx-user-service
   systemctl restart crymadx-wallet-creation-service
   systemctl restart crymadx-api-gateway
   ```

6. Test the endpoint:
   ```bash
   curl -X POST https://backend.crymadx.io/api/user/wallets/initialize \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json"
   ```

## Debugging Missing Wallet Creation

If wallets weren't created during registration, check:

1. **RabbitMQ queue status:**
   ```bash
   docker exec crymadx-rabbitmq rabbitmqctl list_queues name messages
   ```

2. **Wallet creation service logs:**
   ```bash
   journalctl -u crymadx-wallet-creation-service -f
   ```

3. **Circle API status:**
   ```bash
   curl https://api.circle.com/v1/status
   ```

4. **Tatum API status:**
   ```bash
   curl https://api.tatum.io/v3/status
   ```

5. **Database wallet records:**
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM user_wallets WHERE user_id = 'YOUR_USER_ID';
   ```

## Common Issues

1. **Circle API rate limiting** - Circle has rate limits that may cause wallet creation to fail for multiple users registering simultaneously.

2. **Tatum API errors** - Tatum sometimes returns transient errors. The worker should implement retry logic.

3. **RabbitMQ message loss** - If RabbitMQ restarts, messages may be lost. Consider using persistent messages and dead-letter queues.

4. **Database connection issues** - Supabase connection pool may be exhausted during high traffic.

## Frontend Integration

The frontend has been updated to:

1. **Check wallet status on login** - `AuthContext.tsx` calls `walletService.ensureAllWalletsCreated()` after successful authentication.

2. **Retry with backoff** - `DepositScreen.tsx` retries wallet address fetching with exponential backoff (2s, 4s, 8s).

3. **Manual wallet creation** - Users can click "Create Wallet" button to trigger wallet initialization if their wallet is missing.

4. **Status polling** - `walletService.waitForWallets()` can poll for wallet creation completion.
