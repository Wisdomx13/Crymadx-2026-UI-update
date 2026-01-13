import React from 'react';
import { motion } from 'framer-motion';
import { useThemeMode } from '../theme/ThemeContext';
import { CHAIN_LIST, ALL_CHAINS_OPTION, ChainId } from '../config/chains';

interface ChainFilterProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
  counts?: Record<string, number>;
  showAll?: boolean;
}

export const ChainFilter: React.FC<ChainFilterProps> = ({
  selectedChain,
  onChainChange,
  counts,
  showAll = true,
}) => {
  const { colors, isDark } = useThemeMode();

  const chains = showAll
    ? [{ id: 'all', name: ALL_CHAINS_OPTION.name, shortName: 'ALL', color: ALL_CHAINS_OPTION.color }, ...CHAIN_LIST]
    : CHAIN_LIST;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}
    >
      {chains.map((chain) => {
        const isSelected = selectedChain === chain.id;
        const count = counts?.[chain.id];

        return (
          <motion.button
            key={chain.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChainChange(chain.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: isSelected
                ? `2px solid ${chain.color}`
                : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              background: isSelected
                ? `${chain.color}15`
                : isDark
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Chain indicator dot */}
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: chain.color,
                boxShadow: isSelected ? `0 0 8px ${chain.color}` : 'none',
              }}
            />

            {/* Chain name */}
            <span
              style={{
                fontSize: '13px',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? chain.color : isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              }}
            >
              {chain.name}
            </span>

            {/* Count badge */}
            {count !== undefined && (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isSelected ? chain.color : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: isSelected ? '#fff' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// Compact version for smaller spaces
export const ChainFilterCompact: React.FC<ChainFilterProps> = ({
  selectedChain,
  onChainChange,
  showAll = true,
}) => {
  const { colors, isDark } = useThemeMode();

  const chains = showAll
    ? [{ id: 'all', shortName: 'All', color: ALL_CHAINS_OPTION.color }, ...CHAIN_LIST.map(c => ({ id: c.id, shortName: c.shortName, color: c.color }))]
    : CHAIN_LIST.map(c => ({ id: c.id, shortName: c.shortName, color: c.color }));

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        borderRadius: '12px',
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
      }}
    >
      {chains.map((chain) => {
        const isSelected = selectedChain === chain.id;

        return (
          <motion.button
            key={chain.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChainChange(chain.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: isSelected ? `${chain.color}20` : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: chain.color,
                opacity: isSelected ? 1 : 0.5,
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: isSelected ? 600 : 500,
                color: isSelected ? chain.color : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              }}
            >
              {chain.shortName}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

// Dropdown version for mobile
export const ChainFilterDropdown: React.FC<ChainFilterProps> = ({
  selectedChain,
  onChainChange,
  showAll = true,
}) => {
  const { colors, isDark } = useThemeMode();

  const chains = showAll
    ? [{ id: 'all', name: ALL_CHAINS_OPTION.name, color: ALL_CHAINS_OPTION.color }, ...CHAIN_LIST]
    : CHAIN_LIST;

  const selectedChainConfig = chains.find(c => c.id === selectedChain) || chains[0];

  return (
    <div style={{ position: 'relative' }}>
      <select
        value={selectedChain}
        onChange={(e) => onChainChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '10px 36px 10px 36px',
          borderRadius: '12px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          color: isDark ? '#fff' : '#1a1a1a',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          minWidth: '150px',
        }}
      >
        {chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
      {/* Chain dot indicator */}
      <span
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: selectedChainConfig.color,
          pointerEvents: 'none',
        }}
      />
      {/* Dropdown arrow */}
      <span
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        }}
      >
        ▼
      </span>
    </div>
  );
};

export default ChainFilter;
