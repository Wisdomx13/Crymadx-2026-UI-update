// CrymadX API Type Definitions

// ============================================
// Auth Types
// ============================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  kycLevel: number;
  is2FAEnabled: boolean;
  antiPhishingSet?: boolean;
  referralCode: string;
  createdAt: string;
  preferredCurrency?: string;
  timezone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  message: string;
  user?: User;
  tokens?: AuthTokens;
  requires2FA?: boolean;
  userId?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// ============================================
// Balance & Wallet Types
// ============================================

export interface TokenBalance {
  symbol: string;
  contractAddress: string;
  balance: string;
  balanceUsd: string;
  decimals: number;
}

export interface ChainBalance {
  chain: string;
  symbol: string;
  balance: string;
  balanceUsd: string;
  address: string;
  tokens?: TokenBalance[];
}

export interface BalancesResponse {
  balances: ChainBalance[];
  totalBalanceUsd: string;
  updatedAt: string;
}

export interface WalletAddress {
  chain: string;
  address: string;
  type: 'evm' | 'solana' | 'utxo' | 'xrp' | 'stellar' | 'tron';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'stake' | 'unstake' | 'savings';
  chain: string;
  symbol: string;
  amount: string;
  amountUsd: string;
  txHash?: string;
  status: 'pending' | 'confirming' | 'confirmed' | 'completed' | 'failed' | 'cancelled';
  confirmations?: number;
  address?: string;
  createdAt: string;
  completedAt?: string;
}

// ============================================
// Price Types
// ============================================

export interface PriceData {
  usd: number;
  eur?: number;
  gbp?: number;
  change24h: number;
  change7d?: number;
  volume24h: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
}

export interface PricesResponse {
  prices: Record<string, PriceData>;
  updatedAt: string;
}

export interface SinglePriceResponse {
  symbol: string;
  price: {
    usd: number;
    eur?: number;
    gbp?: number;
  };
  change24h: number;
  change7d?: number;
  volume24h: number;
  marketCap?: number;
  updatedAt: string;
}

// ============================================
// Swap Types
// ============================================

export interface SwapPair {
  from: string;
  to: string;
  minAmount: string;
  maxAmount: string;
  rate: string;
  estimatedTime: string;
}

export interface SwapEstimate {
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  fee: string;
  networkFee?: string;
  estimatedArrival?: string;
  validUntil?: string;
  validFor?: number;
  rateId?: string;
  minAmount?: string;
  maxAmount?: string;
}

export interface SwapOrder {
  id: string;
  status: 'pending' | 'waiting' | 'confirming' | 'exchanging' | 'sending' | 'finished' | 'failed' | 'refunded';
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
  // Legacy fields for backwards compatibility
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount: string;
  toAmount?: string;
  expectedAmount?: string;
  payinAddress?: string;
  payinExtraId?: string;
  payoutAddress?: string;
  payinHash?: string;
  payoutHash?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Staking Types
// ============================================

export interface StakingOption {
  chain: string;
  protocol: string;
  apy: number;
  minStake: string;
  maxStake: string;
  unbondingPeriod: number;
  rewardToken: string;
}

export interface StakingPosition {
  id: string;
  chain: string;
  protocol: string;
  stakedAmount: string;
  stakedAmountUsd: string;
  rewardAmount: string;
  rewardAmountUsd: string;
  apy: number;
  stakedAt: string;
}

export interface StakingStats {
  totalStaked: string;
  totalRewards: string;
  avgApy: number;
  positions: number;
}

// ============================================
// Savings Types
// ============================================

export interface SavingsProduct {
  id: string;
  name: string;
  apy: number;
  lockPeriod: number;
  minDeposit: string;
  maxDeposit: string;
  supportedAssets: string[];
  type?: 'flexible' | 'fixed';
  totalCapacity?: number;
  currentDeposits?: number;
  status?: 'active' | 'inactive';
}

export interface SavingsDeposit {
  id: string;
  productId: string;
  asset: string;
  amount: string;
  accruedInterest: string;
  apy: number;
  startDate: string;
  unlockDate?: string;
  status: 'active' | 'matured' | 'withdrawn';
  autoRenew?: boolean;
}

// ============================================
// Auto-Invest (DCA) Types
// ============================================

export interface AutoInvestPlan {
  id: string;
  name: string;
  asset: string;
  sourceAsset: string;
  amount: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextExecution: string;
  status: 'active' | 'paused';
  totalInvested: string;
  totalAcquired: string;
  createdAt: string;
}

export interface AutoInvestExecution {
  id: string;
  amount: string;
  acquired: string;
  rate: string;
  status: 'completed' | 'failed';
  executedAt: string;
}

// ============================================
// Referral Types
// ============================================

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
}

export interface Referral {
  id: string;
  email: string;
  status: 'pending' | 'qualified' | 'active';
  totalVolume: string;
  totalRewards: string;
  joinedAt: string;
}

export interface ReferralRewards {
  pending: string;
  paid: string;
  total: string;
}

// ============================================
// NFT Types
// ============================================

export interface NFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  description?: string;
  image: string;
  collection?: string;
  floorPrice?: string;
  lastSale?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  owner?: string;
  creator?: string;
}

export interface NFTListing {
  id: string;
  nft: NFT;
  price: string;
  currency: string;
  seller: string;
  createdAt: string;
  expiresAt?: string;
}

// ============================================
// Portfolio Types
// ============================================

export interface PortfolioOverview {
  totalValue: string;
  totalCost: string;
  totalPnl: string;
  totalPnlPercent: number;
  change24h: string;
  change24hPercent: number;
}

export interface PortfolioAllocation {
  asset: string;
  value: string;
  percent: number;
}

export interface PortfolioPerformance {
  daily: { return: number; pnl: string };
  weekly: { return: number; pnl: string };
  monthly: { return: number; pnl: string };
  yearly: { return: number; pnl: string };
  allTime: { return: number; pnl: string };
}

// ============================================
// User Profile Types
// ============================================

export interface UserProfile extends User {
  notificationSettings?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface LoginHistory {
  id: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: string;
  success: boolean;
}

// ============================================
// 2FA Types
// ============================================

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntry: {
    secret: string;
    issuer: string;
    account: string;
  };
}

export interface TwoFactorEnableResponse {
  message: string;
  backupCodes: string[];
}

// ============================================
// Support Ticket Types
// ============================================

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  senderName?: string;
  createdAt: string;
  attachments?: string[];
}

// ============================================
// Fee Types
// ============================================

export interface FeeStructure {
  swap: {
    percentage: number;
    minimum: string;
  };
  withdrawal: Record<string, {
    percentage: number;
    minimum: string;
    network: string;
  }>;
}

export interface FeeEstimate {
  platform: string;
  network: string;
  total: string;
  totalUsd: string;
}

// ============================================
// API Response Wrappers
// ============================================

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
