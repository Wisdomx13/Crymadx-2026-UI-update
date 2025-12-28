import React, { useState } from 'react';
import { colors } from '../theme';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  showBadge?: boolean;
}

// High quality crypto logo URLs from CoinGecko CDN (large resolution for crisp display)
const cryptoLogos: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
  DOT: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  UNI: 'https://assets.coingecko.com/coins/images/12504/large/uni.png',
  ATOM: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
  LTC: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  NEAR: 'https://assets.coingecko.com/coins/images/10365/large/near.jpg',
  APT: 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png',
  ARB: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
  OP: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
  SHIB: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
  PEPE: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
  SUI: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
  SEI: 'https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png',
  INJ: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png',
  FTM: 'https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png',
  ALGO: 'https://assets.coingecko.com/coins/images/4380/large/download.png',
  VET: 'https://assets.coingecko.com/coins/images/1167/large/VET_Token_Icon.png',
  FIL: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
  ICP: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png',
  AAVE: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
  SAND: 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg',
  MANA: 'https://assets.coingecko.com/coins/images/878/large/decentraland-mana.png',
  AXS: 'https://assets.coingecko.com/coins/images/13029/large/axie_infinity_logo.png',
  CRO: 'https://assets.coingecko.com/coins/images/7310/large/cro_token_logo.png',
  HBAR: 'https://assets.coingecko.com/coins/images/3688/large/hbar.png',
  EOS: 'https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png',
  XLM: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
  XMR: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
  ETC: 'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png',
  BCH: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
};

// Fallback colors for when image fails to load
const cryptoColors: Record<string, { bg: string; text: string }> = {
  BTC: { bg: '#F7931A', text: '#ffffff' },
  ETH: { bg: '#627EEA', text: '#ffffff' },
  USDT: { bg: '#26A17B', text: '#ffffff' },
  USDC: { bg: '#2775CA', text: '#ffffff' },
  BNB: { bg: '#F3BA2F', text: '#000000' },
  XRP: { bg: '#23292F', text: '#ffffff' },
  ADA: { bg: '#0033AD', text: '#ffffff' },
  SOL: { bg: '#9945FF', text: '#ffffff' },
  DOGE: { bg: '#C2A633', text: '#ffffff' },
  DOT: { bg: '#E6007A', text: '#ffffff' },
  MATIC: { bg: '#8247E5', text: '#ffffff' },
  AVAX: { bg: '#E84142', text: '#ffffff' },
  LINK: { bg: '#2A5ADA', text: '#ffffff' },
  UNI: { bg: '#FF007A', text: '#ffffff' },
  ATOM: { bg: '#2E3148', text: '#ffffff' },
  LTC: { bg: '#345D9D', text: '#ffffff' },
  TRX: { bg: '#EF0027', text: '#ffffff' },
  NEAR: { bg: '#000000', text: '#ffffff' },
  APT: { bg: '#000000', text: '#ffffff' },
  ARB: { bg: '#28A0F0', text: '#ffffff' },
  OP: { bg: '#FF0420', text: '#ffffff' },
  SHIB: { bg: '#FFA409', text: '#000000' },
  PEPE: { bg: '#3D9E3D', text: '#ffffff' },
};

export const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  size = 32,
  showBadge = false,
}) => {
  const symbolUpper = symbol.toUpperCase();
  const logoUrl = cryptoLogos[symbolUpper];
  const colorScheme = cryptoColors[symbolUpper] || {
    bg: colors.primary[600],
    text: '#ffffff',
  };

  const [imageError, setImageError] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '50%',
      background: logoUrl && !imageError
        ? `linear-gradient(145deg, ${colorScheme.bg}20, transparent)`
        : colorScheme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.4,
      fontWeight: 700,
      color: colorScheme.text,
      fontFamily: "'Inter', sans-serif",
      // Enhanced 3D shadow with multiple layers for depth
      boxShadow: `
        0 4px 12px ${colorScheme.bg}50,
        0 8px 24px ${colorScheme.bg}30,
        0 2px 4px rgba(0,0,0,0.2),
        inset 0 2px 4px rgba(255,255,255,0.2),
        inset 0 -2px 4px rgba(0,0,0,0.1)
      `,
      overflow: 'hidden',
      // 3D transform for perspective
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
    }}>
      {logoUrl && !imageError ? (
        <img
          src={logoUrl}
          alt={symbolUpper}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            // Crisp rendering for high quality
            imageRendering: 'auto',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}
        />
      ) : (
        symbolUpper.slice(0, 2)
      )}
      {showBadge && (
        <div style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: '50%',
          background: colors.background.primary,
          border: `2px solid ${colors.background.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: colors.primary[400],
          }} />
        </div>
      )}
    </div>
  );
};

// Crypto pair component
interface CryptoPairProps {
  base: string;
  quote: string;
  size?: number;
}

export const CryptoPair: React.FC<CryptoPairProps> = ({
  base,
  quote,
  size = 32,
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <CryptoIcon symbol={base} size={size} />
      <div style={{ marginLeft: -size * 0.3 }}>
        <CryptoIcon symbol={quote} size={size * 0.75} />
      </div>
    </div>
  );
};

export default CryptoIcon;
