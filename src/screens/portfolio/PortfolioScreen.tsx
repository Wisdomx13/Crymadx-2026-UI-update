import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  Clock,
  RefreshCw,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { portfolioService, TimePeriod } from '../../services/portfolioService';
import type { PortfolioOverview, PortfolioAllocation, PortfolioPerformance } from '../../types/api';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Fallback mock data
const mockOverview: PortfolioOverview = {
  totalValue: '12450.00',
  totalCost: '10000.00',
  totalPnl: '2450.00',
  totalPnlPercent: 24.5,
  change24h: '150.00',
  change24hPercent: 1.22,
};

const mockAllocation: PortfolioAllocation[] = [
  { asset: 'BTC', value: '5500', percent: 44.2 },
  { asset: 'ETH', value: '3200', percent: 25.7 },
  { asset: 'SOL', value: '1800', percent: 14.5 },
  { asset: 'BNB', value: '1200', percent: 9.6 },
  { asset: 'Others', value: '750', percent: 6.0 },
];

const mockPerformance: PortfolioPerformance = {
  daily: { return: 1.22, pnl: '150.00' },
  weekly: { return: 5.8, pnl: '680.00' },
  monthly: { return: 12.5, pnl: '1380.00' },
  yearly: { return: 45.2, pnl: '3850.00' },
  allTime: { return: 24.5, pnl: '2450.00' },
};

const mockHistory = [
  { timestamp: '2024-01-01', value: '10000' },
  { timestamp: '2024-01-08', value: '10500' },
  { timestamp: '2024-01-15', value: '10200' },
  { timestamp: '2024-01-22', value: '11000' },
  { timestamp: '2024-01-29', value: '10800' },
  { timestamp: '2024-02-05', value: '11500' },
  { timestamp: '2024-02-12', value: '12000' },
  { timestamp: '2024-02-19', value: '11800' },
  { timestamp: '2024-02-26', value: '12450' },
];

const COLORS = ['#02c076', '#00d4aa', '#f0b90b', '#3b82f6', '#8b5cf6'];

const periods: { value: TimePeriod; label: string }[] = [
  { value: '1d', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'All' },
];

export const PortfolioScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [overview, setOverview] = useState<PortfolioOverview>(mockOverview);
  const [allocation, setAllocation] = useState<PortfolioAllocation[]>(mockAllocation);
  const [performance, setPerformance] = useState<PortfolioPerformance>(mockPerformance);
  const [historyData, setHistoryData] = useState(portfolioService.generateChartData(mockHistory));

  // Fetch portfolio data
  const fetchPortfolioData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewRes, historyRes, performanceRes] = await Promise.all([
        portfolioService.getOverview(),
        portfolioService.getHistory(selectedPeriod),
        portfolioService.getPerformance(),
      ]);

      if (overviewRes.portfolio) {
        setOverview(overviewRes.portfolio);
      }

      if (overviewRes.allocation && overviewRes.allocation.length > 0) {
        setAllocation(overviewRes.allocation);
      }

      if (historyRes.history && historyRes.history.length > 0) {
        setHistoryData(portfolioService.generateChartData(historyRes.history));
      }

      if (performanceRes.performance) {
        setPerformance(performanceRes.performance);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const diversityScore = portfolioService.calculateDiversityScore(allocation);

  const PerformanceItem: React.FC<{ label: string; data: { return: number; pnl: string } }> = ({ label, data }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${colors.glass.border}`,
    }}>
      <span style={{ fontSize: '14px', color: colors.text.secondary }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: data.return >= 0 ? colors.trading.buy : colors.trading.sell,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {portfolioService.formatPercent(data.return)}
        </p>
        <p style={{
          fontSize: '12px',
          color: colors.text.tertiary,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {data.return >= 0 ? '+' : ''}${parseFloat(data.pnl).toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout activeNav="dashboard" title="Portfolio">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              style={{
                padding: '10px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                color: colors.text.primary,
                display: 'flex',
              }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: colors.text.primary,
            }}>
              Portfolio
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPortfolioData}
            style={{
              padding: '10px',
              background: colors.background.card,
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '10px',
              cursor: 'pointer',
              color: colors.text.tertiary,
              display: 'flex',
            }}
          >
            {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={20} />}
          </motion.button>
        </motion.div>

        {/* Portfolio Value Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" padding="lg" style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '20px',
            }}>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px' }}>
                  Total Portfolio Value
                </p>
                <p style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: '8px',
                }}>
                  {portfolioService.formatCurrency(overview.totalValue)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    background: overview.change24hPercent >= 0
                      ? `${colors.trading.buy}20`
                      : `${colors.trading.sell}20`,
                    borderRadius: '20px',
                  }}>
                    {overview.change24hPercent >= 0 ? (
                      <TrendingUp size={14} color={colors.trading.buy} />
                    ) : (
                      <TrendingDown size={14} color={colors.trading.sell} />
                    )}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: overview.change24hPercent >= 0 ? colors.trading.buy : colors.trading.sell,
                    }}>
                      {portfolioService.formatPercent(overview.change24hPercent)} (24h)
                    </span>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: overview.totalPnlPercent >= 0 ? colors.trading.buy : colors.trading.sell,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {overview.totalPnlPercent >= 0 ? '+' : ''}{portfolioService.formatCurrency(overview.totalPnl)} all time
                  </span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                gap: '8px',
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Total Cost</p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.text.primary,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {portfolioService.formatCurrency(overview.totalCost)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Total P&L</p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: overview.totalPnlPercent >= 0 ? colors.trading.buy : colors.trading.sell,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {portfolioService.formatPercent(overview.totalPnlPercent)}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard variant="default" padding="lg" style={{ marginBottom: '24px' }}>
            {/* Period Selector */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: colors.text.primary,
              }}>
                Portfolio History
              </h3>
              <div style={{
                display: 'flex',
                gap: '4px',
                background: colors.background.card,
                padding: '4px',
                borderRadius: '10px',
                border: `1px solid ${colors.glass.border}`,
              }}>
                {periods.map((period) => (
                  <motion.button
                    key={period.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPeriod(period.value)}
                    style={{
                      padding: '6px 12px',
                      background: selectedPeriod === period.value ? colors.primary[400] : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: selectedPeriod === period.value ? '#000' : colors.text.secondary,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {period.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary[400]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors.primary[400]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.glass.border} />
                  <XAxis
                    dataKey="date"
                    stroke={colors.text.tertiary}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={colors.text.tertiary}
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? 'rgba(20, 22, 28, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: 8,
                    }}
                    formatter={(value: number) => [portfolioService.formatCurrency(value), 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={colors.primary[400]}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Allocation & Performance */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '20px',
          marginBottom: '24px',
        }}>
          {/* Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="default" padding="lg">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text.primary,
                }}>
                  Asset Allocation
                </h3>
                <div style={{
                  padding: '4px 10px',
                  background: isDark ? 'rgba(0, 200, 83, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px',
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.trading.buy,
                  }}>
                    Diversity: {diversityScore}/100
                  </span>
                </div>
              </div>

              {/* Pie Chart */}
              <div style={{ height: '180px', marginBottom: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="percent"
                    >
                      {allocation.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div>
                {allocation.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: index < allocation.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        background: COLORS[index % COLORS.length],
                      }} />
                      <CryptoIcon symbol={item.asset} size={20} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text.primary }}>
                        {item.asset}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text.primary,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {portfolioService.formatCurrency(item.value)}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: colors.text.tertiary,
                        marginLeft: '8px',
                      }}>
                        {item.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard variant="default" padding="lg">
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: colors.text.primary,
                marginBottom: '16px',
              }}>
                Performance
              </h3>

              <PerformanceItem label="24 Hours" data={performance.daily} />
              <PerformanceItem label="7 Days" data={performance.weekly} />
              <PerformanceItem label="30 Days" data={performance.monthly} />
              <PerformanceItem label="1 Year" data={performance.yearly} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>All Time</span>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: performance.allTime.return >= 0 ? colors.trading.buy : colors.trading.sell,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {portfolioService.formatPercent(performance.allTime.return)}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: colors.text.tertiary,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {performance.allTime.return >= 0 ? '+' : ''}${parseFloat(performance.allTime.pnl).toLocaleString()}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Asset Holdings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard variant="default" padding="lg">
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: '16px',
            }}>
              Holdings
            </h3>

            {allocation.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: index < allocation.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CryptoIcon symbol={item.asset} size={40} />
                  <div>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}>
                      {item.asset}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                      {item.percent.toFixed(1)}% of portfolio
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: colors.text.primary,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {portfolioService.formatCurrency(item.value)}
                  </p>
                  {/* Mock 24h change */}
                  <p style={{
                    fontSize: '12px',
                    color: index % 2 === 0 ? colors.trading.buy : colors.trading.sell,
                  }}>
                    {index % 2 === 0 ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </GlassCard>
        </motion.div>
      </div>
    </ResponsiveLayout>
  );
};

export default PortfolioScreen;
