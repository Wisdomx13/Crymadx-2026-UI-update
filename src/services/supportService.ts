// CrymadX Support Service
// Handles support tickets and customer service
// Uses local storage as backend is not yet implemented

import { api } from './api';

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: number;
  userId?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  message: string;
  sender: 'user' | 'support';
  senderName?: string;
  createdAt: string;
  attachments?: string[];
}

export interface CreateTicketRequest {
  subject: string;
  category: string;
  priority?: 'low' | 'medium' | 'high';
  message: string;
}

// Local storage key for tickets
const TICKETS_STORAGE_KEY = 'crymadx_support_tickets';
const MESSAGES_STORAGE_KEY = 'crymadx_ticket_messages';

// Helper functions for local storage
const getStoredTickets = (): SupportTicket[] => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeTickets = (tickets: SupportTicket[]): void => {
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
};

const getStoredMessages = (): TicketMessage[] => {
  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeMessages = (messages: TicketMessage[]): void => {
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
};

const generateTicketId = (): string => {
  return `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

const generateMessageId = (): string => {
  return `MSG-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
};

// Auto-reply messages for different categories
const getAutoReply = (category: string): string => {
  const replies: Record<string, string> = {
    general: 'Thank you for contacting CrymadX Support. Our team will review your inquiry and respond within 24-48 hours. For urgent matters, please check our FAQ section or community forums.',
    security: 'Thank you for reporting this security concern. Our security team takes all reports seriously and will investigate promptly. Please do not share any sensitive information in this ticket. We will contact you securely if additional details are needed.',
    deposits: 'Thank you for your deposit inquiry. Please note that deposit processing times vary by network: BTC (1-3 confirmations), ETH (12 confirmations), SOL (1 confirmation). If your deposit hasn\'t arrived after the required confirmations, our team will investigate.',
    withdrawals: 'Thank you for your withdrawal inquiry. Withdrawals are typically processed within 1-24 hours depending on network conditions and security reviews. Our team will review your case and provide an update.',
    trading: 'Thank you for your trading-related question. Our trading support team will review your inquiry and respond with detailed information. For real-time trading issues, please check our status page.',
    verification: 'Thank you for your KYC/verification inquiry. Our compliance team reviews all verification submissions within 24-72 hours. If additional documents are needed, you will be notified via email.',
  };
  return replies[category] || replies.general;
};

export const supportService = {
  /**
   * Get all tickets for the current user
   * Falls back to local storage if backend is unavailable
   */
  getTickets: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    tickets: SupportTicket[];
    total: number;
    stats: {
      open: number;
      inProgress: number;
      resolved: number;
      total: number;
    };
  }> => {
    // Try backend first
    try {
      const response = await api.get<{
        tickets: SupportTicket[];
        total: number;
        stats: { open: number; inProgress: number; resolved: number; total: number };
      }>('/api/support/tickets', params as Record<string, any>);
      return response;
    } catch (error: any) {
      // Don't fall back for auth errors - re-throw them
      if (error.message?.includes('Session expired') || error.message?.includes('401') || error.message?.includes('Not authenticated')) {
        throw error;
      }
      // Fall back to local storage for other errors (network issues, etc.)
      let tickets = getStoredTickets();

      // Filter by status if provided
      if (params?.status) {
        tickets = tickets.filter(t => t.status === params.status);
      }

      // Calculate stats
      const allTickets = getStoredTickets();
      const stats = {
        open: allTickets.filter(t => t.status === 'open').length,
        inProgress: allTickets.filter(t => t.status === 'in_progress').length,
        resolved: allTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        total: allTickets.length,
      };

      // Apply pagination
      const offset = params?.offset || 0;
      const limit = params?.limit || 50;
      tickets = tickets.slice(offset, offset + limit);

      return { tickets, total: allTickets.length, stats };
    }
  },

  /**
   * Get a single ticket by ID
   */
  getTicket: async (ticketId: string): Promise<{
    ticket: SupportTicket;
    messages: TicketMessage[];
  }> => {
    // Try backend first
    try {
      return await api.get(`/api/support/tickets/${ticketId}`);
    } catch (error: any) {
      // Don't fall back for auth errors - re-throw them
      if (error.message?.includes('Session expired') || error.message?.includes('401') || error.message?.includes('Not authenticated')) {
        throw error;
      }
      // Fall back to local storage for other errors
      const tickets = getStoredTickets();
      const ticket = tickets.find(t => t.id === ticketId);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const allMessages = getStoredMessages();
      const messages = allMessages.filter(m => m.ticketId === ticketId);

      return { ticket, messages };
    }
  },

  /**
   * Create a new support ticket
   */
  createTicket: async (request: CreateTicketRequest): Promise<{
    message: string;
    ticket: SupportTicket;
  }> => {
    // Try backend first
    try {
      return await api.post('/api/support/tickets', request);
    } catch (error: any) {
      // Don't fall back for auth errors - re-throw them
      if (error.message?.includes('Session expired') || error.message?.includes('401') || error.message?.includes('Not authenticated')) {
        throw error;
      }
      // Fall back to local storage for other errors (network issues, etc.)
      const now = new Date().toISOString();
      const ticketId = generateTicketId();

      const newTicket: SupportTicket = {
        id: ticketId,
        subject: request.subject,
        category: request.category,
        status: 'open',
        priority: request.priority || 'medium',
        createdAt: now,
        updatedAt: now,
        messages: 2, // User message + auto-reply
      };

      // Save ticket
      const tickets = getStoredTickets();
      tickets.unshift(newTicket);
      storeTickets(tickets);

      // Save initial messages
      const messages = getStoredMessages();

      // User's initial message
      const userMessage: TicketMessage = {
        id: generateMessageId(),
        ticketId,
        message: request.message,
        sender: 'user',
        senderName: 'You',
        createdAt: now,
      };

      // Auto-reply from support
      const supportMessage: TicketMessage = {
        id: generateMessageId(),
        ticketId,
        message: getAutoReply(request.category),
        sender: 'support',
        senderName: 'CrymadX Support',
        createdAt: new Date(Date.now() + 1000).toISOString(), // 1 second after user message
      };

      messages.unshift(supportMessage);
      messages.unshift(userMessage);
      storeMessages(messages);

      return {
        message: 'Ticket created successfully',
        ticket: newTicket,
      };
    }
  },

  /**
   * Reply to a ticket
   */
  replyToTicket: async (ticketId: string, message: string, attachments?: string[]): Promise<{
    message: string;
    reply: TicketMessage;
  }> => {
    // Try backend first
    try {
      return await api.post(`/api/support/tickets/${ticketId}/reply`, { message, attachments });
    } catch (error: any) {
      // Don't fall back for auth errors - re-throw them
      if (error.message?.includes('Session expired') || error.message?.includes('401') || error.message?.includes('Not authenticated')) {
        throw error;
      }
      // Fall back to local storage for other errors
      const now = new Date().toISOString();

      // Update ticket
      const tickets = getStoredTickets();
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);

      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }

      tickets[ticketIndex].updatedAt = now;
      tickets[ticketIndex].messages += 1;
      storeTickets(tickets);

      // Save message
      const messages = getStoredMessages();
      const newMessage: TicketMessage = {
        id: generateMessageId(),
        ticketId,
        message,
        sender: 'user',
        senderName: 'You',
        createdAt: now,
        attachments,
      };

      messages.push(newMessage);
      storeMessages(messages);

      return {
        message: 'Reply sent successfully',
        reply: newMessage,
      };
    }
  },

  /**
   * Close a ticket
   */
  closeTicket: async (ticketId: string): Promise<{ message: string }> => {
    // Try backend first
    try {
      return await api.patch(`/api/support/tickets/${ticketId}`, { status: 'closed' });
    } catch (error: any) {
      // Don't fall back for auth errors - re-throw them
      if (error.message?.includes('Session expired') || error.message?.includes('401') || error.message?.includes('Not authenticated')) {
        throw error;
      }
      // Fall back to local storage for other errors
      const tickets = getStoredTickets();
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);

      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }

      tickets[ticketIndex].status = 'closed';
      tickets[ticketIndex].updatedAt = new Date().toISOString();
      storeTickets(tickets);

      return { message: 'Ticket closed successfully' };
    }
  },

  /**
   * Get ticket categories
   */
  getCategories: async (): Promise<{
    categories: Array<{
      id: string;
      label: string;
      description?: string;
    }>;
  }> => {
    return Promise.resolve({
      categories: [
        { id: 'general', label: 'General Inquiry', description: 'General questions about CrymadX' },
        { id: 'security', label: 'Security Issue', description: 'Report security concerns or unauthorized access' },
        { id: 'deposits', label: 'Deposit Problem', description: 'Issues with deposits or pending transactions' },
        { id: 'withdrawals', label: 'Withdrawal Issue', description: 'Problems with withdrawals or delays' },
        { id: 'trading', label: 'Trading Question', description: 'Questions about trading, fees, or orders' },
        { id: 'verification', label: 'KYC/Verification', description: 'Account verification and identity questions' },
      ],
    });
  },

  /**
   * Format ticket status for display
   */
  formatStatus: (status: string): string => {
    const statusMap: Record<string, string> = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    };
    return statusMap[status] || status;
  },

  /**
   * Get priority color
   */
  getPriorityColor: (priority: string): string => {
    const colorMap: Record<string, string> = {
      low: '#8a8f98',
      medium: '#f0b90b',
      high: '#f6465d',
    };
    return colorMap[priority] || '#8a8f98';
  },

  /**
   * Get status color
   */
  getStatusColor: (status: string): string => {
    const colorMap: Record<string, string> = {
      open: '#f0b90b',
      in_progress: '#00d4aa',
      resolved: '#00e77f',
      closed: '#8a8f98',
    };
    return colorMap[status] || '#8a8f98';
  },
};

export default supportService;
