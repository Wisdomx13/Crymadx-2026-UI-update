// CrymadX Rewards Service
// Handles rewards, tasks, and tier operations
// Uses local storage as backend rewards service is not yet implemented

import { api } from './api';

export interface RewardsTask {
  id: string;
  type: 'daily' | 'weekly';
  title: string;
  description: string;
  reward: number;
  rewardType: 'points' | 'usdt';
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  expiresAt?: string;
}

export interface UserRewardsSummary {
  totalPoints: number;
  pendingRewards: string;
  completedTasks: number;
  currentTier: string;
  nextTier: string;
  tierProgress: number;
  tradingVolume: string;
}

export interface RewardsTier {
  id: string;
  name: string;
  minVolume: string;
  tradingFee: string;
  benefits: string[];
  color: string;
  current?: boolean;
}

export interface RewardHistoryItem {
  id: string;
  type: 'task_completion' | 'tier_bonus' | 'referral' | 'trading';
  title: string;
  description: string;
  amount: number;
  amountType: 'points' | 'usdt';
  createdAt: string;
}

// Local storage keys
const REWARDS_STORAGE_KEY = 'crymadx_rewards_data';
const HISTORY_STORAGE_KEY = 'crymadx_rewards_history';

// Default tiers
const DEFAULT_TIERS: RewardsTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minVolume: '$0',
    tradingFee: '0.10%',
    benefits: ['Basic support', 'Standard withdrawal limits', 'Access to spot trading'],
    color: '#CD7F32',
  },
  {
    id: 'silver',
    name: 'Silver',
    minVolume: '$10,000',
    tradingFee: '0.08%',
    benefits: ['Priority support', 'Higher withdrawal limits', 'Reduced fees', 'Early access to new features'],
    color: '#C0C0C0',
  },
  {
    id: 'gold',
    name: 'Gold',
    minVolume: '$50,000',
    tradingFee: '0.06%',
    benefits: ['24/7 dedicated support', 'Premium withdrawal limits', 'VIP events access', 'Exclusive rewards'],
    color: '#FFD700',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minVolume: '$200,000',
    tradingFee: '0.04%',
    benefits: ['Personal account manager', 'Highest withdrawal limits', 'Zero deposit fees', 'Exclusive airdrops'],
    color: '#E5E4E2',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    minVolume: '$500,000',
    tradingFee: '0.02%',
    benefits: ['Elite concierge service', 'Custom trading tools', 'Invitation to exclusive events', 'Revenue sharing'],
    color: '#B9F2FF',
  },
];

// Generate daily tasks based on current date
const generateDailyTasks = (claimedTasks: string[]): RewardsTask[] => {
  const today = new Date().toDateString();
  const baseId = `daily_${today}_`;

  return [
    {
      id: `${baseId}login`,
      type: 'daily',
      title: 'Daily Login',
      description: 'Log in to the platform daily',
      reward: 10,
      rewardType: 'points',
      progress: 1,
      target: 1,
      completed: true,
      claimed: claimedTasks.includes(`${baseId}login`),
    },
    {
      id: `${baseId}trade`,
      type: 'daily',
      title: 'Make a Trade',
      description: 'Complete at least one trade today',
      reward: 20,
      rewardType: 'points',
      progress: Math.floor(Math.random() * 2),
      target: 1,
      completed: false,
      claimed: claimedTasks.includes(`${baseId}trade`),
    },
    {
      id: `${baseId}deposit`,
      type: 'daily',
      title: 'Deposit Funds',
      description: 'Make a deposit of any amount',
      reward: 50,
      rewardType: 'points',
      progress: 0,
      target: 1,
      completed: false,
      claimed: claimedTasks.includes(`${baseId}deposit`),
    },
  ];
};

// Generate weekly tasks based on current week
const generateWeeklyTasks = (claimedTasks: string[]): RewardsTask[] => {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const baseId = `weekly_${weekNum}_`;

  return [
    {
      id: `${baseId}volume100`,
      type: 'weekly',
      title: 'Trading Volume',
      description: 'Achieve $100 in trading volume this week',
      reward: 100,
      rewardType: 'points',
      progress: Math.floor(Math.random() * 80),
      target: 100,
      completed: false,
      claimed: claimedTasks.includes(`${baseId}volume100`),
    },
    {
      id: `${baseId}trades5`,
      type: 'weekly',
      title: 'Active Trader',
      description: 'Complete 5 trades this week',
      reward: 75,
      rewardType: 'points',
      progress: Math.floor(Math.random() * 4),
      target: 5,
      completed: false,
      claimed: claimedTasks.includes(`${baseId}trades5`),
    },
    {
      id: `${baseId}referral`,
      type: 'weekly',
      title: 'Refer a Friend',
      description: 'Invite a friend who signs up and trades',
      reward: 5,
      rewardType: 'usdt',
      progress: 0,
      target: 1,
      completed: false,
      claimed: claimedTasks.includes(`${baseId}referral`),
    },
  ];
};

// Local storage helpers
interface StoredRewardsData {
  totalPoints: number;
  completedTasks: number;
  claimedTasks: string[];
  lastUpdated: string;
}

const getStoredRewardsData = (): StoredRewardsData => {
  try {
    const stored = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return {
    totalPoints: 0,
    completedTasks: 0,
    claimedTasks: [],
    lastUpdated: new Date().toISOString(),
  };
};

const storeRewardsData = (data: StoredRewardsData): void => {
  localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(data));
};

const getStoredHistory = (): RewardHistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeHistory = (history: RewardHistoryItem[]): void => {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
};

const addHistoryItem = (item: Omit<RewardHistoryItem, 'id' | 'createdAt'>): RewardHistoryItem => {
  const history = getStoredHistory();
  const newItem: RewardHistoryItem = {
    ...item,
    id: `reward_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  history.unshift(newItem);
  storeHistory(history.slice(0, 100)); // Keep last 100 items
  return newItem;
};

// Calculate tier based on points
const calculateTier = (points: number): { current: string; next: string; progress: number } => {
  const thresholds = [
    { name: 'Bronze', minPoints: 0 },
    { name: 'Silver', minPoints: 1000 },
    { name: 'Gold', minPoints: 5000 },
    { name: 'Platinum', minPoints: 20000 },
    { name: 'Diamond', minPoints: 50000 },
  ];

  let current = 'Bronze';
  let next = 'Silver';
  let progress = 0;

  for (let i = 0; i < thresholds.length; i++) {
    if (points >= thresholds[i].minPoints) {
      current = thresholds[i].name;
      if (i < thresholds.length - 1) {
        next = thresholds[i + 1].name;
        const currentMin = thresholds[i].minPoints;
        const nextMin = thresholds[i + 1].minPoints;
        progress = Math.min(100, Math.floor(((points - currentMin) / (nextMin - currentMin)) * 100));
      } else {
        next = 'Diamond';
        progress = 100;
      }
    }
  }

  return { current, next, progress };
};

export const rewardsService = {
  // Get user's rewards summary
  getSummary: async (): Promise<UserRewardsSummary> => {
    // Try backend first
    try {
      return await api.get('/api/rewards/summary');
    } catch {
      // Fall back to local storage
      const data = getStoredRewardsData();
      const tierInfo = calculateTier(data.totalPoints);

      return {
        totalPoints: data.totalPoints,
        pendingRewards: '$0.00',
        completedTasks: data.completedTasks,
        currentTier: tierInfo.current,
        nextTier: tierInfo.next,
        tierProgress: tierInfo.progress,
        tradingVolume: '$0',
      };
    }
  },

  // Get all tasks (daily and weekly)
  getTasks: async (): Promise<{ daily: RewardsTask[]; weekly: RewardsTask[] }> => {
    // Try backend first
    try {
      return await api.get('/api/rewards/tasks');
    } catch {
      // Fall back to local generated tasks
      const data = getStoredRewardsData();
      const daily = generateDailyTasks(data.claimedTasks);
      const weekly = generateWeeklyTasks(data.claimedTasks);

      // Update progress based on stored data
      daily.forEach(task => {
        if (task.progress >= task.target) {
          task.completed = true;
        }
      });

      weekly.forEach(task => {
        if (task.progress >= task.target) {
          task.completed = true;
        }
      });

      return { daily, weekly };
    }
  },

  // Claim a completed task
  claimTask: async (taskId: string): Promise<{ message: string; pointsEarned: number }> => {
    // Try backend first
    try {
      return await api.post(`/api/rewards/tasks/${taskId}/claim`, {});
    } catch {
      // Fall back to local storage
      const data = getStoredRewardsData();

      // Check if already claimed
      if (data.claimedTasks.includes(taskId)) {
        throw new Error('Task already claimed');
      }

      // Determine points earned based on task type
      let pointsEarned = 10;
      let taskTitle = 'Task Completed';

      if (taskId.includes('login')) {
        pointsEarned = 10;
        taskTitle = 'Daily Login';
      } else if (taskId.includes('trade') && taskId.includes('daily')) {
        pointsEarned = 20;
        taskTitle = 'Daily Trade';
      } else if (taskId.includes('deposit')) {
        pointsEarned = 50;
        taskTitle = 'Deposit Bonus';
      } else if (taskId.includes('volume')) {
        pointsEarned = 100;
        taskTitle = 'Trading Volume';
      } else if (taskId.includes('trades5')) {
        pointsEarned = 75;
        taskTitle = 'Active Trader';
      } else if (taskId.includes('referral')) {
        pointsEarned = 50; // USDT rewards show as points for simplicity
        taskTitle = 'Referral Bonus';
      }

      // Update stored data
      data.totalPoints += pointsEarned;
      data.completedTasks += 1;
      data.claimedTasks.push(taskId);
      data.lastUpdated = new Date().toISOString();
      storeRewardsData(data);

      // Add to history
      addHistoryItem({
        type: 'task_completion',
        title: taskTitle,
        description: `Claimed reward for completing ${taskTitle}`,
        amount: pointsEarned,
        amountType: 'points',
      });

      return {
        message: 'Task claimed successfully',
        pointsEarned,
      };
    }
  },

  // Get available tiers
  getTiers: async (): Promise<{ tiers: RewardsTier[] }> => {
    // Try backend first
    try {
      return await api.get('/api/rewards/tiers', undefined, false);
    } catch {
      // Return default tiers
      return { tiers: DEFAULT_TIERS };
    }
  },

  // Get reward history
  getHistory: async (page?: number, limit?: number): Promise<{ history: RewardHistoryItem[]; total: number; page: number; totalPages: number }> => {
    // Try backend first
    try {
      const params: Record<string, any> = {};
      if (page) params.page = page;
      if (limit) params.limit = limit;
      return await api.get('/api/rewards/history', params);
    } catch {
      // Fall back to local storage
      const history = getStoredHistory();
      const pageNum = page || 1;
      const pageSize = limit || 20;
      const offset = (pageNum - 1) * pageSize;

      return {
        history: history.slice(offset, offset + pageSize),
        total: history.length,
        page: pageNum,
        totalPages: Math.ceil(history.length / pageSize),
      };
    }
  },

  // Update task progress (used internally by other actions)
  updateProgress: async (taskId: string, progress: number): Promise<{ task: RewardsTask }> => {
    // Try backend first
    try {
      return await api.post(`/api/rewards/tasks/${taskId}/progress`, { progress });
    } catch {
      // This is a local helper, just return a mock response
      return {
        task: {
          id: taskId,
          type: 'daily',
          title: 'Task',
          description: '',
          reward: 0,
          rewardType: 'points',
          progress,
          target: 1,
          completed: progress >= 1,
          claimed: false,
        },
      };
    }
  },
};

export default rewardsService;
