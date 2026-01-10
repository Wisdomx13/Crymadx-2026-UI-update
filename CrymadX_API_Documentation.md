# CrymadX User Dashboard - API Documentation

**Version:** 1.0.0
**Base URL:** `https://api.crymadx.com/v1`
**Last Updated:** December 28, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Endpoints](#endpoints)
   - [Auth](#auth-endpoints)
   - [User/Profile](#userprofile-endpoints)
   - [Wallet](#wallet-endpoints)
   - [Trading](#trading-endpoints)
   - [Markets](#markets-endpoints)
   - [P2P Trading](#p2p-trading-endpoints)
   - [Earn/Savings](#earnsavings-endpoints)
   - [Vault](#vault-endpoints)
   - [Referral](#referral-endpoints)
   - [Rewards](#rewards-endpoints)
   - [Support/Tickets](#supporttickets-endpoints)
   - [Notifications](#notifications-endpoints)
6. [WebSocket Events](#websocket-events)
7. [Data Models](#data-models)

---

## Overview

The CrymadX API provides programmatic access to the CrymadX cryptocurrency exchange platform. This RESTful API uses JSON for request and response bodies.

### Headers

All requests must include:

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>  (for authenticated endpoints)
```

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-12-28T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "timestamp": "2025-12-28T10:30:00Z"
}
```

---

## Authentication

CrymadX uses JWT (JSON Web Tokens) for authentication.

### Token Types

| Token | Expiry | Usage |
|-------|--------|-------|
| Access Token | 15 minutes | API requests |
| Refresh Token | 7 days | Obtain new access token |

### Authentication Flow

1. User logs in with credentials
2. Server returns access_token and refresh_token
3. Include access_token in Authorization header
4. Use refresh_token to get new access_token when expired

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token has expired |
| `AUTH_TOKEN_INVALID` | 401 | Invalid or malformed token |
| `AUTH_2FA_REQUIRED` | 403 | 2FA verification required |
| `USER_NOT_FOUND` | 404 | User does not exist |
| `USER_EMAIL_EXISTS` | 409 | Email already registered |
| `WALLET_INSUFFICIENT_BALANCE` | 400 | Insufficient funds |
| `WALLET_INVALID_ADDRESS` | 400 | Invalid withdrawal address |
| `WALLET_MIN_AMOUNT` | 400 | Below minimum amount |
| `TRADING_PAIR_NOT_FOUND` | 404 | Trading pair not found |
| `TRADING_ORDER_FAILED` | 400 | Order placement failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public | 100 requests | 1 minute |
| Authenticated | 300 requests | 1 minute |
| Trading | 50 requests | 1 second |
| Withdrawals | 10 requests | 1 minute |

Headers returned:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703757600
```

---

## Endpoints

---

# Auth Endpoints

## Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`
**Auth Required:** No

### Request Body

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "referral_code": "REF123",
  "terms_accepted": true
}
```

### Validation Rules

| Field | Rules |
|-------|-------|
| full_name | Required, 2-100 characters |
| email | Required, valid email format, unique |
| phone | Required, valid phone format |
| password | Required, min 8 chars, 1 uppercase, 1 number, 1 special char |
| confirm_password | Required, must match password |
| referral_code | Optional, valid existing code |
| terms_accepted | Required, must be true |

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123xyz",
      "email": "john@example.com",
      "full_name": "John Doe",
      "phone": "+1234567890",
      "kyc_status": "pending",
      "created_at": "2025-12-28T10:30:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  },
  "message": "Account created successfully"
}
```

---

## Login

Authenticates user and returns tokens.

**Endpoint:** `POST /auth/login`
**Auth Required:** No

### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "remember_me": true,
  "device_info": {
    "device_type": "web",
    "browser": "Chrome",
    "os": "Windows",
    "ip": "192.168.1.1"
  }
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123xyz",
      "email": "john@example.com",
      "full_name": "John Doe",
      "avatar": "https://cdn.crymadx.com/avatars/style1.png",
      "kyc_status": "verified",
      "two_factor_enabled": false
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900,
    "requires_2fa": false
  },
  "message": "Login successful"
}
```

### Response (2FA Required)

```json
{
  "success": true,
  "data": {
    "requires_2fa": true,
    "temp_token": "tmp_xyz789...",
    "methods": ["authenticator", "sms", "email"]
  },
  "message": "2FA verification required"
}
```

---

## Verify 2FA

Completes 2FA verification during login.

**Endpoint:** `POST /auth/verify-2fa`
**Auth Required:** No (requires temp_token)

### Request Body

```json
{
  "temp_token": "tmp_xyz789...",
  "code": "123456",
  "method": "authenticator"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  },
  "message": "2FA verification successful"
}
```

---

## Refresh Token

Gets new access token using refresh token.

**Endpoint:** `POST /auth/refresh`
**Auth Required:** No

### Request Body

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  }
}
```

---

## Logout

Invalidates current session.

**Endpoint:** `POST /auth/logout`
**Auth Required:** Yes

### Request Body

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "logout_all_devices": false
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Forgot Password - Request Reset

Initiates password reset flow.

**Endpoint:** `POST /auth/forgot-password`
**Auth Required:** No

### Request Body

```json
{
  "email": "john@example.com"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "reset_token": "rst_abc123...",
    "expires_in": 300,
    "email_sent": true
  },
  "message": "Verification code sent to your email"
}
```

---

## Forgot Password - Verify Code

Verifies the OTP code sent via email.

**Endpoint:** `POST /auth/verify-reset-code`
**Auth Required:** No

### Request Body

```json
{
  "reset_token": "rst_abc123...",
  "code": "123456"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "password_reset_token": "prt_xyz789...",
    "expires_in": 300
  },
  "message": "Code verified successfully"
}
```

---

## Forgot Password - Reset Password

Sets new password after verification.

**Endpoint:** `POST /auth/reset-password`
**Auth Required:** No

### Request Body

```json
{
  "password_reset_token": "prt_xyz789...",
  "new_password": "NewSecurePass123!",
  "confirm_password": "NewSecurePass123!"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

---

## Resend Verification Code

Resends OTP code for password reset.

**Endpoint:** `POST /auth/resend-code`
**Auth Required:** No

### Request Body

```json
{
  "reset_token": "rst_abc123...",
  "type": "password_reset"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "resend_available_in": 60
  },
  "message": "Verification code resent"
}
```

---

# User/Profile Endpoints

## Get User Profile

Returns current user's profile information.

**Endpoint:** `GET /user/profile`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123xyz",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "avatar": "https://cdn.crymadx.com/avatars/style1.png",
    "country": "United States",
    "kyc_status": "verified",
    "kyc_level": 2,
    "two_factor_enabled": true,
    "two_factor_methods": ["authenticator", "sms"],
    "email_verified": true,
    "phone_verified": true,
    "created_at": "2025-01-15T10:30:00Z",
    "last_login": "2025-12-28T10:30:00Z",
    "preferences": {
      "email_notifications": true,
      "sms_notifications": false,
      "trading_notifications": true,
      "marketing_emails": false
    }
  }
}
```

---

## Update User Profile

Updates user profile information.

**Endpoint:** `PUT /user/profile`
**Auth Required:** Yes

### Request Body

```json
{
  "full_name": "John Smith",
  "phone": "+1987654321",
  "country": "Canada",
  "preferences": {
    "email_notifications": true,
    "sms_notifications": true,
    "trading_notifications": true,
    "marketing_emails": false
  }
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123xyz",
    "full_name": "John Smith",
    "phone": "+1987654321",
    "country": "Canada",
    "updated_at": "2025-12-28T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

## Get Available Avatars

Returns list of available avatar options.

**Endpoint:** `GET /user/avatars`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "avatars": [
      {
        "id": "avatar_1",
        "name": "Style 1",
        "url": "https://cdn.crymadx.com/avatars/style1.png",
        "category": "default"
      },
      {
        "id": "avatar_2",
        "name": "Style 2",
        "url": "https://cdn.crymadx.com/avatars/style2.png",
        "category": "default"
      },
      {
        "id": "avatar_premium_1",
        "name": "Premium Gold",
        "url": "https://cdn.crymadx.com/avatars/premium1.png",
        "category": "premium",
        "requires_tier": "gold"
      }
    ],
    "categories": ["default", "animals", "abstract", "premium"]
  }
}
```

---

## Update Avatar

Updates user's avatar.

**Endpoint:** `PUT /user/avatar`
**Auth Required:** Yes

### Request Body

```json
{
  "avatar_id": "avatar_5"
}
```

OR for custom upload:

```json
{
  "avatar_url": "https://cdn.crymadx.com/uploads/custom_abc123.png"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "avatar": "https://cdn.crymadx.com/avatars/style5.png"
  },
  "message": "Avatar updated successfully"
}
```

---

## Get Login History

Returns user's login history.

**Endpoint:** `GET /user/login-history`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20, max: 100) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "sess_abc123",
        "device": "Chrome on Windows",
        "device_type": "desktop",
        "browser": "Chrome 120",
        "os": "Windows 11",
        "ip_address": "192.168.1.100",
        "location": "New York, USA",
        "login_time": "2025-12-28T10:30:00Z",
        "last_active": "2025-12-28T11:45:00Z",
        "is_current": true,
        "status": "active"
      },
      {
        "id": "sess_xyz789",
        "device": "Safari on iOS",
        "device_type": "mobile",
        "browser": "Safari 17",
        "os": "iOS 17",
        "ip_address": "192.168.1.101",
        "location": "New York, USA",
        "login_time": "2025-12-27T15:20:00Z",
        "last_active": "2025-12-27T16:30:00Z",
        "is_current": false,
        "status": "active"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 45,
      "per_page": 20
    }
  }
}
```

---

## Revoke Session

Terminates a specific login session.

**Endpoint:** `DELETE /user/login-history/{session_id}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "message": "Session terminated successfully"
}
```

---

## Enable 2FA

Initiates 2FA setup.

**Endpoint:** `POST /user/2fa/enable`
**Auth Required:** Yes

### Request Body

```json
{
  "method": "authenticator",
  "password": "CurrentPassword123!"
}
```

### Response (200 OK) - For Authenticator

```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "backup_codes": [
      "ABCD-1234-EFGH",
      "IJKL-5678-MNOP",
      "QRST-9012-UVWX",
      "YZAB-3456-CDEF",
      "GHIJ-7890-KLMN"
    ],
    "expires_in": 300
  },
  "message": "Scan QR code with authenticator app"
}
```

---

## Verify 2FA Setup

Completes 2FA setup by verifying code.

**Endpoint:** `POST /user/2fa/verify-setup`
**Auth Required:** Yes

### Request Body

```json
{
  "code": "123456",
  "method": "authenticator"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "two_factor_enabled": true,
    "methods": ["authenticator"]
  },
  "message": "2FA enabled successfully"
}
```

---

## Disable 2FA

Disables 2FA for the account.

**Endpoint:** `POST /user/2fa/disable`
**Auth Required:** Yes

### Request Body

```json
{
  "password": "CurrentPassword123!",
  "code": "123456"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "two_factor_enabled": false
  },
  "message": "2FA disabled successfully"
}
```

---

## Get API Keys

Returns user's API keys.

**Endpoint:** `GET /user/api-keys`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "api_keys": [
      {
        "id": "key_abc123",
        "name": "Trading Bot",
        "key": "crx_****************************abc1",
        "permissions": ["read", "trade"],
        "ip_whitelist": ["192.168.1.100", "10.0.0.1"],
        "created_at": "2025-12-01T10:00:00Z",
        "last_used": "2025-12-28T09:30:00Z",
        "status": "active"
      }
    ],
    "max_keys": 10
  }
}
```

---

## Create API Key

Creates a new API key.

**Endpoint:** `POST /user/api-keys`
**Auth Required:** Yes

### Request Body

```json
{
  "name": "Portfolio Tracker",
  "permissions": ["read"],
  "ip_whitelist": ["192.168.1.100"],
  "password": "CurrentPassword123!",
  "two_factor_code": "123456"
}
```

### Available Permissions

| Permission | Description |
|------------|-------------|
| read | Read account info, balances, orders |
| trade | Place and cancel orders |
| withdraw | Withdraw funds (requires additional verification) |
| transfer | Internal transfers between wallets |

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "key_xyz789",
    "name": "Portfolio Tracker",
    "api_key": "crx_pk_abc123xyz789def456...",
    "api_secret": "crx_sk_secret123xyz789...",
    "permissions": ["read"],
    "ip_whitelist": ["192.168.1.100"],
    "created_at": "2025-12-28T10:30:00Z"
  },
  "message": "API key created. Save your secret key - it won't be shown again."
}
```

---

## Delete API Key

Deletes an API key.

**Endpoint:** `DELETE /user/api-keys/{key_id}`
**Auth Required:** Yes

### Request Body

```json
{
  "password": "CurrentPassword123!",
  "two_factor_code": "123456"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

---

## Get Payment Methods

Returns user's saved payment methods.

**Endpoint:** `GET /user/payment-methods`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "payment_methods": [
      {
        "id": "pm_abc123",
        "type": "bank_account",
        "name": "Chase Bank ****1234",
        "details": {
          "bank_name": "Chase Bank",
          "account_last4": "1234",
          "account_type": "checking"
        },
        "is_default": true,
        "verified": true,
        "created_at": "2025-06-15T10:00:00Z"
      },
      {
        "id": "pm_xyz789",
        "type": "card",
        "name": "Visa ****5678",
        "details": {
          "brand": "visa",
          "last4": "5678",
          "exp_month": 12,
          "exp_year": 2027
        },
        "is_default": false,
        "verified": true,
        "created_at": "2025-08-20T14:30:00Z"
      }
    ]
  }
}
```

---

## Add Payment Method

Adds a new payment method.

**Endpoint:** `POST /user/payment-methods`
**Auth Required:** Yes

### Request Body (Bank Account)

```json
{
  "type": "bank_account",
  "bank_name": "Bank of America",
  "account_holder_name": "John Doe",
  "account_number": "123456789012",
  "routing_number": "021000021",
  "account_type": "checking"
}
```

### Request Body (Card)

```json
{
  "type": "card",
  "card_token": "tok_visa_abc123..."
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "pm_new123",
    "type": "bank_account",
    "name": "Bank of America ****9012",
    "verified": false,
    "verification_required": true
  },
  "message": "Payment method added. Verification pending."
}
```

---

## Delete Payment Method

Removes a payment method.

**Endpoint:** `DELETE /user/payment-methods/{payment_method_id}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "message": "Payment method removed successfully"
}
```

---

## Change Password

Changes user's password.

**Endpoint:** `POST /user/change-password`
**Auth Required:** Yes

### Request Body

```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewSecurePass456!",
  "confirm_password": "NewSecurePass456!",
  "two_factor_code": "123456"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

# Wallet Endpoints

## Get Wallet Overview

Returns complete wallet balances across all account types.

**Endpoint:** `GET /wallet/overview`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "total_balance_usd": 53386.42,
    "total_balance_btc": 1.2234,
    "24h_change_usd": 1234.56,
    "24h_change_percent": 2.37,
    "accounts": {
      "spot": {
        "balance_usd": 42542.18,
        "balance_btc": 0.9765
      },
      "funding": {
        "balance_usd": 10844.24,
        "balance_btc": 0.2469
      },
      "earn": {
        "balance_usd": 0.00,
        "balance_btc": 0.0000
      }
    }
  }
}
```

---

## Get Wallet Assets

Returns all assets with balances.

**Endpoint:** `GET /wallet/assets`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| account_type | string | Filter by: spot, funding, earn, all (default: all) |
| hide_zero | boolean | Hide zero balance assets (default: false) |
| search | string | Search by symbol or name |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20, max: 100) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "symbol": "BTC",
        "name": "Bitcoin",
        "icon": "https://cdn.crymadx.com/coins/btc.png",
        "spot": {
          "available": 0.4234,
          "in_order": 0.0123,
          "total": 0.4357
        },
        "funding": {
          "available": 0.1000,
          "locked": 0.0000,
          "total": 0.1000
        },
        "earn": {
          "flexible": 0.0000,
          "locked": 0.0000,
          "total": 0.0000
        },
        "total_balance": 0.5357,
        "price_usd": 43576.00,
        "value_usd": 23339.43,
        "change_24h": 2.34,
        "networks": ["Bitcoin", "BEP-20"]
      },
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "icon": "https://cdn.crymadx.com/coins/eth.png",
        "spot": {
          "available": 3.2156,
          "in_order": 0.5000,
          "total": 3.7156
        },
        "funding": {
          "available": 1.0000,
          "locked": 0.0000,
          "total": 1.0000
        },
        "earn": {
          "flexible": 0.0000,
          "locked": 0.0000,
          "total": 0.0000
        },
        "total_balance": 4.7156,
        "price_usd": 2345.67,
        "value_usd": 11061.23,
        "change_24h": -1.25,
        "networks": ["ERC-20", "BEP-20", "Arbitrum", "Optimism"]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 30,
      "per_page": 20
    }
  }
}
```

---

## Get Deposit Info

Returns deposit address and info for a specific asset.

**Endpoint:** `GET /wallet/deposit/{symbol}`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| network | string | Required. Network to deposit on |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "symbol": "BTC",
    "name": "Bitcoin",
    "network": "Bitcoin",
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "memo": null,
    "requires_memo": false,
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "min_deposit": 0.0001,
    "confirmations_required": 3,
    "estimated_arrival": "30-60 minutes",
    "deposit_enabled": true,
    "warnings": [
      "Send only BTC to this address",
      "Minimum deposit is 0.0001 BTC"
    ]
  }
}
```

---

## Get Available Networks

Returns available networks for deposit/withdrawal.

**Endpoint:** `GET /wallet/networks/{symbol}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "symbol": "USDT",
    "networks": [
      {
        "network": "ERC-20",
        "name": "Ethereum (ERC20)",
        "deposit_enabled": true,
        "withdraw_enabled": true,
        "min_deposit": 10,
        "min_withdraw": 20,
        "withdraw_fee": 15,
        "confirmations": 12,
        "estimated_time": "5-10 minutes"
      },
      {
        "network": "TRC-20",
        "name": "Tron (TRC20)",
        "deposit_enabled": true,
        "withdraw_enabled": true,
        "min_deposit": 1,
        "min_withdraw": 10,
        "withdraw_fee": 1,
        "confirmations": 20,
        "estimated_time": "2-5 minutes"
      },
      {
        "network": "BEP-20",
        "name": "BNB Smart Chain (BEP20)",
        "deposit_enabled": true,
        "withdraw_enabled": true,
        "min_deposit": 5,
        "min_withdraw": 10,
        "withdraw_fee": 0.5,
        "confirmations": 15,
        "estimated_time": "3-5 minutes"
      }
    ]
  }
}
```

---

## Create Withdrawal

Initiates a withdrawal request.

**Endpoint:** `POST /wallet/withdraw`
**Auth Required:** Yes

### Request Body

```json
{
  "symbol": "BTC",
  "network": "Bitcoin",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "memo": null,
  "amount": 0.5,
  "two_factor_code": "123456"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "withdrawal_id": "wd_abc123xyz",
    "symbol": "BTC",
    "network": "Bitcoin",
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "amount": 0.5,
    "fee": 0.0001,
    "net_amount": 0.4999,
    "status": "pending",
    "estimated_arrival": "30-60 minutes",
    "created_at": "2025-12-28T10:30:00Z"
  },
  "message": "Withdrawal submitted successfully"
}
```

---

## Get Withdrawal by ID

Returns details of a specific withdrawal.

**Endpoint:** `GET /wallet/withdraw/{withdrawal_id}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "withdrawal_id": "wd_abc123xyz",
    "symbol": "BTC",
    "network": "Bitcoin",
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "amount": 0.5,
    "fee": 0.0001,
    "net_amount": 0.4999,
    "status": "completed",
    "tx_hash": "a1b2c3d4e5f6...",
    "confirmations": 6,
    "required_confirmations": 3,
    "created_at": "2025-12-28T10:30:00Z",
    "completed_at": "2025-12-28T11:15:00Z"
  }
}
```

---

## Convert Assets

Converts one crypto asset to another.

**Endpoint:** `POST /wallet/convert`
**Auth Required:** Yes

### Request Body

```json
{
  "from_asset": "BTC",
  "to_asset": "ETH",
  "from_amount": 0.1,
  "quote_id": "quote_abc123"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "conversion_id": "conv_xyz789",
    "from_asset": "BTC",
    "to_asset": "ETH",
    "from_amount": 0.1,
    "to_amount": 1.8567,
    "rate": 18.567,
    "fee": 0.0005,
    "fee_asset": "BTC",
    "status": "completed",
    "created_at": "2025-12-28T10:30:00Z"
  },
  "message": "Conversion successful"
}
```

---

## Get Conversion Quote

Gets a quote for asset conversion.

**Endpoint:** `GET /wallet/convert/quote`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| from_asset | string | Source asset symbol |
| to_asset | string | Destination asset symbol |
| from_amount | number | Amount to convert |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "quote_id": "quote_abc123",
    "from_asset": "BTC",
    "to_asset": "ETH",
    "from_amount": 0.1,
    "to_amount": 1.8567,
    "rate": 18.567,
    "inverse_rate": 0.0538,
    "fee": 0.0005,
    "fee_asset": "BTC",
    "expires_at": "2025-12-28T10:31:00Z",
    "valid_for_seconds": 30
  }
}
```

---

## Get Transaction History

Returns wallet transaction history.

**Endpoint:** `GET /wallet/transactions`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: deposit, withdraw, convert, transfer, all |
| symbol | string | Filter by asset symbol |
| status | string | Filter: pending, completed, failed, cancelled |
| start_date | string | Start date (ISO 8601) |
| end_date | string | End date (ISO 8601) |
| page | integer | Page number |
| limit | integer | Items per page (max: 100) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_abc123",
        "type": "deposit",
        "symbol": "BTC",
        "amount": 0.5,
        "fee": 0,
        "net_amount": 0.5,
        "status": "completed",
        "network": "Bitcoin",
        "tx_hash": "a1b2c3d4e5f6...",
        "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "confirmations": 6,
        "created_at": "2025-12-28T10:30:00Z",
        "completed_at": "2025-12-28T11:15:00Z"
      },
      {
        "id": "tx_xyz789",
        "type": "convert",
        "from_symbol": "ETH",
        "to_symbol": "USDT",
        "from_amount": 2.0,
        "to_amount": 4691.34,
        "rate": 2345.67,
        "fee": 0.001,
        "status": "completed",
        "created_at": "2025-12-27T15:20:00Z",
        "completed_at": "2025-12-27T15:20:05Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 98,
      "per_page": 20
    }
  }
}
```

---

## Internal Transfer

Transfers assets between wallet types (Spot, Funding, Earn).

**Endpoint:** `POST /wallet/transfer`
**Auth Required:** Yes

### Request Body

```json
{
  "symbol": "USDT",
  "from_account": "spot",
  "to_account": "funding",
  "amount": 1000
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "transfer_id": "tf_abc123",
    "symbol": "USDT",
    "from_account": "spot",
    "to_account": "funding",
    "amount": 1000,
    "status": "completed",
    "created_at": "2025-12-28T10:30:00Z"
  },
  "message": "Transfer successful"
}
```

---

# Trading Endpoints

## Get Trading Pairs

Returns all available trading pairs.

**Endpoint:** `GET /trading/pairs`
**Auth Required:** No

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| quote_asset | string | Filter by quote asset (USDT, BTC, ETH) |
| status | string | Filter: trading, halt, all |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "pairs": [
      {
        "symbol": "BTCUSDT",
        "base_asset": "BTC",
        "quote_asset": "USDT",
        "status": "trading",
        "base_precision": 8,
        "quote_precision": 2,
        "min_order_qty": 0.00001,
        "max_order_qty": 1000,
        "min_order_value": 10,
        "tick_size": 0.01,
        "step_size": 0.00001,
        "maker_fee": 0.001,
        "taker_fee": 0.001
      }
    ],
    "total": 500
  }
}
```

---

## Get Ticker

Returns 24hr ticker data for a trading pair.

**Endpoint:** `GET /trading/ticker/{symbol}`
**Auth Required:** No

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "symbol": "BTCUSDT",
    "price": 43576.50,
    "price_change": 892.30,
    "price_change_percent": 2.09,
    "high_24h": 44200.00,
    "low_24h": 42500.00,
    "volume_24h": 125678.234,
    "quote_volume_24h": 5478901234.56,
    "open_price": 42684.20,
    "last_trade_time": "2025-12-28T10:30:00Z",
    "bid_price": 43575.00,
    "ask_price": 43577.00
  }
}
```

---

## Get All Tickers

Returns 24hr ticker data for all pairs.

**Endpoint:** `GET /trading/tickers`
**Auth Required:** No

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "tickers": [
      {
        "symbol": "BTCUSDT",
        "price": 43576.50,
        "price_change_percent": 2.09,
        "volume_24h": 125678.234,
        "quote_volume_24h": 5478901234.56
      },
      {
        "symbol": "ETHUSDT",
        "price": 2345.67,
        "price_change_percent": -1.25,
        "volume_24h": 456789.123,
        "quote_volume_24h": 1071234567.89
      }
    ],
    "timestamp": "2025-12-28T10:30:00Z"
  }
}
```

---

## Get Order Book

Returns order book depth for a trading pair.

**Endpoint:** `GET /trading/orderbook/{symbol}`
**Auth Required:** No

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Depth limit: 5, 10, 20, 50, 100 (default: 20) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "symbol": "BTCUSDT",
    "bids": [
      { "price": 43575.00, "quantity": 1.234, "total": 53795.55 },
      { "price": 43574.50, "quantity": 2.567, "total": 111895.64 },
      { "price": 43574.00, "quantity": 0.891, "total": 38824.43 }
    ],
    "asks": [
      { "price": 43577.00, "quantity": 0.567, "total": 24708.16 },
      { "price": 43577.50, "quantity": 1.234, "total": 53774.60 },
      { "price": 43578.00, "quantity": 2.345, "total": 102189.41 }
    ],
    "last_update_id": 1234567890,
    "timestamp": "2025-12-28T10:30:00.123Z"
  }
}
```

---

## Get Recent Trades

Returns recent trades for a trading pair.

**Endpoint:** `GET /trading/trades/{symbol}`
**Auth Required:** No

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Number of trades (default: 50, max: 1000) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "symbol": "BTCUSDT",
    "trades": [
      {
        "id": "t_abc123",
        "price": 43576.50,
        "quantity": 0.0123,
        "quote_quantity": 535.99,
        "time": "2025-12-28T10:30:00.123Z",
        "is_buyer_maker": false
      },
      {
        "id": "t_abc124",
        "price": 43576.00,
        "quantity": 0.0567,
        "quote_quantity": 2470.76,
        "time": "2025-12-28T10:29:58.456Z",
        "is_buyer_maker": true
      }
    ]
  }
}
```

---

## Place Order

Places a new trading order.

**Endpoint:** `POST /trading/order`
**Auth Required:** Yes

### Request Body (Limit Order)

```json
{
  "symbol": "BTCUSDT",
  "side": "buy",
  "type": "limit",
  "quantity": 0.01,
  "price": 43500.00,
  "time_in_force": "GTC"
}
```

### Request Body (Market Order)

```json
{
  "symbol": "BTCUSDT",
  "side": "sell",
  "type": "market",
  "quantity": 0.01
}
```

### Order Types

| Type | Description |
|------|-------------|
| limit | Limit order at specified price |
| market | Market order at best available price |
| stop_limit | Stop-limit order |
| stop_market | Stop-market order |

### Time in Force

| Value | Description |
|-------|-------------|
| GTC | Good Till Cancelled |
| IOC | Immediate Or Cancel |
| FOK | Fill Or Kill |

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "order_id": "ord_abc123xyz",
    "client_order_id": "my_order_001",
    "symbol": "BTCUSDT",
    "side": "buy",
    "type": "limit",
    "quantity": 0.01,
    "price": 43500.00,
    "executed_qty": 0,
    "executed_quote_qty": 0,
    "status": "new",
    "time_in_force": "GTC",
    "created_at": "2025-12-28T10:30:00Z"
  },
  "message": "Order placed successfully"
}
```

---

## Cancel Order

Cancels an open order.

**Endpoint:** `DELETE /trading/order/{order_id}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "order_id": "ord_abc123xyz",
    "symbol": "BTCUSDT",
    "status": "cancelled",
    "original_qty": 0.01,
    "executed_qty": 0,
    "cancelled_at": "2025-12-28T10:35:00Z"
  },
  "message": "Order cancelled successfully"
}
```

---

## Cancel All Orders

Cancels all open orders for a symbol.

**Endpoint:** `DELETE /trading/orders`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| symbol | string | Trading pair symbol (required) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "cancelled_orders": 5,
    "order_ids": [
      "ord_abc123",
      "ord_xyz789",
      "ord_def456",
      "ord_ghi012",
      "ord_jkl345"
    ]
  },
  "message": "All orders cancelled successfully"
}
```

---

## Get Open Orders

Returns user's open orders.

**Endpoint:** `GET /trading/orders/open`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| symbol | string | Filter by symbol (optional) |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": "ord_abc123xyz",
        "symbol": "BTCUSDT",
        "side": "buy",
        "type": "limit",
        "quantity": 0.01,
        "price": 43500.00,
        "executed_qty": 0,
        "remaining_qty": 0.01,
        "status": "new",
        "time_in_force": "GTC",
        "created_at": "2025-12-28T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 3,
      "per_page": 20
    }
  }
}
```

---

## Get Order History

Returns user's order history.

**Endpoint:** `GET /trading/orders/history`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| symbol | string | Filter by symbol |
| status | string | Filter: filled, cancelled, partial, all |
| start_date | string | Start date (ISO 8601) |
| end_date | string | End date (ISO 8601) |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": "ord_xyz789abc",
        "symbol": "BTCUSDT",
        "side": "sell",
        "type": "market",
        "quantity": 0.05,
        "price": null,
        "avg_price": 43580.25,
        "executed_qty": 0.05,
        "executed_quote_qty": 2179.01,
        "fee": 2.18,
        "fee_asset": "USDT",
        "status": "filled",
        "created_at": "2025-12-27T15:20:00Z",
        "updated_at": "2025-12-27T15:20:01Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 195,
      "per_page": 20
    }
  }
}
```

---

## Get Trade History

Returns user's trade (fill) history.

**Endpoint:** `GET /trading/trades/history`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| symbol | string | Filter by symbol |
| start_date | string | Start date (ISO 8601) |
| end_date | string | End date (ISO 8601) |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "trades": [
      {
        "trade_id": "trd_abc123",
        "order_id": "ord_xyz789abc",
        "symbol": "BTCUSDT",
        "side": "sell",
        "price": 43580.25,
        "quantity": 0.05,
        "quote_quantity": 2179.01,
        "fee": 2.18,
        "fee_asset": "USDT",
        "is_maker": false,
        "executed_at": "2025-12-27T15:20:01Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 15,
      "total_items": 287,
      "per_page": 20
    }
  }
}
```

---

# Markets Endpoints

## Get Market Data

Returns market data for all listed assets.

**Endpoint:** `GET /markets`
**Auth Required:** No

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter: all, favorites, spot, futures, new, gainers, losers |
| sort_by | string | Sort: volume, change, price, market_cap |
| sort_order | string | asc or desc |
| search | string | Search by symbol or name |
| page | integer | Page number |
| limit | integer | Items per page (max: 100) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "markets": [
      {
        "rank": 1,
        "symbol": "BTC",
        "name": "Bitcoin",
        "icon": "https://cdn.crymadx.com/coins/btc.png",
        "pair": "BTCUSDT",
        "price": 43576.50,
        "price_change_24h": 892.30,
        "price_change_percent_24h": 2.09,
        "high_24h": 44200.00,
        "low_24h": 42500.00,
        "volume_24h": 125678.234,
        "quote_volume_24h": 5478901234.56,
        "market_cap": 854000000000,
        "circulating_supply": 19600000,
        "sparkline_7d": [42000, 42500, 43000, 43200, 43100, 43400, 43576],
        "is_favorite": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 150,
      "per_page": 50
    }
  }
}
```

---

## Get Market Statistics

Returns global market statistics.

**Endpoint:** `GET /markets/stats`
**Auth Required:** No

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "total_market_cap": "1.72T",
    "total_market_cap_raw": 1720000000000,
    "total_volume_24h": "89.5B",
    "total_volume_24h_raw": 89500000000,
    "btc_dominance": 52.4,
    "eth_dominance": 18.2,
    "active_markets": 500,
    "active_coins": 150,
    "market_cap_change_24h": 2.3,
    "updated_at": "2025-12-28T10:30:00Z"
  }
}
```

---

## Get User Favorites

Returns user's favorite markets.

**Endpoint:** `GET /markets/favorites`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "favorites": ["BTC", "ETH", "SOL", "DOGE"]
  }
}
```

---

## Add to Favorites

Adds a market to user's favorites.

**Endpoint:** `POST /markets/favorites/{symbol}`
**Auth Required:** Yes

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "favorites": ["BTC", "ETH", "SOL", "DOGE", "ADA"]
  },
  "message": "Added to favorites"
}
```

---

## Remove from Favorites

Removes a market from user's favorites.

**Endpoint:** `DELETE /markets/favorites/{symbol}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "favorites": ["BTC", "ETH", "SOL"]
  },
  "message": "Removed from favorites"
}
```

---

# P2P Trading Endpoints

## Get P2P Orders

Returns available P2P trading orders.

**Endpoint:** `GET /p2p/orders`
**Auth Required:** No (Yes for full details)

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: buy, sell, all |
| crypto | string | Filter by crypto: USDT, BTC, ETH |
| fiat | string | Filter by fiat: USD, EUR, GBP |
| payment_method | string | Filter by payment method |
| amount | number | Filter by transaction amount |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "p2p_abc123",
        "type": "sell",
        "trader": {
          "id": "usr_trader1",
          "username": "CryptoKing",
          "avatar": "https://cdn.crymadx.com/avatars/trader1.png",
          "verified": true,
          "total_orders": 1234,
          "completion_rate": 99.2,
          "rating": 4.9,
          "avg_release_time": "5 min",
          "online": true,
          "last_seen": "2025-12-28T10:30:00Z"
        },
        "crypto": "USDT",
        "fiat": "USD",
        "price": 1.02,
        "price_type": "fixed",
        "available_amount": 50000,
        "min_limit": 100,
        "max_limit": 10000,
        "payment_methods": [
          {
            "id": "pm_bank",
            "name": "Bank Transfer",
            "icon": "bank"
          },
          {
            "id": "pm_zelle",
            "name": "Zelle",
            "icon": "zelle"
          }
        ],
        "time_limit": 15,
        "terms": "Fast payment required. Please send exact amount.",
        "created_at": "2025-12-28T08:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 125,
      "per_page": 25
    }
  }
}
```

---

## Get P2P Order Details

Returns details of a specific P2P order.

**Endpoint:** `GET /p2p/orders/{order_id}`
**Auth Required:** No

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "p2p_abc123",
    "type": "sell",
    "trader": {
      "id": "usr_trader1",
      "username": "CryptoKing",
      "avatar": "https://cdn.crymadx.com/avatars/trader1.png",
      "verified": true,
      "total_orders": 1234,
      "completion_rate": 99.2,
      "rating": 4.9,
      "positive_feedback": 1200,
      "negative_feedback": 10,
      "avg_release_time": "5 min",
      "online": true,
      "registered_at": "2023-01-15T00:00:00Z"
    },
    "crypto": "USDT",
    "fiat": "USD",
    "price": 1.02,
    "available_amount": 50000,
    "min_limit": 100,
    "max_limit": 10000,
    "payment_methods": [
      {
        "id": "pm_bank",
        "name": "Bank Transfer",
        "icon": "bank",
        "details": "Chase Bank"
      }
    ],
    "time_limit": 15,
    "terms": "Fast payment required. Please send exact amount.",
    "auto_reply": "Thanks for trading! Payment details will be provided after order."
  }
}
```

---

## Initiate P2P Trade

Starts a P2P trade.

**Endpoint:** `POST /p2p/trade`
**Auth Required:** Yes

### Request Body

```json
{
  "order_id": "p2p_abc123",
  "amount": 500,
  "payment_method_id": "pm_bank"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "trade_id": "trade_xyz789",
    "order_id": "p2p_abc123",
    "type": "buy",
    "crypto": "USDT",
    "crypto_amount": 490.20,
    "fiat": "USD",
    "fiat_amount": 500.00,
    "price": 1.02,
    "fee": 0,
    "payment_method": {
      "name": "Bank Transfer",
      "details": {
        "bank_name": "Chase Bank",
        "account_name": "CryptoKing LLC",
        "account_number": "****1234",
        "routing_number": "****5678"
      }
    },
    "status": "pending_payment",
    "time_limit": 15,
    "expires_at": "2025-12-28T10:45:00Z",
    "created_at": "2025-12-28T10:30:00Z"
  },
  "message": "Trade initiated. Please complete payment within 15 minutes."
}
```

---

## Get My P2P Trades

Returns user's P2P trade history.

**Endpoint:** `GET /p2p/trades`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: pending, completed, cancelled, disputed |
| type | string | Filter: buy, sell |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "trades": [
      {
        "trade_id": "trade_xyz789",
        "type": "buy",
        "counterparty": {
          "username": "CryptoKing",
          "avatar": "https://cdn.crymadx.com/avatars/trader1.png"
        },
        "crypto": "USDT",
        "crypto_amount": 490.20,
        "fiat": "USD",
        "fiat_amount": 500.00,
        "status": "completed",
        "created_at": "2025-12-27T15:00:00Z",
        "completed_at": "2025-12-27T15:10:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 23,
      "per_page": 20
    }
  }
}
```

---

## Mark Payment as Sent

Marks payment as sent in P2P trade.

**Endpoint:** `POST /p2p/trade/{trade_id}/payment-sent`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "trade_id": "trade_xyz789",
    "status": "payment_sent",
    "updated_at": "2025-12-28T10:35:00Z"
  },
  "message": "Payment marked as sent. Waiting for seller to release crypto."
}
```

---

## Release Crypto

Releases crypto to buyer (seller action).

**Endpoint:** `POST /p2p/trade/{trade_id}/release`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "trade_id": "trade_xyz789",
    "status": "completed",
    "crypto_released": 490.20,
    "completed_at": "2025-12-28T10:40:00Z"
  },
  "message": "Crypto released successfully. Trade completed."
}
```

---

## Cancel P2P Trade

Cancels a P2P trade.

**Endpoint:** `POST /p2p/trade/{trade_id}/cancel`
**Auth Required:** Yes

### Request Body

```json
{
  "reason": "Payment method unavailable"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "trade_id": "trade_xyz789",
    "status": "cancelled",
    "cancelled_at": "2025-12-28T10:35:00Z"
  },
  "message": "Trade cancelled"
}
```

---

## Open Dispute

Opens a dispute for a P2P trade.

**Endpoint:** `POST /p2p/trade/{trade_id}/dispute`
**Auth Required:** Yes

### Request Body

```json
{
  "reason": "Payment not received",
  "description": "I sent the payment but seller claims not received",
  "evidence": ["https://cdn.crymadx.com/evidence/screenshot1.png"]
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "dispute_id": "dispute_abc123",
    "trade_id": "trade_xyz789",
    "status": "under_review",
    "created_at": "2025-12-28T10:45:00Z"
  },
  "message": "Dispute opened. Our team will review within 24 hours."
}
```

---

# Earn/Savings Endpoints

## Get Savings Products

Returns available savings products.

**Endpoint:** `GET /earn/products`
**Auth Required:** No

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: flexible, locked |
| symbol | string | Filter by asset symbol |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "sav_btc_flex",
        "symbol": "BTC",
        "name": "Bitcoin",
        "icon": "https://cdn.crymadx.com/coins/btc.png",
        "type": "flexible",
        "apr": 1.5,
        "min_amount": 0.0001,
        "max_amount": 10,
        "total_capacity": 1000,
        "remaining_capacity": 456.78,
        "redemption_period": "instant",
        "interest_payment": "daily",
        "status": "active"
      },
      {
        "id": "sav_usdt_30",
        "symbol": "USDT",
        "name": "Tether",
        "icon": "https://cdn.crymadx.com/coins/usdt.png",
        "type": "locked",
        "apr": 5.5,
        "lock_period_days": 30,
        "min_amount": 100,
        "max_amount": 1000000,
        "total_capacity": 10000000,
        "remaining_capacity": 2345678,
        "early_redemption_fee": 0.5,
        "interest_payment": "at_maturity",
        "status": "active"
      }
    ]
  }
}
```

---

## Subscribe to Savings

Subscribes to a savings product.

**Endpoint:** `POST /earn/subscribe`
**Auth Required:** Yes

### Request Body

```json
{
  "product_id": "sav_usdt_30",
  "amount": 1000,
  "auto_renew": true
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "subscription_id": "sub_abc123",
    "product_id": "sav_usdt_30",
    "symbol": "USDT",
    "amount": 1000,
    "apr": 5.5,
    "type": "locked",
    "lock_period_days": 30,
    "estimated_interest": 4.52,
    "start_date": "2025-12-28T00:00:00Z",
    "maturity_date": "2026-01-27T00:00:00Z",
    "auto_renew": true,
    "status": "active"
  },
  "message": "Successfully subscribed to savings product"
}
```

---

## Get My Subscriptions

Returns user's active savings subscriptions.

**Endpoint:** `GET /earn/subscriptions`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: flexible, locked, all |
| status | string | Filter: active, matured, redeemed |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "subscription_id": "sub_abc123",
        "product_id": "sav_usdt_30",
        "symbol": "USDT",
        "amount": 1000,
        "apr": 5.5,
        "type": "locked",
        "accrued_interest": 2.26,
        "total_interest": 4.52,
        "start_date": "2025-12-28T00:00:00Z",
        "maturity_date": "2026-01-27T00:00:00Z",
        "days_remaining": 30,
        "auto_renew": true,
        "status": "active"
      }
    ],
    "summary": {
      "total_subscribed": 5000,
      "total_interest_earned": 125.50,
      "pending_interest": 45.20
    }
  }
}
```

---

## Redeem Savings

Redeems from a savings subscription.

**Endpoint:** `POST /earn/redeem`
**Auth Required:** Yes

### Request Body

```json
{
  "subscription_id": "sub_abc123",
  "amount": 500
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "redemption_id": "red_xyz789",
    "subscription_id": "sub_abc123",
    "symbol": "USDT",
    "redeemed_amount": 500,
    "interest_earned": 2.26,
    "early_redemption_fee": 2.50,
    "net_amount": 499.76,
    "remaining_subscription": 500,
    "arrival_time": "instant",
    "redeemed_at": "2025-12-28T10:30:00Z"
  },
  "message": "Redemption successful"
}
```

---

# Vault Endpoints

## Get Vault Options

Returns available vault lock periods and APRs.

**Endpoint:** `GET /vault/options`
**Auth Required:** No

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "options": [
      {
        "period_days": 30,
        "label": "30 Days",
        "apr": 8.0,
        "early_break_fee": 0.5
      },
      {
        "period_days": 60,
        "label": "60 Days",
        "apr": 10.0,
        "early_break_fee": 1.0
      },
      {
        "period_days": 90,
        "label": "90 Days",
        "apr": 12.0,
        "early_break_fee": 1.5
      },
      {
        "period_days": 180,
        "label": "180 Days",
        "apr": 15.0,
        "early_break_fee": 2.0
      },
      {
        "period_days": 365,
        "label": "365 Days",
        "apr": 18.0,
        "early_break_fee": 3.0
      }
    ],
    "supported_assets": ["USDT", "BTC", "ETH", "BNB"]
  }
}
```

---

## Create Vault

Creates a new locked vault.

**Endpoint:** `POST /vault/create`
**Auth Required:** Yes

### Request Body

```json
{
  "symbol": "USDT",
  "amount": 5000,
  "period_days": 90
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "vault_id": "vault_abc123",
    "symbol": "USDT",
    "amount": 5000,
    "apr": 12.0,
    "period_days": 90,
    "estimated_interest": 147.95,
    "start_date": "2025-12-28T00:00:00Z",
    "maturity_date": "2026-03-28T00:00:00Z",
    "early_break_fee_percent": 1.5,
    "status": "active"
  },
  "message": "Vault created successfully"
}
```

---

## Get My Vaults

Returns user's active vaults.

**Endpoint:** `GET /vault/list`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: active, matured, broken |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "vaults": [
      {
        "vault_id": "vault_abc123",
        "symbol": "USDT",
        "amount": 5000,
        "apr": 12.0,
        "period_days": 90,
        "days_remaining": 75,
        "accrued_interest": 24.66,
        "estimated_total_interest": 147.95,
        "start_date": "2025-12-28T00:00:00Z",
        "maturity_date": "2026-03-28T00:00:00Z",
        "early_break_fee_percent": 1.5,
        "status": "active"
      }
    ],
    "summary": {
      "total_locked": 10000,
      "total_interest_earned": 250.50,
      "projected_earnings": 450.00
    }
  }
}
```

---

## Break Vault Early

Breaks a vault before maturity (with penalty).

**Endpoint:** `POST /vault/{vault_id}/break`
**Auth Required:** Yes

### Request Body

```json
{
  "confirm": true
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "vault_id": "vault_abc123",
    "symbol": "USDT",
    "principal": 5000,
    "accrued_interest": 24.66,
    "early_break_fee": 75.00,
    "net_amount": 4949.66,
    "broken_at": "2025-12-28T10:30:00Z",
    "status": "broken"
  },
  "message": "Vault broken. Funds returned to spot wallet."
}
```

---

## Claim Matured Vault

Claims a matured vault.

**Endpoint:** `POST /vault/{vault_id}/claim`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "vault_id": "vault_abc123",
    "symbol": "USDT",
    "principal": 5000,
    "total_interest": 147.95,
    "total_amount": 5147.95,
    "claimed_at": "2025-12-28T10:30:00Z",
    "status": "claimed"
  },
  "message": "Vault claimed successfully. Funds added to spot wallet."
}
```

---

# Referral Endpoints

## Get Referral Stats

Returns user's referral statistics.

**Endpoint:** `GET /referral/stats`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "referral_code": "JOHN2025",
    "referral_link": "https://crymadx.com/register?ref=JOHN2025",
    "commission_rate": 20,
    "total_referrals": 45,
    "active_referrals": 38,
    "pending_referrals": 5,
    "inactive_referrals": 2,
    "total_earnings": "1,234.56",
    "total_earnings_raw": 1234.56,
    "pending_earnings": "89.50",
    "pending_earnings_raw": 89.50,
    "lifetime_volume": "125,000.00",
    "tier": {
      "name": "Gold",
      "commission_rate": 20,
      "next_tier": "Platinum",
      "referrals_to_next": 5
    }
  }
}
```

---

## Get Referral List

Returns list of user's referrals.

**Endpoint:** `GET /referral/list`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: active, pending, inactive |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "referrals": [
      {
        "id": "ref_abc123",
        "username": "j***n@email.com",
        "joined_date": "2025-12-15T10:00:00Z",
        "status": "active",
        "total_volume": "5,000.00",
        "your_earnings": "50.00",
        "last_active": "2025-12-28T09:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 45,
      "per_page": 20
    }
  }
}
```

---

## Get Referral Payouts

Returns referral payout history.

**Endpoint:** `GET /referral/payouts`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: paid, pending |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": "payout_xyz789",
        "amount": 150.00,
        "currency": "USDT",
        "referrals_count": 5,
        "period_start": "2025-12-01T00:00:00Z",
        "period_end": "2025-12-31T23:59:59Z",
        "status": "paid",
        "paid_at": "2026-01-05T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 24,
      "per_page": 20
    }
  }
}
```

---

## Generate New Referral Code

Generates a new custom referral code.

**Endpoint:** `POST /referral/code`
**Auth Required:** Yes

### Request Body

```json
{
  "custom_code": "JOHNCRYPTO"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "referral_code": "JOHNCRYPTO",
    "referral_link": "https://crymadx.com/register?ref=JOHNCRYPTO"
  },
  "message": "Referral code updated successfully"
}
```

---

# Rewards Endpoints

## Get Tasks

Returns available reward tasks.

**Endpoint:** `GET /rewards/tasks`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "daily_tasks": [
      {
        "id": "task_login",
        "title": "Daily Login",
        "description": "Log in to your account",
        "reward_points": 10,
        "reward_type": "points",
        "progress": 1,
        "target": 1,
        "completed": true,
        "expires_at": "2025-12-29T00:00:00Z"
      },
      {
        "id": "task_trade",
        "title": "Make a Trade",
        "description": "Complete any spot trade",
        "reward_points": 20,
        "reward_type": "points",
        "progress": 0,
        "target": 1,
        "completed": false,
        "expires_at": "2025-12-29T00:00:00Z"
      },
      {
        "id": "task_deposit",
        "title": "Make a Deposit",
        "description": "Deposit any amount",
        "reward_points": 50,
        "reward_type": "points",
        "progress": 0,
        "target": 1,
        "completed": false,
        "expires_at": "2025-12-29T00:00:00Z"
      }
    ],
    "weekly_tasks": [
      {
        "id": "task_volume_1k",
        "title": "Trading Volume $1,000",
        "description": "Achieve $1,000 trading volume",
        "reward_points": 100,
        "reward_type": "points",
        "progress": 456.78,
        "target": 1000,
        "completed": false,
        "expires_at": "2026-01-04T00:00:00Z"
      },
      {
        "id": "task_referral",
        "title": "Refer a Friend",
        "description": "Get a friend to sign up",
        "reward_points": 200,
        "reward_type": "points",
        "progress": 0,
        "target": 1,
        "completed": false,
        "expires_at": "2026-01-04T00:00:00Z"
      }
    ],
    "summary": {
      "total_points": 1250,
      "pending_rewards": "25.00 USDT",
      "tasks_completed_today": 1,
      "streak_days": 5
    }
  }
}
```

---

## Claim Task Reward

Claims reward for a completed task.

**Endpoint:** `POST /rewards/tasks/{task_id}/claim`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "task_id": "task_login",
    "reward_points": 10,
    "total_points": 1260,
    "claimed_at": "2025-12-28T10:30:00Z"
  },
  "message": "Reward claimed successfully"
}
```

---

## Get Tier Info

Returns tier system information and user's current tier.

**Endpoint:** `GET /rewards/tiers`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "current_tier": {
      "name": "Silver",
      "level": 2,
      "min_volume": "$10,000",
      "trading_fee_discount": 10,
      "withdrawal_limit_boost": 20,
      "exclusive_rewards": true
    },
    "next_tier": {
      "name": "Gold",
      "level": 3,
      "min_volume": "$50,000",
      "volume_needed": "$35,000",
      "trading_fee_discount": 20,
      "withdrawal_limit_boost": 50
    },
    "all_tiers": [
      {
        "name": "Bronze",
        "level": 1,
        "min_volume": "$0",
        "trading_fee_discount": 0,
        "withdrawal_limit_boost": 0
      },
      {
        "name": "Silver",
        "level": 2,
        "min_volume": "$10,000",
        "trading_fee_discount": 10,
        "withdrawal_limit_boost": 20
      },
      {
        "name": "Gold",
        "level": 3,
        "min_volume": "$50,000",
        "trading_fee_discount": 20,
        "withdrawal_limit_boost": 50
      },
      {
        "name": "Platinum",
        "level": 4,
        "min_volume": "$100,000",
        "trading_fee_discount": 30,
        "withdrawal_limit_boost": 100
      },
      {
        "name": "Diamond",
        "level": 5,
        "min_volume": "$500,000",
        "trading_fee_discount": 50,
        "withdrawal_limit_boost": 200
      }
    ],
    "user_stats": {
      "total_volume_30d": "$15,000",
      "progress_to_next": 30
    }
  }
}
```

---

## Get Rewards History

Returns reward claim history.

**Endpoint:** `GET /rewards/history`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: points, bonus, cashback |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "rwd_abc123",
        "type": "points",
        "description": "Daily Login Reward",
        "amount": 10,
        "unit": "points",
        "claimed_at": "2025-12-28T10:30:00Z"
      },
      {
        "id": "rwd_xyz789",
        "type": "cashback",
        "description": "Trading Fee Cashback",
        "amount": 2.50,
        "unit": "USDT",
        "claimed_at": "2025-12-27T15:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 98,
      "per_page": 20
    }
  }
}
```

---

# Support/Tickets Endpoints

## Get Support Categories

Returns available support ticket categories.

**Endpoint:** `GET /support/categories`
**Auth Required:** No

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "categories": [
      { "id": "withdrawal", "name": "Withdrawals", "icon": "arrow-up" },
      { "id": "deposit", "name": "Deposits", "icon": "arrow-down" },
      { "id": "trading", "name": "Trading", "icon": "chart" },
      { "id": "verification", "name": "Verification (KYC)", "icon": "shield" },
      { "id": "security", "name": "Security", "icon": "lock" },
      { "id": "account", "name": "Account", "icon": "user" },
      { "id": "p2p", "name": "P2P Trading", "icon": "users" },
      { "id": "other", "name": "Other", "icon": "help-circle" }
    ]
  }
}
```

---

## Create Support Ticket

Creates a new support ticket.

**Endpoint:** `POST /support/tickets`
**Auth Required:** Yes

### Request Body

```json
{
  "category": "withdrawal",
  "subject": "Withdrawal not received",
  "priority": "high",
  "description": "I made a withdrawal 24 hours ago but haven't received it yet. TxHash: abc123...",
  "attachments": [
    "https://cdn.crymadx.com/uploads/screenshot1.png"
  ]
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "ticket_id": "TKT-2025122801",
    "category": "withdrawal",
    "subject": "Withdrawal not received",
    "priority": "high",
    "status": "open",
    "created_at": "2025-12-28T10:30:00Z",
    "estimated_response": "2-4 hours"
  },
  "message": "Ticket created successfully. We'll respond within 2-4 hours."
}
```

---

## Get My Tickets

Returns user's support tickets.

**Endpoint:** `GET /support/tickets`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: open, in_progress, resolved, closed, all |
| category | string | Filter by category |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "ticket_id": "TKT-2025122801",
        "category": "withdrawal",
        "subject": "Withdrawal not received",
        "priority": "high",
        "status": "in_progress",
        "messages_count": 3,
        "last_reply": "2025-12-28T11:00:00Z",
        "last_reply_by": "support",
        "created_at": "2025-12-28T10:30:00Z",
        "updated_at": "2025-12-28T11:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 15,
      "per_page": 10
    }
  }
}
```

---

## Get Ticket Details

Returns details of a specific ticket including messages.

**Endpoint:** `GET /support/tickets/{ticket_id}`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "ticket_id": "TKT-2025122801",
    "category": "withdrawal",
    "subject": "Withdrawal not received",
    "priority": "high",
    "status": "in_progress",
    "created_at": "2025-12-28T10:30:00Z",
    "updated_at": "2025-12-28T11:00:00Z",
    "messages": [
      {
        "id": "msg_001",
        "sender": "user",
        "sender_name": "John Doe",
        "content": "I made a withdrawal 24 hours ago but haven't received it yet. TxHash: abc123...",
        "attachments": [
          "https://cdn.crymadx.com/uploads/screenshot1.png"
        ],
        "created_at": "2025-12-28T10:30:00Z"
      },
      {
        "id": "msg_002",
        "sender": "support",
        "sender_name": "Sarah (Support)",
        "content": "Thank you for contacting us. I'm looking into your withdrawal now. Can you please confirm the withdrawal address?",
        "attachments": [],
        "created_at": "2025-12-28T10:45:00Z"
      },
      {
        "id": "msg_003",
        "sender": "user",
        "sender_name": "John Doe",
        "content": "The address is bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "attachments": [],
        "created_at": "2025-12-28T11:00:00Z"
      }
    ]
  }
}
```

---

## Reply to Ticket

Adds a reply to an existing ticket.

**Endpoint:** `POST /support/tickets/{ticket_id}/reply`
**Auth Required:** Yes

### Request Body

```json
{
  "message": "Here's the screenshot of my wallet showing the address",
  "attachments": [
    "https://cdn.crymadx.com/uploads/wallet_screenshot.png"
  ]
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "message_id": "msg_004",
    "ticket_id": "TKT-2025122801",
    "created_at": "2025-12-28T11:15:00Z"
  },
  "message": "Reply sent successfully"
}
```

---

## Close Ticket

Closes a support ticket.

**Endpoint:** `POST /support/tickets/{ticket_id}/close`
**Auth Required:** Yes

### Request Body

```json
{
  "feedback_rating": 5,
  "feedback_comment": "Great support, resolved my issue quickly!"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "ticket_id": "TKT-2025122801",
    "status": "closed",
    "closed_at": "2025-12-28T12:00:00Z"
  },
  "message": "Ticket closed. Thank you for your feedback!"
}
```

---

# Notifications Endpoints

## Get Notifications

Returns user's notifications.

**Endpoint:** `GET /notifications`
**Auth Required:** Yes

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: all, system, trading, wallet, security |
| read | boolean | Filter by read status |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_abc123",
        "type": "wallet",
        "title": "Deposit Confirmed",
        "message": "Your deposit of 0.5 BTC has been confirmed",
        "data": {
          "tx_id": "tx_xyz789",
          "symbol": "BTC",
          "amount": 0.5
        },
        "read": false,
        "created_at": "2025-12-28T10:30:00Z"
      },
      {
        "id": "notif_xyz789",
        "type": "trading",
        "title": "Order Filled",
        "message": "Your buy order for 0.1 BTC has been filled",
        "data": {
          "order_id": "ord_abc123",
          "symbol": "BTCUSDT",
          "side": "buy",
          "quantity": 0.1
        },
        "read": true,
        "created_at": "2025-12-28T09:15:00Z"
      }
    ],
    "unread_count": 5,
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 198,
      "per_page": 20
    }
  }
}
```

---

## Mark Notification as Read

Marks a notification as read.

**Endpoint:** `PUT /notifications/{notification_id}/read`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "notification_id": "notif_abc123",
    "read": true
  }
}
```

---

## Mark All as Read

Marks all notifications as read.

**Endpoint:** `PUT /notifications/read-all`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "marked_count": 5
  },
  "message": "All notifications marked as read"
}
```

---

## Get Notification Settings

Returns user's notification preferences.

**Endpoint:** `GET /notifications/settings`
**Auth Required:** Yes

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "email": {
      "enabled": true,
      "trading_updates": true,
      "wallet_updates": true,
      "security_alerts": true,
      "marketing": false,
      "weekly_report": true
    },
    "push": {
      "enabled": true,
      "trading_updates": true,
      "wallet_updates": true,
      "security_alerts": true,
      "price_alerts": true
    },
    "sms": {
      "enabled": false,
      "security_alerts": true,
      "withdrawal_confirmation": true
    }
  }
}
```

---

## Update Notification Settings

Updates notification preferences.

**Endpoint:** `PUT /notifications/settings`
**Auth Required:** Yes

### Request Body

```json
{
  "email": {
    "trading_updates": false,
    "marketing": false
  },
  "push": {
    "price_alerts": true
  },
  "sms": {
    "enabled": true
  }
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": { ... },
  "message": "Notification settings updated"
}
```

---

# WebSocket Events

## Connection

**URL:** `wss://ws.crymadx.com/v1`

### Authentication

```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Subscribe to Channels

```json
{
  "type": "subscribe",
  "channels": ["ticker.BTCUSDT", "orderbook.BTCUSDT", "trades.BTCUSDT"]
}
```

## Public Channels

### Ticker Updates

```json
{
  "channel": "ticker.BTCUSDT",
  "data": {
    "symbol": "BTCUSDT",
    "price": 43576.50,
    "price_change_percent": 2.09,
    "high_24h": 44200.00,
    "low_24h": 42500.00,
    "volume_24h": 125678.234,
    "timestamp": "2025-12-28T10:30:00.123Z"
  }
}
```

### Order Book Updates

```json
{
  "channel": "orderbook.BTCUSDT",
  "data": {
    "type": "update",
    "bids": [
      { "price": 43575.00, "quantity": 1.234 }
    ],
    "asks": [
      { "price": 43577.00, "quantity": 0.567 }
    ],
    "timestamp": "2025-12-28T10:30:00.123Z"
  }
}
```

### Recent Trades

```json
{
  "channel": "trades.BTCUSDT",
  "data": {
    "id": "t_abc123",
    "price": 43576.50,
    "quantity": 0.0123,
    "side": "buy",
    "timestamp": "2025-12-28T10:30:00.123Z"
  }
}
```

## Private Channels (Requires Auth)

### Order Updates

```json
{
  "channel": "orders",
  "data": {
    "order_id": "ord_abc123",
    "symbol": "BTCUSDT",
    "status": "filled",
    "filled_qty": 0.01,
    "avg_price": 43576.50,
    "timestamp": "2025-12-28T10:30:00.123Z"
  }
}
```

### Balance Updates

```json
{
  "channel": "balances",
  "data": {
    "symbol": "BTC",
    "available": 0.4234,
    "locked": 0.0123,
    "timestamp": "2025-12-28T10:30:00.123Z"
  }
}
```

---

# Data Models

## User

```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar: string;
  country: string;
  kyc_status: 'pending' | 'submitted' | 'verified' | 'rejected';
  kyc_level: number;
  two_factor_enabled: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  last_login: string;
}
```

## WalletAsset

```typescript
interface WalletAsset {
  symbol: string;
  name: string;
  icon: string;
  spot: {
    available: number;
    in_order: number;
    total: number;
  };
  funding: {
    available: number;
    locked: number;
    total: number;
  };
  earn: {
    flexible: number;
    locked: number;
    total: number;
  };
  total_balance: number;
  price_usd: number;
  value_usd: number;
  change_24h: number;
  networks: string[];
}
```

## Transaction

```typescript
interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'convert' | 'transfer';
  symbol: string;
  amount: number;
  fee: number;
  net_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  network?: string;
  tx_hash?: string;
  address?: string;
  from_symbol?: string;
  to_symbol?: string;
  from_amount?: number;
  to_amount?: number;
  created_at: string;
  completed_at?: string;
}
```

## Order

```typescript
interface Order {
  order_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop_limit' | 'stop_market';
  quantity: number;
  price: number | null;
  executed_qty: number;
  executed_quote_qty: number;
  avg_price: number;
  status: 'new' | 'partially_filled' | 'filled' | 'cancelled';
  time_in_force: 'GTC' | 'IOC' | 'FOK';
  created_at: string;
  updated_at: string;
}
```

## P2POrder

```typescript
interface P2POrder {
  id: string;
  type: 'buy' | 'sell';
  trader: {
    id: string;
    username: string;
    avatar: string;
    verified: boolean;
    total_orders: number;
    completion_rate: number;
    rating: number;
    online: boolean;
  };
  crypto: string;
  fiat: string;
  price: number;
  available_amount: number;
  min_limit: number;
  max_limit: number;
  payment_methods: PaymentMethod[];
  time_limit: number;
  terms: string;
}
```

## SupportTicket

```typescript
interface SupportTicket {
  ticket_id: string;
  category: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages_count: number;
  created_at: string;
  updated_at: string;
}
```

---

## Supported Cryptocurrencies

| Symbol | Name | Networks |
|--------|------|----------|
| BTC | Bitcoin | Bitcoin, BEP-20 |
| ETH | Ethereum | ERC-20, BEP-20, Arbitrum, Optimism |
| USDT | Tether | ERC-20, TRC-20, BEP-20, SOL |
| BNB | BNB | BEP-20, BEP-2 |
| SOL | Solana | Solana |
| XRP | Ripple | Ripple |
| ADA | Cardano | Cardano |
| DOGE | Dogecoin | Dogecoin, BEP-20 |
| DOT | Polkadot | Polkadot |
| MATIC | Polygon | ERC-20, Polygon |
| AVAX | Avalanche | Avalanche C-Chain |
| LINK | Chainlink | ERC-20 |
| UNI | Uniswap | ERC-20 |
| LTC | Litecoin | Litecoin |
| ATOM | Cosmos | Cosmos |
| SHIB | Shiba Inu | ERC-20 |
| TRX | TRON | TRC-20 |
| NEAR | NEAR Protocol | NEAR |
| ARB | Arbitrum | Arbitrum |
| OP | Optimism | Optimism |
| APT | Aptos | Aptos |
| FIL | Filecoin | Filecoin |
| IMX | Immutable X | ERC-20 |
| RENDER | Render | ERC-20, SOL |
| FTM | Fantom | Fantom, ERC-20 |
| SAND | The Sandbox | ERC-20 |
| MANA | Decentraland | ERC-20 |
| AAVE | Aave | ERC-20 |
| MKR | Maker | ERC-20 |
| INJ | Injective | Injective |

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

---

## Changelog

### v1.0.0 (December 28, 2025)
- Initial API release
- Authentication endpoints
- User/Profile management
- Wallet operations (deposit, withdraw, convert, transfer)
- Spot trading
- Markets data
- P2P trading
- Earn/Savings products
- Vault system
- Referral program
- Rewards system
- Support tickets
- Notifications
- WebSocket real-time updates

---

**Contact:** api-support@crymadx.com
**Documentation:** https://docs.crymadx.com
