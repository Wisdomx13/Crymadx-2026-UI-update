// CrymadX WebSocket Hook
// Provides real-time updates for prices, balances, and transactions

import { useEffect, useRef, useCallback, useState } from 'react';
import { tokenManager } from '../services/api';

// Use ReturnType<typeof setTimeout> for cross-environment compatibility
type TimeoutHandle = ReturnType<typeof setTimeout>;

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://backend.crymadx.io/ws';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
}

export interface BalanceUpdate {
  chain: string;
  balance: string;
  timestamp: string;
}

export interface TransactionUpdate {
  id: string;
  type: string;
  status: string;
  confirmations?: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketOptions {
  onPriceUpdate?: (update: PriceUpdate) => void;
  onBalanceUpdate?: (update: BalanceUpdate) => void;
  onTransactionUpdate?: (update: TransactionUpdate) => void;
  onMessage?: (message: WebSocketMessage) => void;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onPriceUpdate,
    onBalanceUpdate,
    onTransactionUpdate,
    onMessage,
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<TimeoutHandle | null>(null);

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);

  // Message handler
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Route to specific handlers
      switch (message.type) {
        case 'price_update':
          onPriceUpdate?.(message.data);
          break;
        case 'balance_update':
          onBalanceUpdate?.(message.data);
          break;
        case 'transaction_update':
          onTransactionUpdate?.(message.data);
          break;
        case 'subscribed':
          console.log('Subscribed to:', message.data.channel);
          break;
        case 'error':
          console.error('WebSocket error:', message.data);
          break;
      }

      // Call generic message handler
      onMessage?.(message);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [onPriceUpdate, onBalanceUpdate, onTransactionUpdate, onMessage]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus('connecting');

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setStatus('connected');
        reconnectCountRef.current = 0;

        // Authenticate if we have a token
        const token = tokenManager.getAccessToken();
        if (token) {
          ws.send(JSON.stringify({
            type: 'auth',
            token,
          }));
        }

        // Resubscribe to channels
        subscribedChannels.forEach(channel => {
          ws.send(JSON.stringify({
            type: 'subscribe',
            channel,
          }));
        });
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setStatus('disconnected');

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`Reconnecting... (attempt ${reconnectCountRef.current}/${reconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setStatus('error');
    }
  }, [handleMessage, subscribedChannels, reconnectAttempts, reconnectInterval]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus('disconnected');
  }, []);

  // Subscribe to a channel
  const subscribe = useCallback((channel: string, data?: any) => {
    if (!subscribedChannels.includes(channel)) {
      setSubscribedChannels(prev => [...prev, channel]);
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        channel,
        ...data,
      }));
    }
  }, [subscribedChannels]);

  // Unsubscribe from a channel
  const unsubscribe = useCallback((channel: string) => {
    setSubscribedChannels(prev => prev.filter(c => c !== channel));

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        channel,
      }));
    }
  }, []);

  // Subscribe to price updates
  const subscribePrices = useCallback((symbols: string[] = []) => {
    subscribe('prices', { symbols });
  }, [subscribe]);

  // Subscribe to balance updates
  const subscribeBalances = useCallback(() => {
    subscribe('balance');
  }, [subscribe]);

  // Subscribe to transaction updates
  const subscribeTransactions = useCallback(() => {
    subscribe('transactions');
  }, [subscribe]);

  // Send a message
  const send = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    status,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    subscribePrices,
    subscribeBalances,
    subscribeTransactions,
    send,
    isConnected: status === 'connected',
  };
};

export default useWebSocket;
