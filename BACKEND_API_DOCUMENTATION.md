# CrymadX V2 Backend API Documentation

## Phase 1, 2, 3 & 4 Implementation Complete

**Last Updated:** 2025-12-28
**Backend URL:** `https://backend.crymadx.io`
**Server:** Hetzner (91.99.210.172)

---

## Infrastructure Overview

### Docker Services
| Service | Status | Internal Address | Credentials |
|---------|--------|------------------|-------------|
| MongoDB | Running | 127.0.0.1:27017 | user: `crymadx_admin`, pass: `CryM4dX_M0ng0_2025!` |
| Redis | Running | 127.0.0.1:6379 | pass: `CryM4dX_R3d1s_2025!` |
| RabbitMQ | Running | 127.0.0.1:5672 | user: `crymadx`, pass: `CryM4dX_R4bb1t_2025!` |

### Microservices (systemd) - 25 Services Running
| Service | Port | Description |
|---------|------|-------------|
| api-gateway | 3000 | Main entry point, JWT auth, rate limiting, request routing |
| auth-service | 3001 | User registration, login, JWT token management |
| user-service | 3002 | User profile management |
| email-otp-service | 3003 | 6-digit OTP codes via Resend email |
| 2fa-service | 3004 | Google Authenticator TOTP implementation |
| wallet-creation-service | Worker | Creates Circle + Tatum wallets on user signup |
| webhook-router-service | 3006 | Routes Circle/Tatum webhooks to chain-specific queues |
| deposit-evm-service | Worker | Processes EVM chain deposits (ETH, MATIC, BASE, ARB, OP, AVAX) |
| deposit-solana-service | Worker | Processes Solana deposits |
| deposit-tatum-service | Worker | Processes Tatum chain deposits (BTC, LTC, DOGE, XRP, XLM, BNB, TRX) |
| balance-service | 3007 | User balance queries and transaction history |
| notification-service | Worker | Email notifications via Resend |
| price-feed-service | 3008 | Real-time crypto prices from CoinGecko |
| fee-service | 3009 | Network fee estimation and admin markup |
| swap-service | 3010 | Cross-chain swaps via ChangeNow |
| withdrawal-evm-service | Worker | Processes EVM withdrawals via Circle |
| withdrawal-solana-service | Worker | Processes Solana withdrawals via Circle |
| withdrawal-tatum-service | Worker | Processes Tatum chain withdrawals |
| staking-service | 3011 | ETH staking (Lido), SOL staking (Marinade) |
| savings-service | 3012 | Fixed APY savings products |
| autoinvest-service | 3013 | Dollar Cost Averaging (DCA) scheduling |
| referral-service | 3014 | Referral program with rewards |
| nft-service | 3015 | NFT viewing and marketplace (Polygon via Alchemy) |
| portfolio-service | 3016 | Portfolio analytics, P&L tracking, performance metrics |
| institutional-api-service | 3017 | API key management, high-volume trading endpoints |

---

## API Endpoints

### Base URL
```
https://backend.crymadx.io
```

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "api-gateway",
  "timestamp": "2025-12-28T20:12:40.938Z"
}
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "referralCode": "ABC12345"  // Optional
}
```
**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "referralCode": "XYZ98765"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```
**Side Effects:**
- Creates user in Supabase Auth
- Triggers wallet creation via RabbitMQ (Circle EVM, Solana, Tatum chains)
- Generates unique referral code
- Sends welcome notification

**Error Responses:**
- `400` - Validation failed
- `409` - Email already registered

---

### Login
```http
POST /api/auth/login
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "kycLevel": 0,
    "is2FAEnabled": false
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```
**If 2FA Enabled:**
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "userId": "uuid"
}
```
**Error Responses:**
- `401` - Invalid email or password

---

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json
```
**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response (200 OK):**
```json
{
  "message": "Tokens refreshed",
  "tokens": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token",
    "expiresIn": 900
  }
}
```

---

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response (200 OK):**
```json
{
  "message": "If an account exists, a password reset email has been sent"
}
```

---

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "kycLevel": 0,
    "is2FAEnabled": false,
    "referralCode": "XYZ98765",
    "createdAt": "2025-12-28T20:00:00.000Z"
  }
}
```

---

## User Profile Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "country": "US",
  "avatarUrl": null,
  "kycLevel": 0,
  "is2FAEnabled": false,
  "referralCode": "XYZ98765",
  "createdAt": "2025-12-28T20:00:00.000Z"
}
```

---

### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "fullName": "John Smith",
  "phone": "+1234567890",
  "country": "US"
}
```
**Response (200 OK):**
```json
{
  "message": "Profile updated",
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Smith",
    "phone": "+1234567890",
    "country": "US"
  }
}
```

---

### Get User Wallets
```http
GET /api/user/wallets
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "wallets": {
    "ETH": {
      "address": "0x1234...abcd",
      "walletId": "circle-wallet-id",
      "provider": "circle"
    },
    "SOL": {
      "address": "ABC123...xyz",
      "walletId": "circle-sol-wallet-id",
      "provider": "circle"
    },
    "BTC": {
      "address": "bc1q...",
      "walletId": null,
      "provider": "tatum"
    }
  }
}
```

---

### Get Login History
```http
GET /api/user/login-history
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "history": [
    {
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "action": "login",
      "timestamp": "2025-12-28T20:00:00.000Z"
    }
  ]
}
```

---

## Email OTP Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

### Send OTP
```http
POST /api/otp/send
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "purpose": "withdrawal"  // or "login", "security"
}
```
**Response (200 OK):**
```json
{
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```
**Rate Limit:** 3 OTP requests per 10 minutes

---

### Verify OTP
```http
POST /api/otp/verify
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid",
  "purpose": "withdrawal",
  "code": "123456"
}
```
**Response (200 OK):**
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```
**Error Responses:**
- `400` - OTP expired or not found
- `400` - Invalid OTP

---

## 2FA (Two-Factor Authentication) Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

### Setup 2FA
```http
POST /api/2fa/setup
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```
**Response (200 OK):**
```json
{
  "message": "2FA setup initiated",
  "qrCodeUrl": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP",
  "backupCodes": [
    "A1B2C3D4",
    "E5F6G7H8",
    "..."
  ]
}
```

---

### Enable 2FA
```http
POST /api/2fa/enable
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid",
  "token": "123456"
}
```
**Response (200 OK):**
```json
{
  "message": "2FA enabled successfully",
  "enabled": true
}
```

---

### Verify 2FA
```http
POST /api/2fa/verify
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid",
  "token": "123456"
}
```
**Response (200 OK):**
```json
{
  "message": "2FA verified successfully",
  "verified": true
}
```

---

### Disable 2FA
```http
POST /api/2fa/disable
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid",
  "token": "123456"
}
```
**Response (200 OK):**
```json
{
  "message": "2FA disabled successfully",
  "disabled": true
}
```

---

### Regenerate Backup Codes
```http
POST /api/2fa/backup-codes
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": "uuid"
}
```
**Response (200 OK):**
```json
{
  "message": "New backup codes generated",
  "backupCodes": [
    "A1B2C3D4",
    "E5F6G7H8",
    "..."
  ],
  "warning": "Previous backup codes are now invalid"
}
```

---

## Webhook Endpoints

### Circle Webhooks
```http
POST /webhooks/circle
Content-Type: application/json
```
**Expected Events:**
- `transactions.inbound` - Deposit received
- `transactions.outbound` - Withdrawal sent
- `transactions.complete` - Transaction confirmed
- `wallets.created` - Wallet created

**Response:**
```json
{
  "received": true
}
```

---

### Tatum Webhooks
```http
POST /webhooks/tatum
Content-Type: application/json
```
**Expected Events:**
- `ADDRESS_EVENT` - Activity on monitored address
- `INCOMING_NATIVE_TX` - Native token deposit
- `INCOMING_FUNGIBLE_TX` - Token deposit

**Response:**
```json
{
  "received": true
}
```

---

## Rate Limiting

| Endpoint Category | Limit |
|-------------------|-------|
| General API | 100 requests/minute |
| Auth (login/register) | 10 requests/15 minutes |
| OTP | 3 requests/10 minutes |
| Withdrawals | 10 requests/hour |

---

## JWT Token Structure

### Access Token (15 min expiry)
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1766952982,
  "exp": 1766953882
}
```

### Refresh Token (7 day expiry)
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "type": "refresh",
  "iat": 1766952982,
  "exp": 1767557782
}
```

---

## Database Schema (Supabase PostgreSQL)

### Tables
| Table | Description |
|-------|-------------|
| user_profiles | User profile data (extends auth.users) |
| user_wallets | Wallet addresses for each chain |
| user_2fa | 2FA TOTP secrets and backup codes |
| user_referral_codes | Unique referral codes per user |
| referrals | Referral relationships and rewards |
| ip_logs | Login IP address history |
| kyc_status | KYC verification status |
| admin_tokens | Supported tokens configuration |
| admin_fees | Fee configuration per chain |

---

## Wallet Creation Flow

When a user registers:

1. **Circle EVM Wallet (SCA)**
   - Creates Smart Contract Account wallet
   - Shared address across: ETH, MATIC, BASE, ARB, OP, AVAX
   - Wallet Set ID: `61bf9ee8-d46f-5ee8-9c29-3fc7f8bbbdd0`

2. **Circle Solana Wallet (EOA)**
   - Creates Externally Owned Account wallet
   - Wallet Set ID: `002ef111-c5f3-5bd2-a7d8-027a3c5f6c34`

3. **Tatum Wallets**
   - BTC, LTC, DOGE, XRP (with destination tag), XLM (with memo), BNB, TRX
   - Each wallet subscribed to Tatum webhooks for deposit detection

---

## RabbitMQ Queues

| Queue | Producer | Consumer |
|-------|----------|----------|
| `wallet.create` | auth-service | wallet-creation-service |
| `deposits.eth` | webhook-router | deposit-eth-service (Phase 2) |
| `deposits.polygon` | webhook-router | deposit-polygon-service (Phase 2) |
| `deposits.solana` | webhook-router | deposit-solana-service (Phase 2) |
| `deposits.btc` | webhook-router | deposit-btc-service (Phase 2) |
| `notifications` | all services | notification-service (Phase 2) |

---

## Error Response Format

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Service Management Commands

```bash
# Check all services status
systemctl status crymadx-api-gateway
systemctl status crymadx-auth-service
systemctl status crymadx-user-service
systemctl status crymadx-email-otp-service
systemctl status crymadx-2fa-service
systemctl status crymadx-wallet-creation-service
systemctl status crymadx-webhook-router-service

# View logs
journalctl -u crymadx-api-gateway -f
journalctl -u crymadx-auth-service -f

# Restart a service
systemctl restart crymadx-api-gateway

# Docker containers
docker ps | grep crymadx
```

---

## Phase 2 Complete - New Endpoints

### Balance Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

#### Get All Balances
```http
GET /api/balance/balances
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "balances": [
    { "chain": "ETH", "token": "ETH", "balance": "1.5" },
    { "chain": "BTC", "token": "BTC", "balance": "0.05" },
    { "chain": "SOL", "token": "SOL", "balance": "100.0" }
  ]
}
```

#### Get Balance for Specific Chain
```http
GET /api/balance/balances/:chain
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "chain": "ETH",
  "token": "ETH",
  "balance": "1.5"
}
```

#### Get Transaction History
```http
GET /api/balance/transactions?chain=ETH&limit=50&offset=0
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "transactions": [
    {
      "userId": "uuid",
      "type": "deposit",
      "chain": "ETH",
      "token": "ETH",
      "amount": "1.5",
      "txHash": "0x...",
      "status": "confirmed",
      "createdAt": "2025-12-28T20:00:00.000Z"
    }
  ]
}
```

---

### Price Feed Endpoints

#### Get All Prices
```http
GET /api/prices/prices
```
**Response (200 OK):**
```json
{
  "prices": [
    { "symbol": "BTC", "price": 87543, "change24h": 0.048, "lastUpdated": "2025-12-28T20:45:58.394Z" },
    { "symbol": "ETH", "price": 2933.76, "change24h": 0.115, "lastUpdated": "2025-12-28T20:45:58.394Z" }
  ],
  "count": 13
}
```

#### Get Price for Specific Token
```http
GET /api/prices/prices/:symbol
```
**Response (200 OK):**
```json
{
  "symbol": "BTC",
  "price": 87543,
  "change24h": 0.048,
  "lastUpdated": "2025-12-28T20:45:58.394Z"
}
```

#### Convert Amount to USD
```http
GET /api/prices/convert/:symbol/:amount
```
**Example:** `GET /api/prices/convert/ETH/2.5`

**Response (200 OK):**
```json
{
  "symbol": "ETH",
  "amount": 2.5,
  "price": 2933.76,
  "usdValue": 7334.4,
  "formattedUsd": "$7334.40"
}
```

---

## Deposit Flow (Automatic via Webhooks)

When a user deposits crypto:

1. User sends crypto to their wallet address (from `/api/user/wallets`)
2. Circle/Tatum detects the deposit via blockchain monitoring
3. Webhook is sent to `https://backend.crymadx.io/webhooks/{provider}`
4. `webhook-router-service` validates and routes to chain-specific queue
5. `deposit-{chain}-service` processes the deposit:
   - Validates transaction
   - Looks up user by wallet address
   - Updates balance in Redis
   - Logs transaction to MongoDB
   - Sends email notification

---

---

## Phase 3 - Fee, Withdrawal & Swap Endpoints

### Fee Endpoints

#### Get All Fee Configurations
```http
GET /api/fees/fees
```
**Response (200 OK):**
```json
{
  "fees": {
    "ETH": {
      "networkFee": "0.002",
      "markupPercent": 0.5,
      "fixedFee": "0",
      "minWithdrawal": "0.001",
      "gasSponsored": true,
      "nativeToken": "ETH"
    },
    "BTC": {
      "networkFee": "0.00005",
      "markupPercent": 0.5,
      "fixedFee": "0",
      "minWithdrawal": "0.0001",
      "gasSponsored": false,
      "nativeToken": "BTC"
    }
  }
}
```

#### Get Fee for Specific Chain
```http
GET /api/fees/fees/:chain
```
**Example:** `GET /api/fees/fees/ETH`

**Response (200 OK):**
```json
{
  "chain": "ETH",
  "networkFee": "0.002",
  "markupPercent": 0.5,
  "fixedFee": "0",
  "minWithdrawal": "0.001",
  "gasSponsored": true,
  "nativeToken": "ETH"
}
```

#### Estimate Withdrawal Fee
```http
POST /api/fees/fees/estimate
Content-Type: application/json
```
**Request Body:**
```json
{
  "chain": "ETH",
  "token": "ETH",
  "amount": "1.0"
}
```
**Response (200 OK):**
```json
{
  "chain": "ETH",
  "token": "ETH",
  "amount": "1.0",
  "networkFee": "0.002",
  "networkFeeUsd": "5.87",
  "markupFee": "0.005",
  "markupFeeUsd": "14.67",
  "totalFee": "0.005",
  "totalFeeUsd": "14.67",
  "receiveAmount": "0.995",
  "gasSponsored": true
}
```

---

### Swap Endpoints

> All endpoints except `/pairs` require `Authorization: Bearer <accessToken>` header

#### Get Available Trading Pairs
```http
GET /api/swap/pairs
```
**Response (200 OK):**
```json
{
  "pairs": [
    { "ticker": "btc", "name": "Bitcoin", "network": "btc", "hasExternalId": false },
    { "ticker": "eth", "name": "Ethereum", "network": "eth", "hasExternalId": false },
    { "ticker": "usdt", "name": "Tether (ERC20)", "network": "eth", "hasExternalId": false }
  ]
}
```

#### Get Swap Estimate
```http
POST /api/swap/estimate
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "fromChain": "ETH",
  "fromToken": "ETH",
  "toChain": "BTC",
  "toToken": "BTC",
  "amount": "1.0"
}
```
**Response (200 OK):**
```json
{
  "fromAmount": "1.0",
  "fromToken": "ETH",
  "fromChain": "ETH",
  "toToken": "BTC",
  "toChain": "BTC",
  "estimatedAmount": "0.03345",
  "rate": "0.03345000",
  "minAmount": "0.01",
  "maxAmount": "100",
  "validUntil": "2025-12-28T21:35:00.000Z"
}
```

#### Create Swap Order
```http
POST /api/swap/create
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "fromChain": "ETH",
  "fromToken": "ETH",
  "toChain": "BTC",
  "toToken": "BTC",
  "amount": "1.0",
  "destinationAddress": "bc1q..."
}
```
**Response (200 OK):**
```json
{
  "orderId": "uuid",
  "changeNowId": "abc123",
  "fromAmount": "1.0",
  "estimatedToAmount": "0.03345",
  "depositAddress": "0x...",
  "status": "pending"
}
```

#### Get Swap Status
```http
GET /api/swap/status/:orderId
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "orderId": "uuid",
  "fromChain": "ETH",
  "fromToken": "ETH",
  "toChain": "BTC",
  "toToken": "BTC",
  "fromAmount": "1.0",
  "toAmount": "0.03340",
  "status": "complete",
  "createdAt": "2025-12-28T21:30:00.000Z",
  "completedAt": "2025-12-28T21:35:00.000Z"
}
```

#### Get Swap History
```http
GET /api/swap/history?limit=20&offset=0
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "orders": [
    {
      "orderId": "uuid",
      "fromToken": "ETH",
      "toToken": "BTC",
      "fromAmount": "1.0",
      "toAmount": "0.03340",
      "status": "complete",
      "createdAt": "2025-12-28T21:30:00.000Z"
    }
  ]
}
```

---

## Phase 4 - Staking, Savings, Auto-Invest, Referral & NFT Endpoints

### Staking Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

#### Get Staking Options
```http
GET /api/staking/options
```
**Response (200 OK):**
```json
{
  "options": [
    {
      "chain": "ETH",
      "protocol": "lido",
      "stakedToken": "ETH",
      "receivedToken": "stETH",
      "minStake": "0.01",
      "maxStake": "1000",
      "currentApy": 3.8,
      "unstakePeriodDays": 0
    },
    {
      "chain": "SOL",
      "protocol": "marinade",
      "stakedToken": "SOL",
      "receivedToken": "mSOL",
      "minStake": "0.1",
      "maxStake": "10000",
      "currentApy": 6.5,
      "unstakePeriodDays": 2
    }
  ]
}
```

#### Get User's Staking Positions
```http
GET /api/staking/positions
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "positions": [
    {
      "positionId": "uuid",
      "chain": "ETH",
      "protocol": "lido",
      "stakedAmount": "1.0",
      "stakedToken": "ETH",
      "receivedAmount": "1.0",
      "receivedToken": "stETH",
      "apy": 3.8,
      "status": "active",
      "currentValue": "1.00052",
      "estimatedRewards": "0.00052",
      "stakedAt": "2025-12-28T20:00:00.000Z"
    }
  ]
}
```

#### Stake Tokens
```http
POST /api/staking/stake
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "chain": "ETH",
  "protocol": "lido",
  "amount": "1.0"
}
```
**Response (200 OK):**
```json
{
  "positionId": "uuid",
  "chain": "ETH",
  "protocol": "lido",
  "stakedAmount": "1.0",
  "stakedToken": "ETH",
  "receivedAmount": "1.0",
  "receivedToken": "stETH",
  "apy": 3.8,
  "status": "active"
}
```

#### Unstake Tokens
```http
POST /api/staking/unstake
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "positionId": "uuid"
}
```
**Response (200 OK):**
```json
{
  "positionId": "uuid",
  "status": "withdrawn",
  "returnedAmount": "1.00052",
  "rewards": "0.00052",
  "token": "ETH"
}
```

---

### Savings Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

#### Get Savings Products
```http
GET /api/savings/products
```
**Response (200 OK):**
```json
{
  "products": [
    {
      "productId": "uuid",
      "name": "USDT Flexible Savings",
      "description": "Earn daily interest on USDT with no lock period",
      "token": "USDT",
      "chain": "ETH",
      "apy": 5.0,
      "minDeposit": "10",
      "maxDeposit": "100000",
      "lockPeriodDays": 0,
      "availablePool": "1000000"
    },
    {
      "productId": "uuid",
      "name": "USDC 30-Day Lock",
      "description": "Lock USDC for 30 days for higher returns",
      "token": "USDC",
      "chain": "ETH",
      "apy": 8.0,
      "minDeposit": "50",
      "maxDeposit": "50000",
      "lockPeriodDays": 30,
      "availablePool": "500000"
    }
  ]
}
```

#### Get User's Savings Deposits
```http
GET /api/savings/deposits
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "deposits": [
    {
      "depositId": "uuid",
      "productId": "uuid",
      "productName": "USDT Flexible Savings",
      "amount": "1000",
      "token": "USDT",
      "apy": 5.0,
      "accruedInterest": "0.13698",
      "totalValue": "1000.13698",
      "status": "active",
      "depositedAt": "2025-12-28T20:00:00.000Z"
    }
  ]
}
```

#### Create Savings Deposit
```http
POST /api/savings/deposit
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "productId": "uuid",
  "amount": "1000"
}
```
**Response (200 OK):**
```json
{
  "depositId": "uuid",
  "productId": "uuid",
  "productName": "USDT Flexible Savings",
  "amount": "1000",
  "token": "USDT",
  "apy": 5.0,
  "lockPeriodDays": 0,
  "status": "active"
}
```

#### Withdraw from Savings
```http
POST /api/savings/withdraw
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "depositId": "uuid"
}
```
**Response (200 OK):**
```json
{
  "depositId": "uuid",
  "principal": "1000",
  "interest": "0.13698",
  "totalReturn": "1000.13698",
  "token": "USDT",
  "status": "withdrawn"
}
```

---

### Auto-Invest (DCA) Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

#### Get User's Auto-Invest Plans
```http
GET /api/autoinvest/plans
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "plans": [
    {
      "planId": "uuid",
      "name": "Weekly BTC DCA",
      "fromToken": "USDT",
      "fromChain": "ETH",
      "toToken": "BTC",
      "toChain": "BTC",
      "amountPerInvestment": "100",
      "frequency": "weekly",
      "dayOfWeek": 1,
      "hourOfDay": 12,
      "totalInvested": "400",
      "totalReceived": "0.00458",
      "executionCount": 4,
      "status": "active",
      "nextExecutionAt": "2025-12-30T12:00:00.000Z"
    }
  ]
}
```

#### Create Auto-Invest Plan
```http
POST /api/autoinvest/plans
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Weekly BTC DCA",
  "fromToken": "USDT",
  "fromChain": "ETH",
  "toToken": "BTC",
  "toChain": "BTC",
  "amountPerInvestment": "100",
  "frequency": "weekly",
  "dayOfWeek": 1,
  "hourOfDay": 12
}
```
**Frequency Options:** `daily`, `weekly`, `biweekly`, `monthly`

**Response (200 OK):**
```json
{
  "planId": "uuid",
  "name": "Weekly BTC DCA",
  "fromToken": "USDT",
  "toToken": "BTC",
  "amountPerInvestment": "100",
  "frequency": "weekly",
  "status": "active",
  "nextExecutionAt": "2025-12-30T12:00:00.000Z"
}
```

#### Update Plan Status
```http
PATCH /api/autoinvest/plans/:planId
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "paused"
}
```
**Status Options:** `active`, `paused`, `cancelled`

#### Get Plan Execution History
```http
GET /api/autoinvest/plans/:planId/history?limit=20
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "executions": [
    {
      "executionId": "uuid",
      "planId": "uuid",
      "fromToken": "USDT",
      "toToken": "BTC",
      "amountSpent": "100",
      "amountReceived": "0.00115",
      "priceAtExecution": "87000",
      "status": "success",
      "executedAt": "2025-12-23T12:00:00.000Z"
    }
  ]
}
```

---

### Referral Endpoints

> Most endpoints require `Authorization: Bearer <accessToken>` header

#### Get Referral Program Info
```http
GET /api/referral/info
```
**Response (200 OK):**
```json
{
  "referrerRewardPercent": 20,
  "refereeRewardPercent": 10,
  "minTradeVolume": "100",
  "maxRewardPerReferral": "1000",
  "rewardToken": "USDT",
  "enabled": true
}
```

#### Get User's Referral Code
```http
GET /api/referral/code
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "referralCode": "A1B2C3D4",
  "referralLink": "https://crymadx.io/signup?ref=A1B2C3D4"
}
```

#### Apply Referral Code
```http
POST /api/referral/apply
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "referralCode": "A1B2C3D4"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "referralId": "uuid",
  "message": "Referral code applied successfully"
}
```

#### Get User's Referrals
```http
GET /api/referral/referrals
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "referrals": [
    {
      "referralId": "uuid",
      "status": "active",
      "totalTradeVolume": "5000",
      "referrerRewardsEarned": "50",
      "createdAt": "2025-12-28T20:00:00.000Z"
    }
  ]
}
```

#### Get Referral Stats
```http
GET /api/referral/stats
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "totalReferrals": 5,
  "activeReferrals": 3,
  "totalEarned": "150.00000000",
  "totalVolume": "15000.00"
}
```

---

### NFT Endpoints (Polygon)

> Most endpoints require `Authorization: Bearer <accessToken>` header

#### Get User's NFTs
```http
GET /api/nft/owned?pageKey=
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "nfts": [
    {
      "contractAddress": "0x...",
      "tokenId": "1234",
      "name": "Cool NFT #1234",
      "description": "A cool NFT",
      "imageUrl": "https://...",
      "collection": "Cool NFT Collection",
      "tokenType": "ERC721",
      "balance": "1"
    }
  ],
  "pageKey": "abc123",
  "totalCount": 10
}
```

#### Get NFT Details
```http
GET /api/nft/details/:contractAddress/:tokenId
```
**Response (200 OK):**
```json
{
  "contractAddress": "0x...",
  "tokenId": "1234",
  "name": "Cool NFT #1234",
  "description": "A cool NFT",
  "imageUrl": "https://...",
  "collection": "Cool NFT Collection",
  "tokenType": "ERC721",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" }
  ],
  "contractMetadata": {
    "name": "Cool NFT Collection",
    "symbol": "COOL",
    "totalSupply": "10000"
  }
}
```

#### Get Collection Info
```http
GET /api/nft/collection/:contractAddress
```
**Response (200 OK):**
```json
{
  "address": "0x...",
  "name": "Cool NFT Collection",
  "symbol": "COOL",
  "totalSupply": "10000",
  "tokenType": "ERC721"
}
```

#### Get Collection Floor Price
```http
GET /api/nft/floor/:contractAddress
```
**Response (200 OK):**
```json
{
  "contractAddress": "0x...",
  "openSea": { "floorPrice": 0.5, "priceCurrency": "ETH" },
  "looksRare": { "floorPrice": 0.48, "priceCurrency": "ETH" }
}
```

#### List NFT for Sale
```http
POST /api/nft/list
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "contractAddress": "0x...",
  "tokenId": "1234",
  "price": "100",
  "currency": "MATIC"
}
```
**Response (200 OK):**
```json
{
  "listingId": "uuid",
  "contractAddress": "0x...",
  "tokenId": "1234",
  "name": "Cool NFT #1234",
  "price": "100",
  "currency": "MATIC",
  "status": "active"
}
```

#### Get Marketplace Listings
```http
GET /api/nft/marketplace?limit=20&offset=0&collection=0x...
```
**Response (200 OK):**
```json
{
  "listings": [
    {
      "listingId": "uuid",
      "contractAddress": "0x...",
      "tokenId": "1234",
      "name": "Cool NFT #1234",
      "imageUrl": "https://...",
      "collection": "Cool NFT Collection",
      "price": "100",
      "currency": "MATIC",
      "createdAt": "2025-12-28T20:00:00.000Z"
    }
  ],
  "total": 50,
  "offset": 0,
  "limit": 20
}
```

#### Buy Listed NFT
```http
POST /api/nft/buy/:listingId
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "success": true,
  "listingId": "uuid",
  "contractAddress": "0x...",
  "tokenId": "1234",
  "pricePaid": "100",
  "currency": "MATIC"
}
```

#### Cancel Listing
```http
DELETE /api/nft/listings/:listingId
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "success": true,
  "listingId": "uuid"
}
```

---

## Withdrawal Flow

When a user requests a withdrawal:

1. Frontend calls `/api/fees/fees/estimate` to show fee breakdown
2. User confirms and frontend calls withdrawal endpoint via API Gateway
3. API Gateway validates request, checks 2FA/OTP if required
4. Request is queued to appropriate withdrawal service:
   - EVM chains → `withdrawals.evm` queue
   - Solana → `withdrawals.sol` queue
   - Tatum chains → `withdrawals.tatum` queue
5. Withdrawal service:
   - Validates balance
   - Executes transfer via Circle/Tatum API
   - Deducts balance from Redis
   - Logs transaction to MongoDB
   - Sends notification to user

---

## Phase 5 - Portfolio Analytics & Institutional API

### Portfolio Endpoints

> All endpoints require `Authorization: Bearer <accessToken>` header

#### Get Portfolio Overview
```http
GET /api/portfolio/overview
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "totalValueUsd": "15234.56",
  "change24h": "234.50",
  "change24hPercent": "1.56",
  "allocation": [
    {
      "chain": "ETH",
      "token": "ETH",
      "amount": "2.5",
      "valueUsd": "8500.00",
      "percentage": "55.80"
    },
    {
      "chain": "SOL",
      "token": "SOL",
      "amount": "25.0",
      "valueUsd": "4750.00",
      "percentage": "31.18"
    }
  ],
  "lastUpdated": "2025-12-28T21:00:00.000Z"
}
```

#### Get Portfolio History (for charts)
```http
GET /api/portfolio/history?period=30d
Authorization: Bearer <accessToken>
```
**Period Options:** `7d`, `30d`, `90d`, `1y`, `all`

**Response (200 OK):**
```json
{
  "period": "30d",
  "history": [
    { "timestamp": "2025-11-28T00:00:00.000Z", "totalValueUsd": "12000.00" },
    { "timestamp": "2025-11-29T00:00:00.000Z", "totalValueUsd": "12500.00" }
  ],
  "periodChange": "3234.56",
  "periodChangePercent": "26.95"
}
```

#### Get P&L Breakdown
```http
GET /api/portfolio/pnl
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "assets": [
    {
      "token": "ETH",
      "currentAmount": "2.5",
      "currentValueUsd": "8500.00",
      "totalCost": "7000.00",
      "realizedPnl": "0",
      "unrealizedPnl": "1500.00"
    }
  ],
  "totalUnrealizedPnl": "1500.00",
  "totalRealizedPnl": "0"
}
```

#### Get Transaction History
```http
GET /api/portfolio/transactions?type=deposit&token=ETH&limit=50&offset=0
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "transactions": [
    {
      "txId": "uuid",
      "type": "deposit",
      "chain": "ETH",
      "token": "ETH",
      "amount": "1.0",
      "valueUsdAtTime": "3400.00",
      "fee": "0.002",
      "feeUsd": "6.80",
      "timestamp": "2025-12-28T20:00:00.000Z"
    }
  ],
  "total": 150,
  "offset": 0,
  "limit": 50
}
```

#### Get Portfolio Stats
```http
GET /api/portfolio/stats
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "totalValueUsd": "15234.56",
  "uniqueAssets": 5,
  "uniqueChains": 3,
  "totalTransactions": 150,
  "deposits": 45,
  "withdrawals": 20,
  "swaps": 85,
  "largestHolding": {
    "token": "ETH",
    "valueUsd": "8500.00",
    "percentage": "55.80"
  }
}
```

#### Get Performance Metrics
```http
GET /api/portfolio/performance
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "current": "15234.56",
  "1d": { "change": "234.50", "changePercent": "1.56" },
  "7d": { "change": "1500.00", "changePercent": "10.93" },
  "30d": { "change": "3234.56", "changePercent": "26.95" },
  "90d": { "change": "5000.00", "changePercent": "48.86" }
}
```

#### Export Portfolio Data
```http
GET /api/portfolio/export?format=csv
Authorization: Bearer <accessToken>
```
**Format Options:** `json`, `csv`

**Response:** CSV file download or JSON object with balances and transactions

#### Force Portfolio Snapshot
```http
POST /api/portfolio/snapshot
Authorization: Bearer <accessToken>
```
**Response (200 OK):**
```json
{
  "snapshotId": "uuid",
  "totalValueUsd": "15234.56",
  "assetsCount": 5,
  "timestamp": "2025-12-28T21:00:00.000Z"
}
```

---

### Institutional API Endpoints

#### API Key Management (JWT Auth)

##### Create API Key
```http
POST /api/institutional/keys
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Trading Bot",
  "permissions": ["read", "trade"],
  "ipWhitelist": ["1.2.3.4", "5.6.7.8"],
  "rateLimit": 100,
  "dailyLimit": "1000000",
  "expiresInDays": 365
}
```
**Permissions:** `read`, `trade`, `withdraw`

**Response (200 OK):**
```json
{
  "keyId": "uuid",
  "name": "Trading Bot",
  "apiKey": "crymadx_abc123...",
  "apiSecret": "def456...",
  "apiKeyPrefix": "crymadx_abc123",
  "permissions": ["read", "trade"],
  "ipWhitelist": ["1.2.3.4", "5.6.7.8"],
  "rateLimit": 100,
  "dailyLimit": "1000000",
  "expiresAt": "2026-12-28T21:00:00.000Z",
  "message": "IMPORTANT: Save your API key and secret now. They cannot be retrieved later."
}
```

##### List API Keys
```http
GET /api/institutional/keys
Authorization: Bearer <accessToken>
```

##### Update API Key
```http
PATCH /api/institutional/keys/:keyId
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Updated Name",
  "enabled": false,
  "ipWhitelist": ["10.0.0.1"]
}
```

##### Delete API Key
```http
DELETE /api/institutional/keys/:keyId
Authorization: Bearer <accessToken>
```

##### Get API Key Usage Stats
```http
GET /api/institutional/keys/:keyId/usage?days=7
Authorization: Bearer <accessToken>
```

---

#### Trading Endpoints (API Key Auth)

All trading endpoints use API key authentication instead of JWT:
- `X-API-Key`: Your API key
- `X-API-Secret`: Your API secret

##### Get Account Info
```http
GET /api/institutional/v1/account
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
```
**Response (200 OK):**
```json
{
  "userId": "uuid",
  "accountType": "institutional",
  "balances": [
    { "asset": "ETH", "chain": "ETH", "free": "2.5", "locked": "0" },
    { "asset": "USDT", "chain": "ETH", "free": "10000", "locked": "500" }
  ],
  "permissions": ["read", "trade"],
  "dailyLimit": "1000000"
}
```

##### Get Ticker Prices
```http
GET /api/institutional/v1/ticker?symbol=BTC
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
```

##### Create Order
```http
POST /api/institutional/v1/order
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
Content-Type: application/json
```
**Request Body:**
```json
{
  "type": "market",
  "side": "buy",
  "fromToken": "USDT",
  "toToken": "BTC",
  "amount": "1000"
}
```
**Order Types:** `market`, `limit`
**Sides:** `buy`, `sell`

**Response (200 OK):**
```json
{
  "orderId": "uuid",
  "type": "market",
  "side": "buy",
  "fromToken": "USDT",
  "toToken": "BTC",
  "amount": "1000",
  "status": "pending",
  "createdAt": "2025-12-28T21:00:00.000Z"
}
```

##### Get Order Status
```http
GET /api/institutional/v1/order/:orderId
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
```

##### Cancel Order
```http
DELETE /api/institutional/v1/order/:orderId
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
```

##### Get All Orders
```http
GET /api/institutional/v1/orders?status=pending&limit=50&offset=0
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
```

##### Batch Create Orders
```http
POST /api/institutional/v1/orders/batch
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
Content-Type: application/json
```
**Request Body:**
```json
{
  "orders": [
    { "type": "market", "side": "buy", "fromToken": "USDT", "toToken": "BTC", "amount": "500" },
    { "type": "market", "side": "buy", "fromToken": "USDT", "toToken": "ETH", "amount": "500" }
  ]
}
```
**Max:** 20 orders per batch

##### Request Withdrawal
```http
POST /api/institutional/v1/withdraw
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
Content-Type: application/json
```
**Request Body:**
```json
{
  "chain": "ETH",
  "token": "ETH",
  "amount": "1.0",
  "address": "0x..."
}
```
**Note:** Requires `withdraw` permission on API key

##### Get Trading Limits
```http
GET /api/institutional/v1/limits
X-API-Key: crymadx_abc123...
X-API-Secret: def456...
```
**Response (200 OK):**
```json
{
  "dailyLimit": "1000000",
  "usedToday": "250000.00",
  "remaining": "750000.00",
  "resetsAt": "2025-12-29T00:00:00.000Z"
}
```

---

## Phase 5 Roadmap (Pending Provider Meetings)

- [x] Portfolio Analytics ✅
- [x] Institutional API ✅
- [ ] Virtual Cards (Immersve) - Pending meeting
- [ ] Fiat On-Ramp (Onramper) - Pending meeting

---

## Security Notes

1. All credentials are stored in `.env` files with `chmod 600`
2. Services bind to `127.0.0.1` (localhost only)
3. Nginx handles SSL termination and rate limiting
4. JWT tokens are blacklisted on logout
5. Sensitive operations require 2FA or Email OTP verification
