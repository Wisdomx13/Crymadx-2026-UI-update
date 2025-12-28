# CrymadX UI - Full Stack Developer API Integration Guide

## Overview

This is a **React + TypeScript** crypto trading platform UI built with Vite. All data is currently hardcoded/mocked. Your job is to connect real APIs to make this application functional.

**Tech Stack:**
- React 18.3.1 + TypeScript
- React Router v6.28.0
- Framer Motion (animations)
- Vite (build tool)
- Context API (state management)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── App.tsx              # Main routing - ALL ROUTES DEFINED HERE
├── main.tsx             # Entry point
├── components/          # 23 reusable UI components
├── screens/             # 12+ page components (WHERE YOU'LL WORK MOST)
├── context/
│   └── AuthContext.tsx  # Authentication state - CONNECT YOUR AUTH API HERE
├── theme/
│   ├── ThemeContext.tsx # Dark/Light mode
│   ├── colors.ts        # Color system
│   └── GlobalStyles.tsx # Global CSS
├── types/               # TypeScript types (currently empty - add your types here)
├── hooks/               # Custom hooks (empty - add API hooks here)
└── utils/               # Utilities (empty - add helpers here)
```

---

## PART 1: AUTHENTICATION INTEGRATION

### File: `src/context/AuthContext.tsx`

**Current State:** Mock login with localStorage

**What to Replace:**

```typescript
// CURRENT (lines ~45-55) - Mock login
const login = async (email: string, password: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay
  // ... mock logic
};

// REPLACE WITH:
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    localStorage.setItem('crymadx_token', data.token);
    localStorage.setItem('crymadx_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

### Required Auth Endpoints:

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user: { id, email, name, avatar } }` |
| POST | `/api/auth/register` | `{ name, email, phone, password, referralCode? }` | `{ token, user }` |
| POST | `/api/auth/logout` | - | `{ success: true }` |
| POST | `/api/auth/forgot-password` | `{ email }` | `{ success: true, message }` |
| GET | `/api/auth/me` | - (use token) | `{ user }` |

### Files to Update:
- `src/screens/LoginScreen.tsx` - Line ~80: Replace mock login
- `src/screens/RegisterScreen.tsx` - Line ~60: Add registration API call
- `src/screens/ForgotPasswordScreen.tsx` - Add password reset API call

---

## PART 2: WALLET INTEGRATION

### File: `src/screens/WalletScreen.tsx`

**Current State:** Hardcoded wallet assets (lines ~25-70)

**Hardcoded Data to Replace:**

```typescript
// CURRENT - REMOVE THIS:
const walletAssets: WalletAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', spotAvailable: 0.4234, ... },
  { symbol: 'ETH', name: 'Ethereum', spotAvailable: 3.2156, ... },
  // ... more hardcoded assets
];

// REPLACE WITH API CALL:
const [walletAssets, setWalletAssets] = useState<WalletAsset[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('crymadx_token');
      const response = await fetch('/api/wallet/assets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWalletAssets(data.assets);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchWallet();
}, []);
```

### Required Wallet Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet/assets` | Get all user balances |
| GET | `/api/wallet/balance/:symbol` | Get specific coin balance |
| POST | `/api/wallet/deposit/address` | Generate deposit address |
| POST | `/api/wallet/withdraw` | Request withdrawal |
| GET | `/api/wallet/history` | Transaction history |

### Expected Response Format for `/api/wallet/assets`:

```json
{
  "assets": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "spotAvailable": 0.4234,
      "spotInOrder": 0.0123,
      "fundingAvailable": 0.1,
      "price": 43576.00,
      "change": 2.34
    }
  ],
  "totalBalanceUSD": 25000.00
}
```

### Files to Update:
- `src/screens/WalletScreen.tsx` - Replace hardcoded assets
- `src/screens/DepositScreen.tsx` - Line ~30: Replace hardcoded crypto list, Line ~100: API for address generation
- `src/screens/WithdrawScreen.tsx` - Line ~25: Replace hardcoded data, add withdrawal API
- `src/screens/HistoryScreen.tsx` - Add transaction history API

---

## PART 3: TRADING INTEGRATION

### File: `src/screens/TradingScreen.tsx`

**Current State:** Mock trading data

**Data Types Already Defined (use these):**

```typescript
interface TradingPair {
  symbol: string;      // "BTCUSDT"
  baseAsset: string;   // "BTC"
  quoteAsset: string;  // "USDT"
  price: number;
  change: number;      // percentage
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  price: number;
  amount: number;
  time: string;
  side: 'buy' | 'sell';
}
```

### Required Trading Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trading/pairs` | List all trading pairs |
| GET | `/api/trading/pair/:symbol` | Get pair details (BTCUSDT) |
| GET | `/api/trading/orderbook/:symbol` | Get order book |
| GET | `/api/trading/trades/:symbol` | Recent trades |
| POST | `/api/trading/order` | Place order |
| GET | `/api/trading/orders` | User's open orders |
| DELETE | `/api/trading/order/:id` | Cancel order |

### Order Placement Request:

```json
{
  "symbol": "BTCUSDT",
  "side": "buy",
  "type": "limit",
  "price": 43500.00,
  "amount": 0.01
}
```

### WebSocket Integration (Recommended):

For real-time data, implement WebSocket connections:

```typescript
// Create a new file: src/hooks/useWebSocket.ts
const useWebSocket = (pair: string) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`wss://your-api.com/ws/trading/${pair}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'orderbook') setOrderBook(data.payload);
      if (data.type === 'trade') setTrades(prev => [data.payload, ...prev].slice(0, 50));
      if (data.type === 'price') setPrice(data.payload);
    };

    return () => ws.close();
  }, [pair]);

  return { orderBook, trades, price };
};
```

---

## PART 4: MARKETS INTEGRATION

### File: `src/screens/MarketsScreen.tsx`

**Current State:** 50+ hardcoded cryptocurrencies (lines ~15-100)

**Data Type:**

```typescript
interface MarketData {
  symbol: string;
  baseAsset: string;
  name: string;
  pair: string;
  price: number;
  change24h: number;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
  rank: number;
}

interface MarketStats {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  activeMarkets: number;
}
```

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/markets` | All markets with prices |
| GET | `/api/markets/stats` | Global market statistics |
| GET | `/api/markets/:symbol` | Single market details |

### Expected Response:

```json
{
  "markets": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "pair": "BTCUSDT",
      "price": 43576.00,
      "change24h": 2.34,
      "high": 44200.00,
      "low": 42800.00,
      "volume": 1250000000,
      "rank": 1
    }
  ],
  "stats": {
    "totalMarketCap": 1750000000000,
    "totalVolume24h": 85000000000,
    "btcDominance": 52.3,
    "activeMarkets": 350
  }
}
```

---

## PART 5: P2P TRADING INTEGRATION

### File: `src/screens/P2PScreen.tsx`

**Current State:** 25 mock trader profiles (lines ~30-150)

**Data Type:**

```typescript
interface P2POrder {
  id: string;
  type: 'buy' | 'sell';
  trader: string;
  verified: boolean;
  orders: number;
  completion: number;    // percentage
  rating: number;        // 1-5
  crypto: string;        // "BTC"
  fiat: string;          // "USD"
  price: number;
  available: number;
  limit: { min: number; max: number };
  paymentMethods: string[];
  timeLimit: number;     // minutes
  online: boolean;
}
```

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/p2p/orders` | List P2P orders |
| GET | `/api/p2p/orders?type=buy&crypto=BTC` | Filtered orders |
| POST | `/api/p2p/order` | Create P2P order |
| POST | `/api/p2p/trade/:orderId` | Start trade |
| GET | `/api/p2p/trades` | User's P2P trades |

### Query Parameters for `/api/p2p/orders`:

- `type`: 'buy' | 'sell'
- `crypto`: 'BTC', 'ETH', 'USDT', etc.
- `fiat`: 'USD', 'EUR', 'GBP', etc.
- `paymentMethod`: 'bank', 'paypal', etc.
- `page`, `limit`: pagination

---

## PART 6: USER PROFILE INTEGRATION

### File: `src/screens/ProfileScreen.tsx`

**Current State:** Mock profile data, avatar selection from DiceBear API

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/avatar` | Update avatar |
| GET | `/api/user/login-history` | Login history |
| GET | `/api/user/sessions` | Active sessions |
| DELETE | `/api/user/session/:id` | Revoke session |
| POST | `/api/user/2fa/enable` | Enable 2FA |
| POST | `/api/user/2fa/disable` | Disable 2FA |

### Profile Update Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "United States",
  "website": "https://johndoe.com"
}
```

---

## PART 7: REFERRAL SYSTEM INTEGRATION

### File: `src/screens/ReferralScreen.tsx`

**Current State:** Hardcoded referral data (lines ~15-50)

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/referral` | Get referral info & stats |
| GET | `/api/referral/list` | List of referrals |
| POST | `/api/referral/generate` | Generate new code |

### Expected Response for `/api/referral`:

```json
{
  "code": "JOHN2024",
  "link": "https://crymadx.com/register?ref=JOHN2024",
  "totalReferrals": 15,
  "activeReferrals": 12,
  "totalEarnings": 450.00,
  "pendingEarnings": 25.00,
  "commissionRate": "20%",
  "referrals": [
    {
      "id": "1",
      "username": "user***123",
      "date": "2024-01-15",
      "status": "active",
      "earnings": 50.00
    }
  ]
}
```

---

## PART 8: REWARDS SYSTEM INTEGRATION

### File: `src/screens/RewardsScreen.tsx`

**Current State:** Mock tasks and tiers (lines ~20-80)

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rewards` | Get rewards overview |
| GET | `/api/rewards/tasks` | Available tasks |
| POST | `/api/rewards/claim/:taskId` | Claim task reward |
| GET | `/api/rewards/history` | Reward history |

### Expected Response:

```json
{
  "points": 1250,
  "tier": {
    "name": "Silver",
    "minVolume": 10000,
    "benefits": ["0.08% trading fee", "Priority support"]
  },
  "tasks": [
    {
      "id": "daily_login",
      "title": "Daily Login",
      "description": "Log in daily",
      "reward": 10,
      "progress": 1,
      "total": 1,
      "completed": true
    }
  ]
}
```

---

## PART 9: SAVINGS/VAULT INTEGRATION

### File: `src/screens/SavingsVaultScreen.tsx`

**Current State:** Hardcoded savings products (lines ~20-60)

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/savings/products` | Available products |
| GET | `/api/savings/positions` | User's positions |
| POST | `/api/savings/subscribe` | Subscribe to product |
| POST | `/api/savings/redeem` | Redeem position |

### Subscribe Request:

```json
{
  "productId": "usdt_flexible",
  "amount": 1000,
  "term": "flexible"  // or "30days", "90days"
}
```

---

## PART 10: SUPPORT TICKETS INTEGRATION

### File: `src/screens/TicketsScreen.tsx`

**Current State:** Mock ticket data

### Required Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List user tickets |
| GET | `/api/tickets/:id` | Get ticket details |
| POST | `/api/tickets` | Create new ticket |
| POST | `/api/tickets/:id/message` | Add message |
| PUT | `/api/tickets/:id/close` | Close ticket |

---

## PART 11: RECOMMENDED FILE STRUCTURE FOR API LAYER

Create these new files:

```
src/
├── api/
│   ├── index.ts          # API client setup (axios/fetch)
│   ├── auth.ts           # Auth API calls
│   ├── wallet.ts         # Wallet API calls
│   ├── trading.ts        # Trading API calls
│   ├── markets.ts        # Markets API calls
│   ├── p2p.ts            # P2P API calls
│   ├── user.ts           # User/Profile API calls
│   ├── referral.ts       # Referral API calls
│   ├── rewards.ts        # Rewards API calls
│   ├── savings.ts        # Savings API calls
│   └── tickets.ts        # Support tickets API calls
├── hooks/
│   ├── useAuth.ts        # Auth hook (already exists in context)
│   ├── useWallet.ts      # Wallet data hook
│   ├── useMarkets.ts     # Markets data hook
│   ├── useWebSocket.ts   # Real-time data hook
│   └── useApi.ts         # Generic API hook with loading/error states
├── types/
│   └── index.ts          # All TypeScript interfaces
└── utils/
    ├── formatters.ts     # Price/number formatters
    └── validators.ts     # Form validation
```

---

## PART 12: API CLIENT SETUP

Create `src/api/index.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('crymadx_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);
```

---

## PART 13: ENVIRONMENT VARIABLES

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
VITE_RECAPTCHA_KEY=your_recaptcha_key
```

---

## PART 14: INTEGRATION CHECKLIST

Use this checklist to track your progress:

### Authentication
- [ ] Login API integration
- [ ] Register API integration
- [ ] Forgot password API
- [ ] Token refresh logic
- [ ] Logout API
- [ ] Protected route handling

### Wallet
- [ ] Fetch wallet balances
- [ ] Generate deposit addresses
- [ ] Submit withdrawals
- [ ] Transaction history

### Trading
- [ ] Fetch trading pairs
- [ ] Order book data (REST + WebSocket)
- [ ] Recent trades feed
- [ ] Place orders
- [ ] Cancel orders
- [ ] User's open orders

### Markets
- [ ] Market list with prices
- [ ] Market statistics
- [ ] Real-time price updates

### P2P Trading
- [ ] List P2P orders
- [ ] Create P2P order
- [ ] Initiate trade
- [ ] Trade chat/messaging

### User Profile
- [ ] Fetch profile
- [ ] Update profile
- [ ] Change avatar
- [ ] 2FA setup
- [ ] Login history
- [ ] Session management

### Referrals
- [ ] Fetch referral data
- [ ] Referral list

### Rewards
- [ ] Fetch tasks
- [ ] Claim rewards
- [ ] Tier information

### Savings
- [ ] Fetch products
- [ ] User positions
- [ ] Subscribe/redeem

### Support
- [ ] List tickets
- [ ] Create ticket
- [ ] Ticket messaging

---

## PART 15: IMPORTANT NOTES

### LocalStorage Keys Used:
- `crymadx_auth` - Authentication boolean
- `crymadx_user` - User JSON object
- `crymadx_token` - JWT token (add this)
- `crymadx_avatar` - User avatar URL
- `crymadx-theme` - Theme preference ('dark' | 'light')

### Error Handling:
Add error boundaries and toast notifications. The UI uses `framer-motion` for animations - consider adding error state animations.

### Loading States:
Each screen needs loading state handling. Use skeleton loaders matching the glassmorphism design.

### Security Considerations:
1. Always validate JWT tokens on backend
2. Implement rate limiting
3. Sanitize all user inputs
4. Use HTTPS in production
5. Implement CORS properly
6. Add CSRF protection for sensitive operations

### Coin Logo URLs:
The UI fetches logos from:
- `https://cryptologos.cc/logos/{symbol}-{symbol}-logo.png`
- Fallback to generated avatars

---

## SUMMARY: FILES TO MODIFY (BY PRIORITY)

### High Priority (Core Functionality):
1. `src/context/AuthContext.tsx` - Authentication
2. `src/screens/WalletScreen.tsx` - Wallet balances
3. `src/screens/TradingScreen.tsx` - Trading
4. `src/screens/MarketsScreen.tsx` - Market data

### Medium Priority:
5. `src/screens/DepositScreen.tsx` - Deposits
6. `src/screens/WithdrawScreen.tsx` - Withdrawals
7. `src/screens/ProfileScreen.tsx` - User profile
8. `src/screens/P2PScreen.tsx` - P2P trading

### Lower Priority:
9. `src/screens/ReferralScreen.tsx` - Referrals
10. `src/screens/RewardsScreen.tsx` - Rewards
11. `src/screens/SavingsVaultScreen.tsx` - Savings
12. `src/screens/TicketsScreen.tsx` - Support
13. `src/screens/HistoryScreen.tsx` - Transaction history

---

## QUESTIONS?

If you have any questions about this UI, the component structure, or specific implementation details, refer to the source files or reach out to the UI developer.

Good luck with the integration!
