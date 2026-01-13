import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';
import { PlatformNFT } from '../services/nftService';
import { getChainConfig, getChainColor } from '../config/chains';

// Generate a colored SVG placeholder as a data URI (no external network needed)
const getPlaceholderImage = (collection: string, tokenId: string): string => {
  // Generate consistent colors based on collection + tokenId
  const seed = (collection || '').length + parseInt(tokenId || '0', 10);
  const hue = (seed * 37) % 360;
  const saturation = 60 + (seed % 30);
  const lightness = 35 + (seed % 20);

  // Create an SVG with gradient background and NFT text
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(${hue},${saturation}%,${lightness}%)"/><stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360},${saturation}%,${lightness - 10}%)"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/><text x="250" y="220" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="80" font-family="Arial">NFT</text><text x="250" y="300" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="24" font-family="Arial">#${tokenId || '???'}</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

interface NFTBuyCardProps {
  nft: PlatformNFT;
  onBuyClick: (nft: PlatformNFT) => void;
  viewMode?: 'grid' | 'list';
}

export const NFTBuyCard: React.FC<NFTBuyCardProps> = ({ nft, onBuyClick, viewMode = 'grid' }) => {
  const { colors, isDark } = useThemeMode();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const chainConfig = getChainConfig(nft.chain);
  const chainColor = getChainColor(nft.chain);

  // Get the image URL - use fallback if original fails
  const imageUrl = useFallback
    ? getPlaceholderImage(nft.collection, nft.tokenId)
    : nft.image;

  const handleImageError = () => {
    if (!useFallback) {
      // Try fallback image first
      setUseFallback(true);
      setImageLoaded(false);
    } else {
      // Both original and fallback failed
      setImageError(true);
    }
  };

  const formatPrice = (price: string, currency: string): string => {
    const num = parseFloat(price);
    if (isNaN(num)) return `0 ${currency}`;
    if (num >= 1) return `${num.toFixed(2)} ${currency}`;
    return `${num.toFixed(4)} ${currency}`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4, backgroundColor: isDark ? 'rgba(0, 255, 136, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          borderRadius: '16px',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          cursor: 'pointer',
        }}
        onClick={() => onBuyClick(nft)}
      >
        {/* Image */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
            background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[400]})`,
          }}
        >
          {!imageError ? (
            <img
              src={imageUrl}
              alt={nft.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none',
              }}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageIcon size={24} color="rgba(255,255,255,0.5)" />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '11px',
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              marginBottom: '2px',
            }}
          >
            {nft.collection}
          </p>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#1a1a1a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {nft.name}
          </h4>
        </div>

        {/* Chain */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: `${chainColor}20`,
            color: chainColor,
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: chainColor,
            }}
          />
          {chainConfig?.shortName}
        </span>

        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: colors.primary[400],
            }}
          >
            {formatPrice(nft.price, nft.currency)}
          </p>
          {nft.priceUsd && (
            <p
              style={{
                fontSize: '11px',
                color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              }}
            >
              ${nft.priceUsd}
            </p>
          )}
        </div>

        {/* Buy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onBuyClick(nft);
          }}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShoppingCart size={14} />
          Buy
        </motion.button>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.9), rgba(10, 20, 15, 0.95))'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95))',
        border: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          paddingBottom: '100%',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[400]})`,
        }}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={nft.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={48} color="rgba(255,255,255,0.5)" />
          </div>
        )}

        {/* Chain Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '5px 10px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: chainColor,
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>
            {chainConfig?.shortName || nft.chain}
          </span>
        </div>

        {/* Price Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
            {formatPrice(nft.price, nft.currency)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px' }}>
        <p
          style={{
            fontSize: '11px',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {nft.collection}
        </p>
        <h4
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: isDark ? '#fff' : '#1a1a1a',
            marginBottom: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {nft.name}
        </h4>

        {/* Buy Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBuyClick(nft)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <ShoppingCart size={16} />
          Buy Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NFTBuyCard;
