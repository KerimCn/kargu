import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { notificationAPI } from '../../services/api';

const NotificationBell = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    setIsOpen(false);
    
    // Navigate to case detail page with appropriate tab
    if (onNotificationClick && notification.case_id) {
      // Determine which tab to open based on notification type
      let targetTab = 'data'; // default
      switch (notification.type) {
        case 'comment':
          targetTab = 'comments';
          break;
        case 'task_created':
          targetTab = 'tasks';
          break;
        case 'playbook_completed':
          targetTab = 'playbooks';
          break;
        case 'case_closed':
        case 'case_reopened':
          targetTab = 'data';
          break;
        default:
          targetTab = 'data';
      }
      
      onNotificationClick(notification.case_id, targetTab);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'playbook_completed':
        return '✅';
      case 'case_closed':
        return '🔒';
      case 'case_reopened':
        return '🔓';
      case 'task_created':
        return '📋';
      default:
        return '🔔';
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'transparent',
          border: 'none',
          color: '#E0E6ED',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#FF4D4D',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'Rajdhani, sans-serif'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: '380px',
            maxHeight: '500px',
            background: '#1E2229',
            border: '1px solid #2A2F38',
            borderRadius: '4px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            zIndex: 10000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #2A2F38',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: '#E0E6ED',
                fontSize: '18px',
                fontWeight: 700,
                margin: 0
              }}
            >
              Bildirimler
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FF4D4D',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    padding: '4px 8px'
                  }}
                >
                  Tümünü okundu işaretle
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E0E6ED',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div
            style={{
              overflowY: 'auto',
              maxHeight: '400px'
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: '#8B8E94',
                  fontFamily: 'Rajdhani, sans-serif'
                }}
              >
                Bildirim yok
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #2A2F38',
                    cursor: 'pointer',
                    background: notification.read ? 'transparent' : 'rgba(255, 77, 77, 0.05)',
                    transition: 'background 0.2s',
                    ':hover': {
                      background: 'rgba(255, 77, 77, 0.1)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(255, 77, 77, 0.05)';
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        fontSize: '24px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: notification.read ? 500 : 700,
                          color: '#E0E6ED',
                          fontSize: '14px',
                          marginBottom: '4px'
                        }}
                      >
                        {notification.title}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Rajdhani, sans-serif',
                          color: '#8B8E94',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        {notification.message}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Rajdhani, sans-serif',
                          color: '#6B7280',
                          fontSize: '11px'
                        }}
                      >
                        {formatTime(notification.created_at)}
                      </div>
                    </div>
                    {!notification.read && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#FF4D4D',
                          marginTop: '8px'
                        }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

