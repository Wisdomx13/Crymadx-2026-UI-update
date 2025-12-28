import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { colors } from '../theme';

interface PriceDisplayProps {
  price: number | string;
  change?: number;
  changePercent?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showChange?: boolean;
  showIcon?: boolean;
  animated?: boolean;
}

const sizeStyles = {
  sm: { price: '14px', change: '12px' },
  md: { price: '18px', change: '13px' },
  lg: { price: '24px', change: '14px' },
  xl: { price: '32px', change: '16px' },
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  change,
  changePercent,
  currency = 'USD',
  size = 'md',
  showChange = true,
  showIcon = true,
  animated = true,
}) => {
  const isPositive = (change ?? changePercent ?? 0) >= 0;
  const isNeutral = (change ?? changePercent ?? 0) === 0;
  const sizeStyle = sizeStyles[size];

  const changeColor = isNeutral
    ? colors.text.tertiary
    : isPositive
      ? colors.trading.buy
      : colors.trading.sell;

  const formatPrice = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num >= 1000) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const Wrapper = animated ? motion.div : 'div';

  return (
    <Wrapper
      {...(animated && {
        initial: { opacity: 0.8 },
        animate: { opacity: 1 },
        transition: { duration: 0.15 },
      })}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {/* Main Price */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px',
      }}>
        {currency && (
          <span style={{
            fontSize: `calc(${sizeStyle.price} * 0.75)`,
            color: colors.text.tertiary,
            fontWeight: 500,
          }}>
            $
          </span>
        )}
        <span style={{
          fontSize: sizeStyle.price,
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          color: colors.text.primary,
          letterSpacing: '-0.02em',
        }}>
          {formatPrice(price)}
        </span>
      </div>

      {/* Change */}
      {showChange && (change !== undefined || changePercent !== undefined) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          {showIcon && (
            <span style={{ color: changeColor, display: 'flex' }}>
              {isNeutral ? (
                <Minus size={parseInt(sizeStyle.change)} />
              ) : isPositive ? (
                <TrendingUp size={parseInt(sizeStyle.change)} />
              ) : (
                <TrendingDown size={parseInt(sizeStyle.change)} />
              )}
            </span>
          )}
          {change !== undefined && (
            <span style={{
              fontSize: sizeStyle.change,
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              color: changeColor,
            }}>
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </span>
          )}
          {changePercent !== undefined && (
            <span style={{
              fontSize: sizeStyle.change,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              color: changeColor,
              padding: '2px 6px',
              borderRadius: '4px',
              background: isNeutral
                ? 'rgba(255, 255, 255, 0.05)'
                : isPositive
                  ? colors.trading.buyBg
                  : colors.trading.sellBg,
            }}>
              {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
};

// Compact price ticker
interface PriceTickerProps {
  symbol: string;
  price: number;
  changePercent: number;
}

export const PriceTicker: React.FC<PriceTickerProps> = ({
  symbol,
  price,
  changePercent,
}) => {
  const isPositive = changePercent >= 0;

  return (
    <motion.div
      whileHover={{ background: 'rgba(0, 255, 136, 0.04)' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
    >
      <span style={{
        fontSize: '14px',
        fontWeight: 600,
        color: colors.text.primary,
      }}>
        {symbol}
      </span>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          color: colors.text.primary,
        }}>
          ${price.toLocaleString()}
        </div>
        <div style={{
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: "'JetBrains Mono', monospace",
          color: isPositive ? colors.trading.buy : colors.trading.sell,
        }}>
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
    </motion.div>
  );
};

export default PriceDisplay;
