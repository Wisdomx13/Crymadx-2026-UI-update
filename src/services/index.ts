// CrymadX Services Index
// Export all API services for easy importing

export { api, apiRequest, tokenManager, AUTH_LOGOUT_EVENT } from './api';
export { authService } from './authService';
export { balanceService } from './balanceService';
export type { Balance } from './balanceService';
export { priceService } from './priceService';
export { swapService } from './swapService';
export { userService } from './userService';
export { savingsService } from './savingsService';
export { stakingService } from './stakingService';
export { referralService } from './referralService';
export { nftService } from './nftService';
export { portfolioService } from './portfolioService';
export { autoInvestService } from './autoInvestService';
export { otpService } from './otpService';
export { feeService } from './feeService';
export { depositService, chainConfigs, tokenConfigs } from './depositService';
export { withdrawalService, withdrawalLimits } from './withdrawalService';
export { supportService } from './supportService';
export { spotTradingService } from './spotTradingService';
export type { SpotOrder, SpotTradingPair, SpotQuote, CreateOrderRequest } from './spotTradingService';
export { p2pService } from './p2pService';
export type { P2POrder, P2PTrade, P2PTrader, P2POrderFilters, CreateP2POrderParams, CreateP2PTradeParams } from './p2pService';
export { rewardsService } from './rewardsService';
export type { RewardsTask, UserRewardsSummary, RewardsTier, RewardHistoryItem } from './rewardsService';
export { tokenService } from './tokenService';
export type { Token, GroupedToken, TokenNetwork, Network, NetworkType } from './tokenService';

// Re-export types
export type * from '../types/api';
