import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  History,
  Repeat,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  ArrowRightLeft,
  QrCode,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { CryptoIcon, ResponsiveLayout, GlassCard, Button, GlowingSnowBackground } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { useThemeMode } from '../../theme/ThemeContext';
import { LiquidGlassBackground } from '../../components/Glass3D';

// Premium liquid shimmer effect for cards - enhanced for both modes
const LiquidShimmer: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: '-100%' }}
      animate={{
        opacity: isDark ? [0, 0.3, 0] : [0, 0.15, 0],
        x: ['-100%', '200%'],
      }}
      transition={{
        duration: isDark ? 3 : 4,
        repeat: Infinity,
        repeatDelay: isDark ? 8 : 12,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        bottom: 0,
        background: isDark
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(16,185,129,0.08), rgba(14,165,233,0.04), transparent)',
        pointerEvents: 'none',
      }}
    />
  );
};

// Premium liquid wave for card backgrounds - enhanced for light mode
const LiquidWave: React.FC<{ delay?: number; color?: string; isDark?: boolean }> = ({ delay = 0, color = 'rgba(2, 192, 118, 0.06)', isDark = true }) => {
  const lightColor = color.includes('118') ? 'rgba(16, 185, 129, 0.04)' : 'rgba(14, 165, 233, 0.03)';

  return (
    <motion.div
      initial={{ x: '-100%', opacity: isDark ? 0.15 : 0.1 }}
      animate={{
        x: ['100%', '-100%'],
        opacity: isDark ? [0.08, 0.2, 0.08] : [0.05, 0.12, 0.05],
      }}
      transition={{
        duration: isDark ? 12 : 18,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark
          ? `linear-gradient(90deg, transparent, ${color}, transparent)`
          : `linear-gradient(90deg, transparent, ${lightColor}, transparent)`,
        pointerEvents: 'none',
      }}
    />
  );
};

// Decorative background blobs for light mode cards
const LightModeDecor: React.FC<{ variant?: 'green' | 'blue' | 'purple' | 'gold' }> = ({ variant = 'green' }) => {
  const colors: Record<string, string> = {
    green: 'rgba(16, 185, 129, 0.08)',
    blue: 'rgba(14, 165, 233, 0.06)',
    purple: 'rgba(139, 92, 246, 0.05)',
    gold: 'rgba(245, 158, 11, 0.06)',
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-15%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors[variant]} 0%, transparent 70%)`,
        filter: 'blur(25px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.blue} 0%, transparent 70%)`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />
    </>
  );
};

// Mock markets data - Top 25 coins for dashboard preview
const marketsData = [
  { symbol: 'BTC', name: 'Bitcoin', pair: 'BTC/USDT', price: 43576.50, change24h: 2.34, volume: '2.1B', high24h: 44120.00, low24h: 42890.00 },
  { symbol: 'ETH', name: 'Ethereum', pair: 'ETH/USDT', price: 2345.67, change24h: -1.25, volume: '1.8B', high24h: 2398.00, low24h: 2310.00 },
  { symbol: 'BNB', name: 'BNB', pair: 'BNB/USDT', price: 312.45, change24h: 0.89, volume: '892M', high24h: 318.50, low24h: 308.20 },
  { symbol: 'SOL', name: 'Solana', pair: 'SOL/USDT', price: 98.45, change24h: 5.67, volume: '1.2B', high24h: 102.30, low24h: 92.80 },
  { symbol: 'XRP', name: 'Ripple', pair: 'XRP/USDT', price: 0.62, change24h: 3.12, volume: '645M', high24h: 0.65, low24h: 0.59 },
  { symbol: 'ADA', name: 'Cardano', pair: 'ADA/USDT', price: 0.58, change24h: -2.45, volume: '412M', high24h: 0.61, low24h: 0.56 },
  { symbol: 'AVAX', name: 'Avalanche', pair: 'AVAX/USDT', price: 38.90, change24h: 4.23, volume: '567M', high24h: 40.20, low24h: 37.10 },
  { symbol: 'DOT', name: 'Polkadot', pair: 'DOT/USDT', price: 7.82, change24h: 1.56, volume: '298M', high24h: 8.05, low24h: 7.65 },
  { symbol: 'DOGE', name: 'Dogecoin', pair: 'DOGE/USDT', price: 0.0823, change24h: 6.78, volume: '456M', high24h: 0.0865, low24h: 0.0798 },
  { symbol: 'LINK', name: 'Chainlink', pair: 'LINK/USDT', price: 14.56, change24h: 2.89, volume: '234M', high24h: 15.12, low24h: 14.10 },
  { symbol: 'MATIC', name: 'Polygon', pair: 'MATIC/USDT', price: 0.789, change24h: -0.56, volume: '189M', high24h: 0.812, low24h: 0.765 },
  { symbol: 'UNI', name: 'Uniswap', pair: 'UNI/USDT', price: 6.23, change24h: 1.45, volume: '123M', high24h: 6.45, low24h: 6.05 },
  { symbol: 'LTC', name: 'Litecoin', pair: 'LTC/USDT', price: 72.34, change24h: -1.89, volume: '198M', high24h: 74.50, low24h: 71.20 },
  { symbol: 'ATOM', name: 'Cosmos', pair: 'ATOM/USDT', price: 9.45, change24h: 3.21, volume: '156M', high24h: 9.78, low24h: 9.12 },
  { symbol: 'XLM', name: 'Stellar', pair: 'XLM/USDT', price: 0.1234, change24h: 4.56, volume: '134M', high24h: 0.1289, low24h: 0.1198 },
  { symbol: 'NEAR', name: 'NEAR Protocol', pair: 'NEAR/USDT', price: 3.45, change24h: 7.89, volume: '212M', high24h: 3.67, low24h: 3.21 },
  { symbol: 'FIL', name: 'Filecoin', pair: 'FIL/USDT', price: 5.23, change24h: -2.34, volume: '98M', high24h: 5.45, low24h: 5.01 },
  { symbol: 'ARB', name: 'Arbitrum', pair: 'ARB/USDT', price: 1.12, change24h: 5.67, volume: '187M', high24h: 1.18, low24h: 1.05 },
  { symbol: 'OP', name: 'Optimism', pair: 'OP/USDT', price: 2.34, change24h: 3.45, volume: '145M', high24h: 2.45, low24h: 2.21 },
  { symbol: 'INJ', name: 'Injective', pair: 'INJ/USDT', price: 23.45, change24h: 8.12, volume: '167M', high24h: 24.89, low24h: 21.90 },
  { symbol: 'SUI', name: 'Sui', pair: 'SUI/USDT', price: 1.12, change24h: 4.56, volume: '234M', high24h: 1.18, low24h: 1.05 },
  { symbol: 'TON', name: 'Toncoin', pair: 'TON/USDT', price: 5.67, change24h: 2.34, volume: '289M', high24h: 5.89, low24h: 5.45 },
  { symbol: 'PEPE', name: 'Pepe', pair: 'PEPE/USDT', price: 0.00000812, change24h: 12.45, volume: '456M', high24h: 0.00000890, low24h: 0.00000756 },
  { symbol: 'SHIB', name: 'Shiba Inu', pair: 'SHIB/USDT', price: 0.00000912, change24h: -3.21, volume: '345M', high24h: 0.00000956, low24h: 0.00000878 },
  { symbol: 'WIF', name: 'dogwifhat', pair: 'WIF/USDT', price: 1.23, change24h: 15.67, volume: '312M', high24h: 1.35, low24h: 1.05 },
];

// Crypto list for deposit/withdraw (60+ cryptocurrencies)
const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', balance: '0.00', usdValue: '0.00', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'USDT', name: 'Tether', network: 'TRC-20', balance: '0.00', usdValue: '0.00', address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9' },
  { symbol: 'BNB', name: 'BNB', network: 'BEP-20', balance: '0.00', usdValue: '0.00', address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2' },
  { symbol: 'SOL', name: 'Solana', network: 'Solana', balance: '0.00', usdValue: '0.00', address: '7EcDhSYGxXyscszYEp35KHN8sNSMV9M3DfNKGqoZLeFb' },
  { symbol: 'XRP', name: 'Ripple', network: 'XRP Ledger', balance: '0.00', usdValue: '0.00', address: 'rN7n3473SaZBCG4dFL83w7a1RXtXtbk2D9' },
  { symbol: 'DOGE', name: 'Dogecoin', network: 'Dogecoin', balance: '0.00', usdValue: '0.00', address: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L' },
  { symbol: 'ADA', name: 'Cardano', network: 'Cardano', balance: '0.00', usdValue: '0.00', address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x' },
  { symbol: 'AVAX', name: 'Avalanche', network: 'C-Chain', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'DOT', name: 'Polkadot', network: 'Polkadot', balance: '0.00', usdValue: '0.00', address: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg' },
  { symbol: 'MATIC', name: 'Polygon', network: 'Polygon', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'LINK', name: 'Chainlink', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'UNI', name: 'Uniswap', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'LTC', name: 'Litecoin', network: 'Litecoin', balance: '0.00', usdValue: '0.00', address: 'LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ATOM', name: 'Cosmos', network: 'Cosmos', balance: '0.00', usdValue: '0.00', address: 'cosmos1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'XLM', name: 'Stellar', network: 'Stellar', balance: '0.00', usdValue: '0.00', address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5' },
  { symbol: 'ALGO', name: 'Algorand', network: 'Algorand', balance: '0.00', usdValue: '0.00', address: '7ZUECA7HFLZTXENRV24SHLU4LKW2EWWQ' },
  { symbol: 'VET', name: 'VeChain', network: 'VeChain', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'FIL', name: 'Filecoin', network: 'Filecoin', balance: '0.00', usdValue: '0.00', address: 'f1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za' },
  { symbol: 'TRX', name: 'TRON', network: 'TRC-20', balance: '0.00', usdValue: '0.00', address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9' },
  { symbol: 'ETC', name: 'Ethereum Classic', network: 'ETC', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'XMR', name: 'Monero', network: 'Monero', balance: '0.00', usdValue: '0.00', address: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3' },
  { symbol: 'AAVE', name: 'Aave', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'MKR', name: 'Maker', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'COMP', name: 'Compound', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'SNX', name: 'Synthetix', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'YFI', name: 'yearn.finance', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'SUSHI', name: 'SushiSwap', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'CRV', name: 'Curve', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: '1INCH', name: '1inch', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'BAT', name: 'Basic Attention', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'ENJ', name: 'Enjin Coin', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'MANA', name: 'Decentraland', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'SAND', name: 'The Sandbox', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'AXS', name: 'Axie Infinity', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'GALA', name: 'Gala', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'APE', name: 'ApeCoin', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'SHIB', name: 'Shiba Inu', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'PEPE', name: 'Pepe', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'FLOKI', name: 'Floki', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'NEAR', name: 'NEAR Protocol', network: 'NEAR', balance: '0.00', usdValue: '0.00', address: 'crymadx.near' },
  { symbol: 'FTM', name: 'Fantom', network: 'Fantom', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'ONE', name: 'Harmony', network: 'Harmony', balance: '0.00', usdValue: '0.00', address: 'one1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'HBAR', name: 'Hedera', network: 'Hedera', balance: '0.00', usdValue: '0.00', address: '0.0.1234567' },
  { symbol: 'EGLD', name: 'MultiversX', network: 'MultiversX', balance: '0.00', usdValue: '0.00', address: 'erd1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'KAVA', name: 'Kava', network: 'Kava', balance: '0.00', usdValue: '0.00', address: 'kava1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ZEC', name: 'Zcash', network: 'Zcash', balance: '0.00', usdValue: '0.00', address: 't1XVrr7ELs2xZq23LU9xTsLNkAJBs4HvPAG' },
  { symbol: 'DASH', name: 'Dash', network: 'Dash', balance: '0.00', usdValue: '0.00', address: 'XnYtXpT3bLSiGJdZvJfqLkVJxHGMFy7Wnf' },
  { symbol: 'NEO', name: 'Neo', network: 'Neo', balance: '0.00', usdValue: '0.00', address: 'AQVh2pG732YvtNaxEGkQUei3YA4cvo7d2i' },
  { symbol: 'WAVES', name: 'Waves', network: 'Waves', balance: '0.00', usdValue: '0.00', address: '3P2HNUd5VUPLMQkJmctTPEeeHumiPN2GkTb' },
  { symbol: 'IOTA', name: 'IOTA', network: 'IOTA', balance: '0.00', usdValue: '0.00', address: 'iota1qrhacyfwlcnzkvzteumekfkrrwks98mpdm37cj4' },
  { symbol: 'ZIL', name: 'Zilliqa', network: 'Zilliqa', balance: '0.00', usdValue: '0.00', address: 'zil1gvr0jgwfsfmxzcg7dkc5h4lk5w3mf5g9pqyfpc' },
  { symbol: 'THETA', name: 'Theta Network', network: 'Theta', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'USDC', name: 'USD Coin', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'DAI', name: 'Dai', network: 'ERC-20', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'BUSD', name: 'Binance USD', network: 'BEP-20', balance: '0.00', usdValue: '0.00', address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2' },
  { symbol: 'ARB', name: 'Arbitrum', network: 'Arbitrum', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'OP', name: 'Optimism', network: 'Optimism', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'INJ', name: 'Injective', network: 'Injective', balance: '0.00', usdValue: '0.00', address: 'inj1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'SUI', name: 'Sui', network: 'Sui', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
  { symbol: 'SEI', name: 'Sei', network: 'Sei', balance: '0.00', usdValue: '0.00', address: 'sei1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'APT', name: 'Aptos', network: 'Aptos', balance: '0.00', usdValue: '0.00', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87' },
];

// Transaction history mock data
const transactionHistory = [
  { id: 1, type: 'deposit', symbol: 'BTC', amount: '0.05', usdValue: '2178.50', status: 'completed', date: '2024-01-15 14:32', txHash: '0x1234...5678' },
  { id: 2, type: 'withdraw', symbol: 'ETH', amount: '1.5', usdValue: '3518.00', status: 'completed', date: '2024-01-14 09:15', txHash: '0xabcd...efgh' },
  { id: 3, type: 'convert', symbol: 'USDT→BTC', amount: '500', usdValue: '500.00', status: 'completed', date: '2024-01-13 18:45', txHash: '0x9876...5432' },
  { id: 4, type: 'deposit', symbol: 'SOL', amount: '25', usdValue: '2461.25', status: 'pending', date: '2024-01-12 11:20', txHash: '0xfedc...ba98' },
  { id: 5, type: 'withdraw', symbol: 'USDT', amount: '1000', usdValue: '1000.00', status: 'failed', date: '2024-01-11 16:55', txHash: '0x1357...2468' },
];

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { mode, colors } = useThemeMode();
  const [hideBalance, setHideBalance] = useState(false);

  // Quick Stats Data - inside component to use theme colors
  const quickStats = [
    { label: 'Total Assets', value: '12', icon: <Wallet size={18} />, color: colors.primary[400] },
    { label: "Today's PNL", value: '$0.00', icon: <TrendingUp size={18} />, color: colors.trading.buy, subValue: '+0.00%' },
    { label: 'Open Orders', value: '0', icon: <RefreshCw size={18} />, color: colors.secondary[400] },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeMarketTab, setActiveMarketTab] = useState<'hot' | 'gainers' | 'losers' | 'new'>('hot');
  const [priceAnimations, setPriceAnimations] = useState<{[key: string]: 'up' | 'down' | null}>({});

  // Modal states
  const [cryptoSearch, setCryptoSearch] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoList[0]);
  const [depositStep, setDepositStep] = useState<'select' | 'address'>('select');
  const [withdrawStep, setWithdrawStep] = useState<'select' | 'amount' | 'confirm'>('select');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [convertFromCrypto, setConvertFromCrypto] = useState(cryptoList[0]);
  const [convertToCrypto, setConvertToCrypto] = useState(cryptoList[1]);
  const [convertAmount, setConvertAmount] = useState('');
  const [convertStep, setConvertStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposit' | 'withdraw' | 'convert'>('all');

  // Simulate live price updates for liquid feel
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * marketsData.length);
      const symbol = marketsData[randomIndex].symbol;
      const direction = Math.random() > 0.5 ? 'up' : 'down';
      setPriceAnimations(prev => ({ ...prev, [symbol]: direction }));
      setTimeout(() => {
        setPriceAnimations(prev => ({ ...prev, [symbol]: null }));
      }, 500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const isDark = mode === 'dark';

  // Theme-aware liquid colors - Premium frosted glass for light mode
  const liquidColors = {
    primary: isDark ? 'rgba(2, 192, 118, 0.08)' : 'rgba(16, 185, 129, 0.06)',
    secondary: isDark ? 'rgba(0, 212, 170, 0.06)' : 'rgba(14, 165, 233, 0.05)',
    gold: isDark ? 'rgba(240, 185, 11, 0.05)' : 'rgba(245, 158, 11, 0.05)',
    shimmer: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(16, 185, 129, 0.08)',
    // Light mode card backgrounds
    cardBg: isDark
      ? colors.background.card
      : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,255,252,0.9) 100%)',
    cardBorder: isDark
      ? colors.glass.border
      : 'rgba(16, 185, 129, 0.12)',
    cardShadow: isDark
      ? 'none'
      : '0 4px 20px rgba(16, 185, 129, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
  };

  const filteredMarkets = marketsData.filter(
    (market) =>
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.pair.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort markets based on active tab
  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    if (activeMarketTab === 'gainers') return b.change24h - a.change24h;
    if (activeMarketTab === 'losers') return a.change24h - b.change24h;
    return 0; // 'hot' and 'new' keep default order
  });

  // Show only first 10 on dashboard preview (or all if searching)
  const displayMarkets = searchQuery ? sortedMarkets : sortedMarkets.slice(0, 10);

  const handleCopy = () => {
    navigator.clipboard.writeText('0x1234...5678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ResponsiveLayout activeNav="dashboard" title="Dashboard">
      {/* Premium Liquid Glass Background with 3D floating elements - Dark mode */}
      {isDark && (
        <LiquidGlassBackground
          intensity="medium"
          showOrbs={true}
          showRings={true}
          showCubes={false}
        />
      )}

      {/* Glowing Snow Background - Light mode */}
      <GlowingSnowBackground
        show={!isDark}
        backgroundImage="/main-bg.jpg"
        intensity="high"
      />

      {/* Welcome Hero Banner with CrymadX Logo - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 100 }}
        style={{ marginBottom: '18px', position: 'relative', zIndex: 1 }}
      >
        <GlassCard variant="subtle" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            {/* CrymadX Logo - New combined logo */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src="/crymadx-logo.png"
                alt="CrymadX"
                style={{
                  height: isMobile ? '41px' : '51px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </motion.div>

            {/* Welcome text */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: isMobile ? '12px' : '13px',
                color: colors.text.secondary,
              }}>
                Welcome back! Your crypto dashboard awaits.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Portfolio Overview Card - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
        style={{ marginBottom: '18px', position: 'relative', zIndex: 1 }}
      >
        <GlassCard variant="prominent" padding="none" glow>
          {/* Liquid wave effects - enhanced for both modes */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none' }}>
            <LiquidWave delay={0} color={liquidColors.primary} isDark={isDark} />
            <LiquidWave delay={2} color={liquidColors.secondary} isDark={isDark} />
            <LiquidShimmer isDark={isDark} />
            {/* Light mode decorative blobs */}
            {!isDark && <LightModeDecor variant="green" />}
          </div>
          <div style={{ padding: isMobile ? '14px' : '18px', position: 'relative' }}>
            {/* Header Row */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: '12px',
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: colors.trading.buyBg,
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary[400],
                }}>
                  <Wallet size={16} />
                </div>
                <div>
                  <h2 style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: 700, color: colors.text.primary }}>
                    Portfolio Overview
                  </h2>
                  <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                    Funding Account
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHideBalance(!hideBalance)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  background: colors.trading.buyBg,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '6px',
                  color: colors.primary[400],
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {hideBalance ? <EyeOff size={12} /> : <Eye size={12} />}
                {hideBalance ? 'Show' : 'Hide'}
              </motion.button>
            </div>

            {/* Balance Display */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
              marginBottom: '14px',
            }}>
              <div style={{ flex: isMobile ? 'auto' : '1.5' }}>
                <p style={{
                  fontSize: '10px',
                  color: colors.text.tertiary,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                }}>
                  Total Balance
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: isMobile ? '22px' : '28px',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: colors.text.primary,
                  }}>
                    {hideBalance ? '••••••••' : '$0.00'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: colors.trading.buy,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    <TrendingUp size={10} />
                    +0.00%
                  </span>
                </div>
                <p style={{
                  fontSize: '11px',
                  color: colors.text.tertiary,
                  marginTop: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {hideBalance ? '••••••••••' : '≈ 0.00000000 BTC'}
                </p>
              </div>

              {/* Quick Stats - Compact with premium light mode */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                flex: isMobile ? 'auto' : '1',
              }}>
                {quickStats.map((stat, i) => {
                  const statColors = ['#10b981', '#0ea5e9', '#8b5cf6'];
                  const bgColor = statColors[i] || stat.color;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02, y: -1 }}
                      style={{
                        padding: '8px 6px',
                        background: isDark
                          ? colors.background.card
                          : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${bgColor}08 100%)`,
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: isDark
                          ? 'none'
                          : `1px solid ${bgColor}15`,
                        boxShadow: isDark
                          ? 'none'
                          : `0 2px 10px ${bgColor}08, inset 0 1px 0 rgba(255,255,255,0.6)`,
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'default',
                      }}
                    >
                      {/* Decorative dot for light mode */}
                      {!isDark && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${bgColor}10 0%, transparent 70%)`,
                          filter: 'blur(4px)',
                          pointerEvents: 'none',
                        }} />
                      )}
                      <div style={{ color: isDark ? stat.color : bgColor, marginBottom: '3px', position: 'relative' }}>{stat.icon}</div>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isDark ? colors.text.primary : '#111827',
                        fontFamily: "'JetBrains Mono', monospace",
                        position: 'relative',
                      }}>
                        {stat.value}
                      </p>
                      <p style={{
                        fontSize: '8px',
                        color: isDark ? colors.text.tertiary : '#6b7280',
                        marginTop: '1px',
                        fontWeight: 500,
                        position: 'relative',
                      }}>
                        {stat.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons - Compact */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/wallet/deposit')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  background: colors.gradients.primarySolid,
                  border: 'none',
                  borderRadius: '8px',
                  color: colors.background.primary,
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <ArrowDownLeft size={14} />
                Deposit
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -1,
                  boxShadow: isDark ? 'none' : '0 4px 15px rgba(239, 68, 68, 0.12)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/wallet/withdraw')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  background: isDark
                    ? colors.background.card
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.04) 100%)',
                  border: isDark
                    ? `1px solid ${colors.glass.border}`
                    : '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: '8px',
                  color: isDark ? colors.text.primary : '#374151',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(239, 68, 68, 0.06)',
                }}
              >
                <ArrowUpRight size={14} color={isDark ? undefined : '#ef4444'} />
                Withdraw
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -1,
                  boxShadow: isDark ? 'none' : '0 4px 15px rgba(14, 165, 233, 0.12)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/wallet/convert')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  background: isDark
                    ? colors.background.card
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(14,165,233,0.04) 100%)',
                  border: isDark
                    ? `1px solid ${colors.glass.border}`
                    : '1px solid rgba(14, 165, 233, 0.15)',
                  borderRadius: '8px',
                  color: isDark ? colors.text.primary : '#374151',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(14, 165, 233, 0.06)',
                }}
              >
                <Repeat size={14} color={isDark ? undefined : '#0ea5e9'} />
                Convert
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -1,
                  boxShadow: isDark ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.12)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/wallet/history')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  background: isDark
                    ? colors.background.card
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(139,92,246,0.04) 100%)',
                  border: isDark
                    ? `1px solid ${colors.glass.border}`
                    : '1px solid rgba(139, 92, 246, 0.15)',
                  borderRadius: '8px',
                  color: isDark ? colors.text.primary : '#374151',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(139, 92, 246, 0.06)',
                }}
              >
                <History size={14} color={isDark ? undefined : '#8b5cf6'} />
                History
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Markets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <GlassCard variant="elevated" padding="none">
          {/* Liquid effect for markets card - enhanced for both modes */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none' }}>
            <LiquidWave delay={1} color={liquidColors.secondary} isDark={isDark} />
            <LiquidShimmer isDark={isDark} />
            {/* Light mode decorative blobs */}
            {!isDark && <LightModeDecor variant="blue" />}
          </div>
          <div style={{ padding: isMobile ? '14px' : '16px' }}>
            {/* Markets Header - Compact */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: 700, color: colors.text.primary }}>
                  Markets
                </h2>
                {/* Market Tabs - Compact */}
                <div style={{ display: 'flex', gap: '3px' }}>
                  {(['hot', 'gainers', 'losers', 'new'] as const).map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveMarketTab(tab)}
                      style={{
                        padding: '4px 8px',
                        background: activeMarketTab === tab ? colors.primary[400] : 'transparent',
                        border: activeMarketTab === tab ? 'none' : `1px solid ${isDark ? colors.glass.border : 'rgba(16, 185, 129, 0.2)'}`,
                        borderRadius: '5px',
                        color: activeMarketTab === tab ? colors.background.primary : colors.text.secondary,
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tab === 'hot' ? '🔥 Hot' : tab === 'gainers' ? '📈 Gainers' : tab === 'losers' ? '📉 Losers' : '✨ New'}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Search with Dropdown - Compact */}
                <div style={{
                  position: 'relative',
                  width: isMobile ? '160px' : '200px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: isDark
                      ? (showSearchDropdown ? colors.background.secondary : colors.background.card)
                      : (showSearchDropdown ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.9)'),
                    border: `1px solid ${showSearchDropdown ? colors.primary[400] : (isDark ? colors.glass.border : 'rgba(16, 185, 129, 0.2)')}`,
                    borderRadius: showSearchDropdown ? '6px 6px 0 0' : '6px',
                    transition: 'all 0.2s ease',
                  }}>
                    <Search size={12} color={showSearchDropdown ? colors.primary[400] : colors.text.tertiary} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearchDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: colors.text.primary,
                        fontSize: '11px',
                      }}
                    />
                    {searchQuery && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchQuery('')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '2px',
                          cursor: 'pointer',
                          color: colors.text.tertiary,
                          display: 'flex',
                        }}
                      >
                        <X size={14} />
                      </motion.button>
                    )}
                  </div>

                  {/* Search Dropdown */}
                  <AnimatePresence>
                    {showSearchDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: isDark ? 'rgba(10, 25, 15, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                          backdropFilter: 'blur(20px)',
                          border: `1px solid ${colors.glass.border}`,
                          borderTop: 'none',
                          borderRadius: '0 0 12px 12px',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          zIndex: 100,
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {/* Quick Categories */}
                        {!searchQuery && (
                          <div style={{ padding: '12px', borderBottom: `1px solid ${colors.glass.border}` }}>
                            <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Popular Searches
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {['BTC', 'ETH', 'SOL', 'BNB'].map((symbol) => (
                                <motion.button
                                  key={symbol}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setSearchQuery(symbol);
                                    navigate(`/trade/${symbol}-USDT`);
                                  }}
                                  style={{
                                    padding: '4px 10px',
                                    background: `${colors.primary[400]}15`,
                                    border: `1px solid ${colors.primary[400]}30`,
                                    borderRadius: '20px',
                                    color: colors.primary[400],
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {symbol}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Search Results */}
                        <div style={{ padding: '8px 0' }}>
                          {cryptoList
                            .filter(crypto =>
                              !searchQuery ||
                              crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .slice(0, 8)
                            .map((crypto, index) => {
                              const market = marketsData.find(m => m.symbol === crypto.symbol);
                              return (
                                <motion.div
                                  key={crypto.symbol}
                                  whileHover={{ background: `${colors.primary[400]}10` }}
                                  onClick={() => {
                                    navigate(`/trade/${crypto.symbol}-USDT`);
                                    setShowSearchDropdown(false);
                                    setSearchQuery('');
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <CryptoIcon symbol={crypto.symbol} size={32} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                                        {crypto.symbol}
                                      </span>
                                      <span style={{ fontSize: '12px', color: colors.text.tertiary }}>
                                        {crypto.name}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: '11px', color: colors.text.tertiary }}>
                                      {crypto.symbol}/USDT
                                    </span>
                                  </div>
                                  {market && (
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                                        ${market.price.toLocaleString()}
                                      </div>
                                      <div style={{
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        color: market.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                                      }}>
                                        {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}

                          {searchQuery && cryptoList.filter(crypto =>
                            crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                              <Search size={32} color={colors.text.tertiary} style={{ marginBottom: '8px' }} />
                              <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                                No assets found for "{searchQuery}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* View All Markets Link */}
                        <motion.div
                          whileHover={{ background: `${colors.primary[400]}10` }}
                          onClick={() => {
                            navigate('/markets');
                            setShowSearchDropdown(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '12px',
                            borderTop: `1px solid ${colors.glass.border}`,
                            cursor: 'pointer',
                            color: colors.primary[400],
                            fontSize: '13px',
                            fontWeight: 500,
                          }}
                        >
                          View All Markets
                          <ChevronRight size={14} />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Table Header - Desktop - Compact */}
            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
                gap: '10px',
                padding: '8px 12px',
                background: isDark ? colors.background.card : 'rgba(248,255,252,0.8)',
                borderRadius: '6px',
                marginBottom: '4px',
                border: isDark ? 'none' : '1px solid rgba(16, 185, 129, 0.1)',
              }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pair
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Price
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  24h
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  High
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Vol
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>
                  Trade
                </span>
              </div>
            )}

            {/* Markets List - Compact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', position: 'relative' }}>
              {displayMarkets.map((market) => (
                <motion.div
                  key={market.symbol}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    backgroundColor: priceAnimations[market.symbol] === 'up'
                      ? 'rgba(0, 200, 83, 0.12)'
                      : priceAnimations[market.symbol] === 'down'
                        ? 'rgba(255, 71, 87, 0.12)'
                        : 'transparent'
                  }}
                  transition={{ delay: 0.015 * displayMarkets.indexOf(market), backgroundColor: { duration: 0.3 } }}
                  whileHover={{
                    background: isDark
                      ? colors.background.hover
                      : 'rgba(16, 185, 129, 0.06)',
                    scale: 1.003,
                  }}
                  onClick={() => navigate(`/trade/${market.symbol.toLowerCase()}`)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr auto' : '2fr 1fr 1fr 1fr 1fr 80px',
                    gap: isMobile ? '5px' : '10px',
                    alignItems: 'center',
                    padding: isMobile ? '10px 8px' : '10px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {/* Pair Info - Compact */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CryptoIcon symbol={market.symbol} size={isMobile ? 28 : 30} />
                    <div>
                      <p style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: 700, color: colors.text.primary }}>
                        {market.pair}
                      </p>
                      <p style={{ fontSize: '10px', color: colors.text.tertiary }}>
                        {market.name}
                      </p>
                    </div>
                  </div>

                  {/* Price - Desktop */}
                  {!isMobile && (
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: colors.text.primary,
                      fontFamily: "'JetBrains Mono', monospace",
                      textAlign: 'right',
                    }}>
                      ${market.price.toLocaleString()}
                    </p>
                  )}

                  {/* 24h Change - Compact */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '2px 6px',
                      background: market.change24h >= 0 ? colors.trading.buyBg : colors.trading.sellBg,
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: market.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                    }}>
                      {market.change24h >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                      {market.change24h >= 0 ? '+' : ''}{market.change24h}%
                    </span>
                    {isMobile && (
                      <p style={{ fontSize: '10px', color: colors.text.tertiary, marginTop: '2px' }}>
                        ${market.price.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* 24h High - Desktop */}
                  {!isMobile && (
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: colors.text.secondary,
                      fontFamily: "'JetBrains Mono', monospace",
                      textAlign: 'right',
                    }}>
                      ${market.high24h.toLocaleString()}
                    </p>
                  )}

                  {/* Volume - Desktop */}
                  {!isMobile && (
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: colors.text.secondary,
                      fontFamily: "'JetBrains Mono', monospace",
                      textAlign: 'right',
                    }}>
                      ${market.volume}
                    </p>
                  )}

                  {/* Trade Button - Desktop - Compact */}
                  {!isMobile && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/trade/${market.symbol.toLowerCase()}`); }}
                        style={{
                          padding: '4px 10px',
                          background: colors.gradients.primarySolid,
                          border: 'none',
                          borderRadius: '5px',
                          color: colors.background.primary,
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Trade
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* View More Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.01, background: isDark ? `${colors.primary[400]}12` : 'rgba(16, 185, 129, 0.08)' }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/markets')}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 16px',
                background: isDark ? colors.background.card : 'rgba(255,255,255,0.9)',
                border: `1px solid ${isDark ? colors.glass.border : 'rgba(16, 185, 129, 0.2)'}`,
                borderRadius: '8px',
                color: colors.primary[400],
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              View More
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Deposit Modal - Enhanced with Crypto Selection */}
      <AnimatePresence>
        {showDepositModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowDepositModal(false); setDepositStep('select'); setCryptoSearch(''); }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '420px',
                maxHeight: '85vh',
                zIndex: 1001,
              }}
            >
              <GlassCard variant="prominent" padding="lg" glow>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {depositStep === 'address' && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDepositStep('select')}
                        style={{
                          padding: '6px',
                          background: colors.background.card,
                          border: 'none',
                          borderRadius: '6px',
                          color: colors.text.secondary,
                          cursor: 'pointer',
                        }}
                      >
                        <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
                      </motion.button>
                    )}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>
                      {depositStep === 'select' ? 'Select Crypto to Deposit' : `Deposit ${selectedCrypto.symbol}`}
                    </h3>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowDepositModal(false); setDepositStep('select'); setCryptoSearch(''); }}
                    style={{
                      padding: '6px',
                      background: colors.trading.sellBg,
                      border: 'none',
                      borderRadius: '6px',
                      color: colors.status.error,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {depositStep === 'select' ? (
                  <>
                    {/* Search Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <Search size={18} color={colors.text.tertiary} />
                      <input
                        type="text"
                        placeholder="Search coin name..."
                        value={cryptoSearch}
                        onChange={(e) => setCryptoSearch(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: colors.text.primary,
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    {/* Crypto List */}
                    <div style={{
                      maxHeight: '320px',
                      overflowY: 'auto',
                      marginBottom: '16px',
                    }}>
                      {cryptoList
                        .filter(c => c.name.toLowerCase().includes(cryptoSearch.toLowerCase()) || c.symbol.toLowerCase().includes(cryptoSearch.toLowerCase()))
                        .map((crypto) => (
                          <motion.div
                            key={crypto.symbol}
                            whileHover={{ background: colors.background.elevated }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedCrypto(crypto); setDepositStep('address'); }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              marginBottom: '4px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <CryptoIcon symbol={crypto.symbol} size={36} />
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>{crypto.symbol}</p>
                                <p style={{ fontSize: '12px', color: colors.text.tertiary }}>{crypto.name}</p>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '12px', color: colors.text.secondary }}>{crypto.network}</p>
                              <ChevronRight size={16} color={colors.text.tertiary} />
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Selected Crypto Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: colors.background.card,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <CryptoIcon symbol={selectedCrypto.symbol} size={40} />
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>{selectedCrypto.name}</p>
                        <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Network: {selectedCrypto.network}</p>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '20px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        width: '150px',
                        height: '150px',
                        background: `linear-gradient(45deg, ${colors.primary[400]}20, ${colors.secondary[400]}20)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <QrCode size={100} color={colors.background.primary} />
                      </div>
                    </div>

                    {/* Address Display */}
                    <div style={{
                      padding: '16px',
                      background: colors.background.card,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <p style={{
                        fontSize: '11px',
                        color: colors.text.tertiary,
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Your {selectedCrypto.symbol} Deposit Address
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}>
                        <code style={{
                          flex: 1,
                          fontSize: '11px',
                          fontFamily: "'JetBrains Mono', monospace",
                          color: colors.text.primary,
                          wordBreak: 'break-all',
                        }}>
                          {selectedCrypto.address}
                        </code>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopy}
                          style={{
                            padding: '8px',
                            background: colors.primary[400],
                            border: 'none',
                            borderRadius: '6px',
                            color: colors.background.primary,
                            cursor: 'pointer',
                          }}
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </motion.button>
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      background: colors.status.warningBg,
                      border: '1px solid rgba(247, 147, 26, 0.2)',
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}>
                      <p style={{ fontSize: '12px', color: colors.status.warning, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} />
                        Only send {selectedCrypto.symbol} ({selectedCrypto.network}) to this address.
                      </p>
                    </div>

                    <Button variant="primary" fullWidth onClick={() => { setShowDepositModal(false); setDepositStep('select'); }}>
                      Done
                    </Button>
                  </>
                )}
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowWithdrawModal(false); setWithdrawStep('select'); setCryptoSearch(''); setWithdrawAmount(''); setWithdrawAddress(''); }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '420px',
                maxHeight: '85vh',
                zIndex: 1001,
              }}
            >
              <GlassCard variant="prominent" padding="lg" glow>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {withdrawStep !== 'select' && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setWithdrawStep(withdrawStep === 'confirm' ? 'amount' : 'select')}
                        style={{
                          padding: '6px',
                          background: colors.background.card,
                          border: 'none',
                          borderRadius: '6px',
                          color: colors.text.secondary,
                          cursor: 'pointer',
                        }}
                      >
                        <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
                      </motion.button>
                    )}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>
                      {withdrawStep === 'select' ? 'Select Crypto to Withdraw' : withdrawStep === 'amount' ? `Withdraw ${selectedCrypto.symbol}` : 'Confirm Withdrawal'}
                    </h3>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowWithdrawModal(false); setWithdrawStep('select'); setCryptoSearch(''); setWithdrawAmount(''); setWithdrawAddress(''); }}
                    style={{
                      padding: '6px',
                      background: colors.trading.sellBg,
                      border: 'none',
                      borderRadius: '6px',
                      color: colors.status.error,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {withdrawStep === 'select' ? (
                  <>
                    {/* Search Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <Search size={18} color={colors.text.tertiary} />
                      <input
                        type="text"
                        placeholder="Search coin name..."
                        value={cryptoSearch}
                        onChange={(e) => setCryptoSearch(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: colors.text.primary,
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    {/* Crypto List */}
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {cryptoList
                        .filter(c => c.name.toLowerCase().includes(cryptoSearch.toLowerCase()) || c.symbol.toLowerCase().includes(cryptoSearch.toLowerCase()))
                        .map((crypto) => (
                          <motion.div
                            key={crypto.symbol}
                            whileHover={{ background: colors.background.elevated }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedCrypto(crypto); setWithdrawStep('amount'); }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              marginBottom: '4px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <CryptoIcon symbol={crypto.symbol} size={36} />
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>{crypto.symbol}</p>
                                <p style={{ fontSize: '12px', color: colors.text.tertiary }}>{crypto.name}</p>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>{crypto.balance}</p>
                              <p style={{ fontSize: '11px', color: colors.text.tertiary }}>≈ ${crypto.usdValue}</p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </>
                ) : withdrawStep === 'amount' ? (
                  <>
                    {/* Selected Crypto */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: colors.background.card,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <CryptoIcon symbol={selectedCrypto.symbol} size={36} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>{selectedCrypto.symbol}</p>
                        <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Available: {selectedCrypto.balance}</p>
                      </div>
                    </div>

                    {/* Withdraw Address */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${selectedCrypto.symbol} address`}
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: colors.background.card,
                          border: `1px solid ${colors.glass.border}`,
                          borderRadius: '10px',
                          color: colors.text.primary,
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Network */}
                    <div style={{
                      padding: '12px',
                      background: colors.background.card,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Network</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary[400] }}>{selectedCrypto.network}</span>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                        Amount
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: colors.background.card,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'transparent',
                            border: 'none',
                            color: colors.text.primary,
                            fontSize: '16px',
                            outline: 'none',
                          }}
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWithdrawAmount(selectedCrypto.balance)}
                          style={{
                            padding: '8px 14px',
                            background: colors.primary[400] + '20',
                            border: 'none',
                            color: colors.primary[400],
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginRight: '8px',
                            borderRadius: '6px',
                          }}
                        >
                          MAX
                        </motion.button>
                      </div>
                    </div>

                    {/* Fee Info */}
                    <div style={{
                      padding: '12px',
                      background: colors.background.card,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Network Fee</span>
                        <span style={{ fontSize: '12px', color: colors.text.secondary }}>0.0001 {selectedCrypto.symbol}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: colors.text.tertiary }}>You will receive</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                          {withdrawAmount ? (parseFloat(withdrawAmount) - 0.0001).toFixed(4) : '0.00'} {selectedCrypto.symbol}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => setWithdrawStep('confirm')}
                      disabled={!withdrawAmount || !withdrawAddress}
                    >
                      Continue
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Confirmation Step */}
                    <div style={{
                      padding: '20px',
                      background: colors.background.card,
                      borderRadius: '12px',
                      marginBottom: '16px',
                    }}>
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <CryptoIcon symbol={selectedCrypto.symbol} size={48} />
                        <p style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, marginTop: '12px' }}>
                          {withdrawAmount} {selectedCrypto.symbol}
                        </p>
                        <p style={{ fontSize: '13px', color: colors.text.tertiary }}>≈ $0.00 USD</p>
                      </div>

                      <div style={{ borderTop: `1px solid ${colors.glass.border}`, paddingTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '12px', color: colors.text.tertiary }}>To Address</span>
                          <span style={{ fontSize: '11px', color: colors.text.secondary, maxWidth: '180px', wordBreak: 'break-all', textAlign: 'right' }}>
                            {withdrawAddress}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Network</span>
                          <span style={{ fontSize: '12px', color: colors.primary[400] }}>{selectedCrypto.network}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Network Fee</span>
                          <span style={{ fontSize: '12px', color: colors.text.secondary }}>0.0001 {selectedCrypto.symbol}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      background: colors.status.warningBg,
                      border: '1px solid rgba(247, 147, 26, 0.2)',
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}>
                      <p style={{ fontSize: '12px', color: colors.status.warning, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} />
                        Please verify the address. Transactions cannot be reversed.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => { setShowWithdrawModal(false); setWithdrawStep('select'); setWithdrawAmount(''); setWithdrawAddress(''); }}
                    >
                      Confirm Withdrawal
                    </Button>
                  </>
                )}
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Convert Modal */}
      <AnimatePresence>
        {showConvertModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowConvertModal(false); setConvertStep('input'); setConvertAmount(''); }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '420px',
                zIndex: 1001,
              }}
            >
              <GlassCard variant="prominent" padding="lg" glow>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>
                    {convertStep === 'input' ? 'Convert Crypto' : convertStep === 'confirm' ? 'Confirm Conversion' : 'Conversion Successful'}
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowConvertModal(false); setConvertStep('input'); setConvertAmount(''); }}
                    style={{
                      padding: '6px',
                      background: colors.trading.sellBg,
                      border: 'none',
                      borderRadius: '6px',
                      color: colors.status.error,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {convertStep === 'input' ? (
                  <>
                    {/* From Crypto */}
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>From</label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        background: colors.background.card,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '10px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <CryptoIcon symbol={convertFromCrypto.symbol} size={32} />
                          <select
                            value={convertFromCrypto.symbol}
                            onChange={(e) => setConvertFromCrypto(cryptoList.find(c => c.symbol === e.target.value) || cryptoList[0])}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: colors.text.primary,
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            {cryptoList.map(c => (
                              <option key={c.symbol} value={c.symbol} style={{ background: colors.background.primary }}>{c.symbol}</option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={convertAmount}
                          onChange={(e) => setConvertAmount(e.target.value)}
                          style={{
                            width: '120px',
                            textAlign: 'right',
                            background: 'transparent',
                            border: 'none',
                            color: colors.text.primary,
                            fontSize: '18px',
                            fontWeight: 600,
                            outline: 'none',
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '11px', color: colors.text.tertiary, marginTop: '6px' }}>
                        Available: {convertFromCrypto.balance} {convertFromCrypto.symbol}
                      </p>
                    </div>

                    {/* Swap Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const temp = convertFromCrypto;
                          setConvertFromCrypto(convertToCrypto);
                          setConvertToCrypto(temp);
                        }}
                        style={{
                          padding: '10px',
                          background: colors.primary[400],
                          border: 'none',
                          borderRadius: '50%',
                          color: colors.background.primary,
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowRightLeft size={18} />
                      </motion.button>
                    </div>

                    {/* To Crypto */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>To</label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        background: colors.background.card,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '10px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <CryptoIcon symbol={convertToCrypto.symbol} size={32} />
                          <select
                            value={convertToCrypto.symbol}
                            onChange={(e) => setConvertToCrypto(cryptoList.find(c => c.symbol === e.target.value) || cryptoList[1])}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: colors.text.primary,
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            {cryptoList.map(c => (
                              <option key={c.symbol} value={c.symbol} style={{ background: colors.background.primary }}>{c.symbol}</option>
                            ))}
                          </select>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary }}>
                          {convertAmount ? (parseFloat(convertAmount) * 0.98).toFixed(6) : '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* Rate Info */}
                    <div style={{
                      padding: '12px',
                      background: colors.background.card,
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Exchange Rate</span>
                        <span style={{ fontSize: '12px', color: colors.text.secondary }}>1 {convertFromCrypto.symbol} = 0.98 {convertToCrypto.symbol}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Fee</span>
                        <span style={{ fontSize: '12px', color: colors.primary[400] }}>0% (Promo)</span>
                      </div>
                    </div>

                    <Button variant="primary" fullWidth onClick={() => setConvertStep('confirm')} disabled={!convertAmount}>
                      Preview Conversion
                    </Button>
                  </>
                ) : convertStep === 'confirm' ? (
                  <>
                    {/* Confirmation */}
                    <div style={{
                      padding: '20px',
                      background: colors.background.card,
                      borderRadius: '12px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
                        <div>
                          <CryptoIcon symbol={convertFromCrypto.symbol} size={40} />
                          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginTop: '8px' }}>{convertAmount}</p>
                          <p style={{ fontSize: '12px', color: colors.text.tertiary }}>{convertFromCrypto.symbol}</p>
                        </div>
                        <ArrowRightLeft size={24} color={colors.primary[400]} />
                        <div>
                          <CryptoIcon symbol={convertToCrypto.symbol} size={40} />
                          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginTop: '8px' }}>
                            {(parseFloat(convertAmount || '0') * 0.98).toFixed(6)}
                          </p>
                          <p style={{ fontSize: '12px', color: colors.text.tertiary }}>{convertToCrypto.symbol}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Button variant="ghost" fullWidth onClick={() => setConvertStep('input')}>
                        Back
                      </Button>
                      <Button variant="primary" fullWidth onClick={() => setConvertStep('success')}>
                        Confirm
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success */}
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle size={64} color={colors.primary[400]} />
                      </motion.div>
                      <p style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginTop: '16px' }}>
                        Conversion Successful!
                      </p>
                      <p style={{ fontSize: '14px', color: colors.text.secondary, marginTop: '8px' }}>
                        You converted {convertAmount} {convertFromCrypto.symbol} to {(parseFloat(convertAmount || '0') * 0.98).toFixed(6)} {convertToCrypto.symbol}
                      </p>
                    </div>

                    <Button variant="primary" fullWidth onClick={() => { setShowConvertModal(false); setConvertStep('input'); setConvertAmount(''); }}>
                      Done
                    </Button>
                  </>
                )}
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                zIndex: 1001,
              }}
            >
              <GlassCard variant="prominent" padding="lg" glow>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>
                    Transaction History
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHistoryModal(false)}
                    style={{
                      padding: '6px',
                      background: colors.trading.sellBg,
                      border: 'none',
                      borderRadius: '6px',
                      color: colors.status.error,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {(['all', 'deposit', 'withdraw', 'convert'] as const).map((filter) => (
                    <motion.button
                      key={filter}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setHistoryFilter(filter)}
                      style={{
                        padding: '8px 16px',
                        background: historyFilter === filter ? colors.primary[400] : colors.background.card,
                        border: historyFilter === filter ? 'none' : `1px solid ${colors.glass.border}`,
                        borderRadius: '8px',
                        color: historyFilter === filter ? colors.background.primary : colors.text.secondary,
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>

                {/* Transaction List */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {transactionHistory
                    .filter(tx => historyFilter === 'all' || tx.type === historyFilter)
                    .map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px',
                          background: colors.background.card,
                          borderRadius: '10px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: tx.type === 'deposit' ? colors.trading.buyBg : tx.type === 'withdraw' ? colors.trading.sellBg : colors.secondary[400] + '20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {tx.type === 'deposit' ? (
                              <ArrowDownLeft size={18} color={colors.trading.buy} />
                            ) : tx.type === 'withdraw' ? (
                              <ArrowUpRight size={18} color={colors.trading.sell} />
                            ) : (
                              <ArrowRightLeft size={18} color={colors.secondary[400]} />
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, textTransform: 'capitalize' }}>
                              {tx.type} {tx.symbol}
                            </p>
                            <p style={{ fontSize: '11px', color: colors.text.tertiary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={10} /> {tx.date}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: tx.type === 'deposit' ? colors.trading.buy : tx.type === 'withdraw' ? colors.trading.sell : colors.text.primary,
                          }}>
                            {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : ''}{tx.amount}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                            {tx.status === 'completed' ? (
                              <CheckCircle size={12} color={colors.trading.buy} />
                            ) : tx.status === 'pending' ? (
                              <Clock size={12} color={colors.status.warning} />
                            ) : (
                              <XCircle size={12} color={colors.trading.sell} />
                            )}
                            <span style={{
                              fontSize: '11px',
                              color: tx.status === 'completed' ? colors.trading.buy : tx.status === 'pending' ? colors.status.warning : colors.trading.sell,
                              textTransform: 'capitalize',
                            }}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                  {transactionHistory.filter(tx => historyFilter === 'all' || tx.type === historyFilter).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <History size={48} color={colors.text.tertiary} />
                      <p style={{ fontSize: '14px', color: colors.text.tertiary, marginTop: '12px' }}>
                        No transactions found
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default DashboardScreen;
