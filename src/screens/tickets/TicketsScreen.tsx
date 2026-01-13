import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  X,
  Send,
  Paperclip,
  HelpCircle,
  Shield,
  CreditCard,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Glass3DCard, Glass3DStat } from '../../components/Glass3D';
import { ResponsiveLayout } from '../../components';
import { supportService } from '../../services';
import { useAuth } from '../../context/AuthContext';

interface TicketItem {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: number;
}

export const TicketsScreen: React.FC = () => {
  const { colors, isDark } = useThemeMode();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [_isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  // New ticket form state
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('general');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        // Limit file size to 10MB
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          return false;
        }
        // Check allowed file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          alert(`File type not allowed for "${file.name}". Allowed: images, PDF, DOC, TXT`);
          return false;
        }
        return true;
      });
      setAttachments(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await supportService.getTickets();
        if (response.tickets) {
          const mappedTickets: TicketItem[] = response.tickets.map((t: any) => ({
            id: t.id || t.ticketId,
            subject: t.subject || t.title,
            category: t.category || 'General',
            status: t.status || 'open',
            priority: t.priority || 'medium',
            createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
            updatedAt: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '',
            messages: t.messages || t.messageCount || 0,
          }));
          setTickets(mappedTickets);
        }
        if (response.stats) {
          setTicketStats({
            total: response.stats.total || 0,
            open: response.stats.open || 0,
            inProgress: response.stats.inProgress || 0,
            resolved: response.stats.resolved || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isAuthenticated]);

  // Handle creating new ticket
  const handleCreateTicket = async () => {
    if (!newTicketSubject || !newTicketMessage) return;

    setSubmitting(true);
    try {
      await supportService.createTicket({
        subject: newTicketSubject,
        category: newTicketCategory,
        priority: newTicketPriority,
        message: newTicketMessage,
      });

      // Refresh tickets
      const response = await supportService.getTickets();
      if (response.tickets) {
        const mappedTickets: TicketItem[] = response.tickets.map((t: any) => ({
          id: t.id || t.ticketId,
          subject: t.subject || t.title,
          category: t.category || 'General',
          status: t.status || 'open',
          priority: t.priority || 'medium',
          createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
          updatedAt: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '',
          messages: t.messages || t.messageCount || 0,
        }));
        setTickets(mappedTickets);
      }

      // Reset form and close modal
      setNewTicketSubject('');
      setNewTicketCategory('general');
      setNewTicketMessage('');
      setNewTicketPriority('medium');
      setAttachments([]);
      setShowNewTicket(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'general', label: 'General', icon: <HelpCircle size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'deposits', label: 'Deposits', icon: <CreditCard size={18} /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <RefreshCw size={18} /> },
    { id: 'trading', label: 'Trading', icon: <MessageSquare size={18} /> },
  ];

  const tabs = [
    { id: 'all', label: 'All Tickets', count: ticketStats.total },
    { id: 'open', label: 'Open', count: ticketStats.open + ticketStats.inProgress },
    { id: 'resolved', label: 'Resolved', count: ticketStats.resolved },
  ];

  const getStatusColor = (status: TicketItem['status']) => {
    switch (status) {
      case 'open':
        return colors.status.warning;
      case 'in_progress':
        return colors.primary[400];
      case 'resolved':
        return colors.status.success;
      case 'closed':
        return colors.text.tertiary;
      default:
        return colors.text.tertiary;
    }
  };

  const getStatusIcon = (status: TicketItem['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={14} />;
      case 'in_progress':
        return <Clock size={14} />;
      case 'resolved':
        return <CheckCircle size={14} />;
      case 'closed':
        return <X size={14} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: TicketItem['priority']) => {
    switch (priority) {
      case 'high':
        return colors.status.error;
      case 'medium':
        return colors.status.warning;
      case 'low':
        return colors.primary[400];
      default:
        return colors.text.tertiary;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === 'open') return ticket.status === 'open' || ticket.status === 'in_progress';
    if (activeTab === 'resolved') return ticket.status === 'resolved' || ticket.status === 'closed';
    return true;
  });

  return (
    <ResponsiveLayout activeNav="tickets" title="Support">
      {/* Background effects */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: colors.gradients.mesh,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Ticket size={32} color={colors.primary[400]} />
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                Support Tickets
              </h1>
            </div>
            <p style={{ fontSize: '15px', color: colors.text.tertiary }}>
              Get help from our support team
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: colors.shadows.glowLg }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewTicket(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: colors.gradients.primary,
              border: 'none',
              borderRadius: '12px',
              color: colors.background.primary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: colors.shadows.glow,
            }}
          >
            <Plus size={18} />
            New Ticket
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <Glass3DStat
            label="Total Tickets"
            value={ticketStats.total.toString()}
            icon={<Ticket size={20} />}
          />
          <Glass3DStat
            label="Open"
            value={ticketStats.open.toString()}
            icon={<AlertCircle size={20} />}
          />
          <Glass3DStat
            label="In Progress"
            value={ticketStats.inProgress.toString()}
            icon={<Clock size={20} />}
          />
          <Glass3DStat
            label="Resolved"
            value={ticketStats.resolved.toString()}
            icon={<CheckCircle size={20} />}
          />
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Glass3DCard depth={2}>
            <div style={{ padding: '24px' }}>
              {/* Search and Filters */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {/* Search */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: isDark ? 'rgba(0, 255, 170, 0.03)' : '#ffffff',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '12px',
                  }}
                >
                  <Search size={18} color={colors.text.tertiary} />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      color: colors.text.primary,
                    }}
                  />
                </div>

                {/* Filter */}
                <motion.button
                  whileHover={{ borderColor: colors.glass.borderHover }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '12px',
                    color: colors.text.secondary,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <Filter size={16} />
                  Filters
                </motion.button>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '24px',
                  borderBottom: `1px solid ${colors.glass.border}`,
                  paddingBottom: '16px',
                }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      background:
                        activeTab === tab.id
                          ? 'rgba(0, 255, 170, 0.15)'
                          : 'transparent',
                      border: `1px solid ${
                        activeTab === tab.id
                          ? colors.primary[400]
                          : 'transparent'
                      }`,
                      borderRadius: '10px',
                      color:
                        activeTab === tab.id
                          ? colors.primary[400]
                          : colors.text.tertiary,
                      fontSize: '14px',
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                    <span
                      style={{
                        padding: '2px 8px',
                        background:
                          activeTab === tab.id
                            ? isDark ? 'rgba(0, 255, 170, 0.2)' : 'rgba(16, 185, 129, 0.15)'
                            : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isDark ? 'inherit' : '#030712',
                      }}
                    >
                      {tab.count}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Tickets Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      background: isDark ? 'rgba(0, 255, 170, 0.03)' : 'rgba(16, 185, 129, 0.05)',
                      borderColor: colors.glass.borderHover,
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      background: isDark ? 'rgba(4, 26, 15, 0.3)' : '#ffffff',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Priority indicator */}
                    <div
                      style={{
                        width: '4px',
                        height: '40px',
                        borderRadius: '2px',
                        background: getPriorityColor(ticket.priority),
                        marginRight: '16px',
                      }}
                    />

                    {/* Ticket info */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.tertiary,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {ticket.id}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            background: 'rgba(0, 255, 170, 0.1)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: colors.primary[400],
                          }}
                        >
                          {ticket.category}
                        </span>
                      </div>
                      <h4
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: colors.text.primary,
                          marginBottom: '4px',
                        }}
                      >
                        {ticket.subject}
                      </h4>
                      <p
                        style={{
                          fontSize: '12px',
                          color: colors.text.tertiary,
                        }}
                      >
                        Created: {ticket.createdAt} • Updated: {ticket.updatedAt}
                      </p>
                    </div>

                    {/* Messages count */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        background: isDark ? 'rgba(0, 255, 170, 0.05)' : 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '8px',
                        marginRight: '16px',
                      }}
                    >
                      <MessageSquare size={14} color={colors.text.tertiary} />
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: colors.text.secondary,
                        }}
                      >
                        {ticket.messages}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: `${getStatusColor(ticket.status)}15`,
                        borderRadius: '8px',
                        marginRight: '16px',
                      }}
                    >
                      <span style={{ color: getStatusColor(ticket.status) }}>
                        {getStatusIcon(ticket.status)}
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: getStatusColor(ticket.status),
                          textTransform: 'capitalize',
                        }}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={20} color={colors.text.tertiary} />
                  </motion.div>
                ))}

                {/* Empty State */}
                {filteredTickets.length === 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '60px 40px',
                      textAlign: 'center',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: isDark ? 'rgba(0, 255, 170, 0.05)' : 'rgba(16, 185, 129, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                      }}
                    >
                      <Ticket size={40} color={colors.text.tertiary} />
                    </motion.div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: '8px',
                      }}
                    >
                      No tickets found
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: colors.text.tertiary,
                        maxWidth: '400px',
                        marginBottom: '24px',
                      }}
                    >
                      You haven't created any support tickets yet. Click the button below to get help.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowNewTicket(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: colors.gradients.primary,
                        border: 'none',
                        borderRadius: '12px',
                        color: colors.background.primary,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={18} />
                      Create Ticket
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </Glass3DCard>
        </motion.div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewTicket(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '420px',
                background: colors.background.secondary,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: `1px solid ${colors.glass.border}`,
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Create New Ticket
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewTicket(false)}
                  style={{
                    padding: '8px',
                    background: 'rgba(255, 51, 102, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: colors.status.error,
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '16px 20px' }}>
                {/* Category Selection */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: colors.text.secondary,
                      marginBottom: '8px',
                    }}
                  >
                    Category
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                    }}
                  >
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ borderColor: colors.primary[400] }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setNewTicketCategory(cat.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '12px 8px',
                          background: newTicketCategory === cat.id
                            ? 'rgba(0, 255, 170, 0.15)'
                            : 'rgba(0, 255, 170, 0.03)',
                          border: `1px solid ${newTicketCategory === cat.id ? colors.primary[400] : colors.glass.border}`,
                          borderRadius: '10px',
                          color: newTicketCategory === cat.id ? colors.primary[400] : colors.text.secondary,
                          cursor: 'pointer',
                        }}
                      >
                        {cat.icon}
                        <span style={{ fontSize: '11px', fontWeight: 500 }}>
                          {cat.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: colors.text.secondary,
                      marginBottom: '8px',
                    }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0, 255, 170, 0.03)',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      fontSize: '13px',
                      color: colors.text.primary,
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: colors.text.secondary,
                      marginBottom: '8px',
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Provide detailed information about your issue..."
                    rows={4}
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0, 255, 170, 0.03)',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      fontSize: '13px',
                      color: colors.text.primary,
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Attachment */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <motion.button
                  type="button"
                  whileHover={{ borderColor: colors.primary[400], background: 'rgba(0, 255, 170, 0.05)' }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: `1px dashed ${colors.glass.border}`,
                    borderRadius: '10px',
                    color: colors.text.tertiary,
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginBottom: attachments.length > 0 ? '8px' : '16px',
                  }}
                >
                  <Paperclip size={16} />
                  {attachments.length > 0 ? `Add more files (${attachments.length}/5)` : 'Attach files (optional)'}
                </motion.button>

                {/* Attached files list */}
                {attachments.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'rgba(0, 255, 170, 0.05)',
                          borderRadius: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                          <Paperclip size={14} color={colors.primary[400]} />
                          <span style={{
                            fontSize: '12px',
                            color: colors.text.secondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {file.name}
                          </span>
                          <span style={{ fontSize: '11px', color: colors.text.tertiary }}>
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeAttachment(index)}
                          style={{
                            padding: '4px',
                            background: 'rgba(255, 51, 102, 0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            color: colors.status.error,
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <X size={12} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: colors.shadows.glowLg }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateTicket}
                  disabled={submitting || !newTicketSubject || !newTicketMessage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: colors.gradients.primary,
                    border: 'none',
                    borderRadius: '10px',
                    color: colors.background.primary,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: submitting || !newTicketSubject || !newTicketMessage ? 'not-allowed' : 'pointer',
                    boxShadow: colors.shadows.glow,
                    opacity: submitting || !newTicketSubject || !newTicketMessage ? 0.6 : 1,
                  }}
                >
                  {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default TicketsScreen;
