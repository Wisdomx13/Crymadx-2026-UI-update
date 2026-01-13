// CrymadX P2P Service
// Handles peer-to-peer trading operations

import { api } from './api';

export interface P2PTrader {
  id: string;
  name: string;
  verified: boolean;
  completedOrders: number;
  completionRate: number;
  rating: number;
  online: boolean;
}

export interface P2POrder {
  id: string;
  type: 'buy' | 'sell';
  trader: P2PTrader;
  crypto: string;
  fiat: string;
  price: string;
  available: string;
  minLimit: string;
  maxLimit: string;
  paymentMethods: string[];
  timeLimit: number;
  createdAt: string;
}

export interface P2PTrade {
  id: string;
  orderId: string;
  order?: P2POrder;
  status: 'pending' | 'payment_sent' | 'completed' | 'cancelled' | 'disputed';
  escrowStatus?: 'locked' | 'released' | 'returned';
  crypto?: string;
  amount: string;
  cryptoAmount: string;
  fiatAmount?: string;
  total: string;
  price?: string;
  paymentMethods?: string[];
  paymentMethod?: string;
  paymentDeadline?: string;
  isBuyer?: boolean;
  counterparty?: {
    id: string;
    name: string;
    rating: number;
    completedOrders: number;
  };
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface P2PMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  attachmentUrl?: string;
  attachmentType?: string;
  createdAt: string;
  isOwn: boolean;
}

export interface P2POrderFilters {
  type?: 'buy' | 'sell';
  crypto?: string;
  fiat?: string;
  paymentMethod?: string;
  page?: number;
  limit?: number;
}

export interface CreateP2POrderParams {
  type: 'buy' | 'sell';
  crypto: string;
  fiat: string;
  price: string;
  amount: string;
  minLimit: string;
  maxLimit: string;
  paymentMethods: string[];
  timeLimit: number;
}

export interface CreateP2PTradeParams {
  orderId: string;
  amount: string;
  paymentMethod?: string;
}

// User saved payment methods
export interface UserPaymentMethod {
  id: string;
  type: 'bank_transfer' | 'paypal' | 'wise' | 'zelle' | 'venmo' | 'cashapp' | 'revolut' | 'other';
  label: string; // Display name like "My Chase Bank"
  details: {
    // Bank transfer fields
    bankName?: string;
    accountNumber?: string; // Last 4 digits only for display
    accountHolderName?: string;
    routingNumber?: string; // Last 4 digits only for display
    iban?: string; // Last 4 digits only for display
    swiftCode?: string;
    // E-wallet fields
    email?: string; // PayPal, Wise email
    username?: string; // Venmo, Cash App username
    phoneNumber?: string; // Zelle phone or other payment apps
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodParams {
  type: UserPaymentMethod['type'];
  label: string;
  details: UserPaymentMethod['details'];
  isDefault?: boolean;
}

export const p2pService = {
  // Get list of P2P orders
  getOrders: async (filters?: P2POrderFilters): Promise<{ orders: P2POrder[]; total: number; page: number; totalPages: number }> => {
    const params: Record<string, any> = {};
    if (filters?.type) params.type = filters.type;
    if (filters?.crypto) params.crypto = filters.crypto;
    if (filters?.fiat) params.fiat = filters.fiat;
    if (filters?.paymentMethod) params.paymentMethod = filters.paymentMethod;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    return api.get('/api/p2p/orders', params, false);
  },

  // Get single order details
  getOrderDetails: async (orderId: string): Promise<{ order: P2POrder }> => {
    return api.get(`/api/p2p/orders/${orderId}`, undefined, false);
  },

  // Create a new P2P order (requires auth)
  createOrder: async (params: CreateP2POrderParams): Promise<{ order: P2POrder }> => {
    return api.post('/api/p2p/orders', params);
  },

  // Cancel an order (requires auth, only own orders)
  cancelOrder: async (orderId: string): Promise<{ message: string }> => {
    return api.post(`/api/p2p/orders/${orderId}/cancel`, {});
  },

  // Get user's own orders (requires auth)
  getMyOrders: async (): Promise<{ orders: P2POrder[] }> => {
    return api.get('/api/p2p/my-orders');
  },

  // Create a trade against an order (requires auth)
  createTrade: async (params: CreateP2PTradeParams): Promise<{ trade: P2PTrade }> => {
    return api.post('/api/p2p/trades', params);
  },

  // Get trade details (requires auth)
  getTradeDetails: async (tradeId: string): Promise<{ trade: P2PTrade }> => {
    return api.get(`/api/p2p/trades/${tradeId}`);
  },

  // Confirm payment sent (buyer action)
  confirmPayment: async (tradeId: string): Promise<{ trade: P2PTrade }> => {
    return api.post(`/api/p2p/trades/${tradeId}/confirm-payment`, {});
  },

  // Release crypto (seller action)
  releaseCrypto: async (tradeId: string): Promise<{ trade: P2PTrade }> => {
    return api.post(`/api/p2p/trades/${tradeId}/release`, {});
  },

  // Get user's trades (requires auth)
  getMyTrades: async (): Promise<{ trades: P2PTrade[] }> => {
    return api.get('/api/p2p/my-trades');
  },

  // Initiate dispute (requires auth)
  initiateDispute: async (tradeId: string, reason: string): Promise<{ message: string }> => {
    return api.post(`/api/p2p/trades/${tradeId}/dispute`, { reason });
  },

  // Rate a trade partner (requires auth)
  rateTrade: async (tradeId: string, rating: number, comment?: string): Promise<{ message: string }> => {
    return api.post(`/api/p2p/trades/${tradeId}/rate`, { rating, comment });
  },

  // Cancel a trade (before payment sent)
  cancelTrade: async (tradeId: string, reason?: string): Promise<{ message: string }> => {
    return api.post(`/api/p2p/trades/${tradeId}/cancel`, { reason });
  },

  // Get trade messages/chat
  getMessages: async (tradeId: string): Promise<{ messages: P2PMessage[] }> => {
    return api.get(`/api/p2p/trades/${tradeId}/messages`);
  },

  // Send a message in trade chat
  sendMessage: async (tradeId: string, message: string, attachmentUrl?: string, attachmentType?: string): Promise<{ message: P2PMessage }> => {
    return api.post(`/api/p2p/trades/${tradeId}/messages`, { message, attachmentUrl, attachmentType });
  },

  // ========== User Payment Methods ==========

  // Get user's saved payment methods
  getPaymentMethods: async (): Promise<{ paymentMethods: UserPaymentMethod[] }> => {
    return api.get('/api/p2p/payment-methods');
  },

  // Add a new payment method
  addPaymentMethod: async (params: CreatePaymentMethodParams): Promise<{ paymentMethod: UserPaymentMethod }> => {
    return api.post('/api/p2p/payment-methods', params);
  },

  // Update an existing payment method
  updatePaymentMethod: async (methodId: string, params: Partial<CreatePaymentMethodParams>): Promise<{ paymentMethod: UserPaymentMethod }> => {
    return api.put(`/api/p2p/payment-methods/${methodId}`, params);
  },

  // Delete a payment method
  deletePaymentMethod: async (methodId: string): Promise<{ message: string }> => {
    return api.delete(`/api/p2p/payment-methods/${methodId}`);
  },

  // Set a payment method as default
  setDefaultPaymentMethod: async (methodId: string): Promise<{ paymentMethod: UserPaymentMethod }> => {
    return api.post(`/api/p2p/payment-methods/${methodId}/set-default`, {});
  },
};

export default p2pService;
