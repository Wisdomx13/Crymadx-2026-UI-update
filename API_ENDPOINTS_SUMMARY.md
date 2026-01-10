# CrymadX API Endpoints Summary

**Base URL:** `https://api.crymadx.com/v1`

## Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | User login |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | User | Logout |
| POST | `/auth/forgot-password` | Public | Request password reset |
| POST | `/auth/reset-password` | Public | Reset password |
| POST | `/auth/2fa/setup` | User | Generate 2FA secret |
| POST | `/auth/2fa/verify` | User | Enable 2FA |
| DELETE | `/auth/2fa` | User | Disable 2FA |
| POST | `/admin/auth/login` | Public | Admin login |

---

## 2. Users Management

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/me` | User | Get profile |
| PUT | `/users/me` | User | Update profile |
| POST | `/users/me/change-password` | User | Change password |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/users` | Admin | List all users |
| GET | `/admin/users/:userId` | Admin | Get user details |
| PATCH | `/admin/users/:userId/status` | Admin | Update user status |
| PATCH | `/admin/users/:userId/trading` | Admin | Enable/disable trading |
| PATCH | `/admin/users/:userId/withdrawal` | Admin | Withdrawal settings |
| GET | `/admin/users/stats` | Admin | User statistics |

---

## 3. KYC Verification

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/me/kyc` | User | Get KYC status |
| POST | `/users/me/kyc` | User | Submit KYC |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/kyc` | Admin | List KYC applications |
| POST | `/admin/kyc/:id/approve` | Admin | Approve KYC |
| POST | `/admin/kyc/:id/reject` | Admin | Reject KYC |

---

## 4. Wallets & Balances

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/wallets` | User | Get all balances |
| GET | `/wallets/:asset` | User | Get asset wallet |
| POST | `/wallets/:asset/deposit-address` | User | Generate deposit address |
| POST | `/wallets/:asset/withdraw` | User | Request withdrawal |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/wallets/overview` | Admin | Platform wallet overview |
| GET | `/admin/wallets/assets` | Admin | List assets |
| POST | `/admin/wallets/assets` | Admin | Add asset |
| PATCH | `/admin/wallets/assets/:id` | Admin | Update asset |

---

## 5. Transactions

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/transactions` | User | Transaction history |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/transactions/deposits` | Admin | List deposits |
| GET | `/admin/transactions/withdrawals` | Admin | List withdrawals |
| POST | `/admin/transactions/withdrawals/:id/approve` | Admin | Approve withdrawal |
| POST | `/admin/transactions/withdrawals/:id/reject` | Admin | Reject withdrawal |

---

## 6. Trading Pairs

### Public / User
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/trading/pairs` | Public | List trading pairs |
| GET | `/trading/pairs/:symbol` | Public | Pair details |
| GET | `/trading/pairs/:symbol/orderbook` | Public | Order book |
| GET | `/trading/pairs/:symbol/trades` | Public | Recent trades |
| GET | `/trading/pairs/:symbol/klines` | Public | Candlestick data |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/trading/pairs` | Admin | List pairs (admin view) |
| POST | `/admin/trading/pairs` | Admin | Create trading pair |
| PUT | `/admin/trading/pairs/:id` | Admin | Update trading pair |
| PATCH | `/admin/trading/pairs/:id/status` | Admin | Toggle pair status |
| DELETE | `/admin/trading/pairs/:id` | Admin | Delete trading pair |
| GET | `/admin/trading/fees` | Admin | Get fee structure |
| PUT | `/admin/trading/fees` | Admin | Update fee structure |

---

## 7. Orders & Trading

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/orders` | User | Place order |
| GET | `/orders` | User | List orders |
| GET | `/orders/:orderId` | User | Order details |
| DELETE | `/orders/:orderId` | User | Cancel order |
| DELETE | `/orders` | User | Cancel all orders |
| GET | `/trades` | User | Trade history |

---

## 8. P2P Trading

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/p2p/ads` | Public | List P2P ads |
| POST | `/p2p/ads` | User | Create P2P ad |
| POST | `/p2p/orders` | User | Create P2P order |
| GET | `/p2p/orders` | User | List P2P orders |
| POST | `/p2p/orders/:id/mark-paid` | User | Mark as paid |
| POST | `/p2p/orders/:id/release` | User | Release crypto |
| POST | `/p2p/orders/:id/dispute` | User | Open dispute |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/p2p/traders` | Admin | List traders |
| GET | `/admin/p2p/orders` | Admin | List orders |
| GET | `/admin/p2p/disputes` | Admin | List disputes |
| POST | `/admin/p2p/disputes/:id/resolve` | Admin | Resolve dispute |
| GET | `/admin/p2p/payment-methods` | Admin | List payment methods |
| POST | `/admin/p2p/payment-methods` | Admin | Add payment method |

---

## 9. Savings Products

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/savings/products` | User | List products |
| POST | `/savings/subscribe` | User | Subscribe |
| GET | `/savings/subscriptions` | User | My subscriptions |
| POST | `/savings/redeem` | User | Redeem savings |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/savings/products` | Admin | List products |
| POST | `/admin/savings/products` | Admin | Create product |
| PUT | `/admin/savings/products/:id` | Admin | Update product |
| GET | `/admin/savings/deposits` | Admin | List user deposits |

---

## 10. Referrals

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/referrals` | User | My referrals |
| GET | `/referrals/earnings` | User | Earnings history |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/referrals/codes` | Admin | List codes |
| GET | `/admin/referrals/commissions` | Admin | List commissions |
| PUT | `/admin/referrals/settings` | Admin | Update settings |

---

## 11. Rewards & Tasks

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/rewards/tasks` | User | Available tasks |
| POST | `/rewards/tasks/:id/claim` | User | Claim reward |
| GET | `/rewards/vip` | User | VIP tier info |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/rewards/tasks` | Admin | List tasks |
| POST | `/admin/rewards/tasks` | Admin | Create task |
| GET | `/admin/rewards/vip-tiers` | Admin | VIP configuration |
| PUT | `/admin/rewards/vip-tiers` | Admin | Update VIP tiers |

---

## 12. Support Tickets

### User Frontend
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/support/tickets` | User | My tickets |
| POST | `/support/tickets` | User | Create ticket |
| GET | `/support/tickets/:id` | User | Ticket details |
| POST | `/support/tickets/:id/reply` | User | Reply to ticket |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/support/tickets` | Admin | List tickets |
| GET | `/admin/support/tickets/:id` | Admin | Ticket details |
| POST | `/admin/support/tickets/:id/reply` | Admin | Reply |
| PATCH | `/admin/support/tickets/:id/status` | Admin | Update status |
| PATCH | `/admin/support/tickets/:id/assign` | Admin | Assign to admin |
| GET | `/admin/support/canned-responses` | Admin | Canned responses |
| POST | `/admin/support/canned-responses` | Admin | Create response |

---

## 13. CMS & Content

### Public
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/cms/pages` | Public | List pages |
| GET | `/cms/pages/:slug` | Public | Get page |
| GET | `/cms/announcements` | Public | Announcements |
| GET | `/cms/footer` | Public | Footer content |
| GET | `/cms/social-links` | Public | Social links |

### Admin Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/cms/pages` | Admin | All pages |
| POST | `/admin/cms/pages` | Admin | Create page |
| PUT | `/admin/cms/pages/:id` | Admin | Update page |
| DELETE | `/admin/cms/pages/:id` | Admin | Delete page |
| GET | `/admin/cms/announcements` | Admin | List announcements |
| POST | `/admin/cms/announcements` | Admin | Create announcement |
| PUT | `/admin/cms/footer` | Admin | Update footer |
| PUT | `/admin/cms/social-links` | Admin | Update social |
| GET | `/admin/cms/branding` | Admin | Get branding |
| PUT | `/admin/cms/branding` | Admin | Update branding |

---

## 14. Admin Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/admins` | Admin | List admins |
| POST | `/admin/admins/invite` | Admin | Invite admin |
| PATCH | `/admin/admins/:id/role` | Admin | Update role |
| DELETE | `/admin/admins/:id` | Admin | Remove admin |
| GET | `/admin/roles` | Admin | Roles & permissions |
| GET | `/admin/audit-log` | Admin | Audit log |

---

## 15. Analytics

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/analytics/overview` | Admin | Platform overview |
| GET | `/admin/analytics/users` | Admin | User analytics |
| GET | `/admin/analytics/trading` | Admin | Trading analytics |
| GET | `/admin/analytics/revenue` | Admin | Revenue analytics |

---

## 16. System & Health

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | API health check |
| GET | `/admin/system/health` | Admin | Detailed health |
| GET | `/admin/system/logs` | Admin | System logs |
| GET | `/admin/settings/general` | Admin | General settings |
| PUT | `/admin/settings/general` | Admin | Update general |
| GET | `/admin/settings/security` | Admin | Security settings |
| PUT | `/admin/settings/security` | Admin | Update security |

---

## 17. Webhooks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/admin/webhooks` | Admin | Register webhook |
| GET | `/admin/webhooks` | Admin | List webhooks |
| DELETE | `/admin/webhooks/:id` | Admin | Remove webhook |

### Webhook Events
- `user.created` - New user registered
- `user.kyc_verified` - KYC approved
- `user.kyc_rejected` - KYC rejected
- `deposit.pending` - Deposit detected
- `deposit.completed` - Deposit confirmed
- `withdrawal.requested` - Withdrawal requested
- `withdrawal.completed` - Withdrawal processed
- `withdrawal.failed` - Withdrawal failed
- `trade.completed` - Trade executed
- `order.filled` - Order filled
- `order.cancelled` - Order cancelled
- `p2p.order_created` - P2P order created
- `p2p.dispute_opened` - P2P dispute opened
- `p2p.dispute_resolved` - P2P dispute resolved

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| UNAUTHORIZED | 401 | Invalid/missing token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid parameters |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| INSUFFICIENT_BALANCE | 400 | Not enough balance |
| KYC_REQUIRED | 403 | KYC required |
| 2FA_REQUIRED | 403 | 2FA required |
| TRADING_DISABLED | 403 | Trading disabled |

---

## Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Public | 100 requests | per minute |
| User | 300 requests | per minute |
| Admin | 600 requests | per minute |
| Order placement | 10 requests | per second |
| Withdrawals | 5 requests | per minute |

---

**Documentation Version:** 1.0
**Last Updated:** December 28, 2024
