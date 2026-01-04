import React, { useState } from 'react';
import { RadioTower, LayoutDashboard, Users, LogOut, Menu, X, Radio, BookOpen, Sun, Moon } from 'lucide-react';
import { IoBriefcaseOutline } from "react-icons/io5";
import { GiBeastEye } from "react-icons/gi";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = ({ currentPage, setCurrentPage, onNotificationClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isAdmin = user?.role === '3' || user?.role === '4';
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: IoBriefcaseOutline },
    { id: 'falcon-eye', label: 'Falcon Eye', icon: GiBeastEye },
    ...(isAdmin ? [{ id: 'playbooks', label: 'Playbooks', icon: BookOpen }] : []),
    ...(user?.role === '4' ? [{ id: 'users', label: 'User Management', icon: Users }] : [])
  ];

  return (
    <>
      {/* Sidebar - Always Collapsed (80px) */}
      <div 
        style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          width: '80px',
          height: '100vh',
          background: isDark ? '#1E2229' : '#F8F9FA',
          borderRight: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}
      >
        {/* Logo */}
        <div 
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 0',
            borderBottom: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`
          }}
        >
          <RadioTower size={32} color="#FF4D4D" />
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, paddingTop: '16px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <div 
                key={item.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => setCurrentPage(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 0',
                    background: isActive ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                    borderLeft: isActive ? '4px solid #FF4D4D' : '4px solid transparent',
                    color: isActive ? '#FF4D4D' : (isDark ? '#E0E6ED' : '#4A5568'),
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={22} />
                </button>

                {/* Tooltip */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '85px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: isDark ? '#1E2229' : '#FFFFFF',
                      border: '1px solid #FF4D4D',
                      borderRadius: '2px',
                      padding: '8px 16px',
                      whiteSpace: 'nowrap',
                      color: isDark ? '#E0E6ED' : '#1A1F2E',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      zIndex: 1001,
                      pointerEvents: 'none',
                      boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Info & Logout - Bottom */}
        <div 
          style={{ 
            borderTop: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
            background: isDark ? '#1E2229' : '#F8F9FA',
            padding: '16px 0'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {/* User Avatar */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 77, 77, 0.1)',
                border: '2px solid #FF4D4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF4D4D',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'default'
              }}
              title={user?.username}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              style={{ 
                color: '#FF4D4D', 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: '80px',
          right: 0,
          height: '72px',
          background: isDark ? '#0F1115' : '#FFFFFF',
          borderBottom: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <h2 
          style={{ 
            fontFamily: 'Rajdhani, sans-serif',
            color: isDark ? '#E0E6ED' : '#1A1F2E',
            fontSize: '22px',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease'
          }}
        >
          {menuItems.find(item => item.id === currentPage)?.label.toUpperCase()}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: isDark ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 77, 77, 0.08)',
              border: `1px solid ${isDark ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255, 77, 77, 0.15)'}`,
              borderRadius: '8px',
              color: '#FF4D4D',
              cursor: 'pointer',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '40px',
              height: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 77, 77, 0.12)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDark ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 77, 77, 0.08)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={isDark ? 'Light Mode\'a Geç' : 'Dark Mode\'a Geç'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <NotificationBell onNotificationClick={onNotificationClick} />
        </div>
      </div>
    </>
  );
};

export default Navbar;