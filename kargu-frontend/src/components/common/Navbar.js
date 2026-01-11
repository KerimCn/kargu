import React, { useState } from 'react';
import { RadioTower, LayoutDashboard, Users, LogOut, Menu, X, Radio, BookOpen, Settings } from 'lucide-react';
import { IoBriefcaseOutline } from "react-icons/io5";
import { GiBeastEye } from "react-icons/gi";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = ({ currentPage, setCurrentPage, onNotificationClick }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isAdmin = user?.role === '3' || user?.role === '4';
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: IoBriefcaseOutline },
    { id: 'falcon-eye', label: 'Falcon Eye', icon: GiBeastEye },
    ...(isAdmin ? [{ id: 'playbooks', label: 'Playbooks', icon: BookOpen }] : []),
    ...(user?.role === '4' ? [{ id: 'users', label: 'User Management', icon: Users }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Sidebar - Always Collapsed (60px) */}
      <div 
        style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          width: '60px',
          height: '100vh',
          background: '#1E2229',
          borderRight: '1px solid #2A2F38',
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
            padding: '16px 0',
            borderBottom: '1px solid #2A2F38'
          }}
        >
          <RadioTower size={24} color="#FF4D4D" />
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, paddingTop: '12px' }}>
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
                    padding: '12px 0',
                    background: isActive ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid #FF4D4D' : '3px solid transparent',
                    color: isActive ? '#FF4D4D' : '#E0E6ED',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                </button>

                {/* Tooltip */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '65px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#1E2229',
                      border: '1px solid #FF4D4D',
                      borderRadius: '2px',
                      padding: '6px 12px',
                      whiteSpace: 'nowrap',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      zIndex: 1001,
                      pointerEvents: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
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
            borderTop: '1px solid #2A2F38',
            background: '#1E2229',
            padding: '12px 0'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {/* User Avatar */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 77, 77, 0.1)',
                border: '2px solid #FF4D4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF4D4D',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
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
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: '60px',
          right: 0,
          height: '57px',
          background: 'linear-gradient(135deg, #0F1115 0%, #1A1E24 100%)',
          borderBottom: '1px solid #2A2F38',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header Title Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {(() => {
            const currentMenuItem = menuItems.find(item => item.id === currentPage);
            const Icon = currentMenuItem?.icon;
            
            return (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 77, 77, 0.05)',
                  border: '1px solid rgba(255, 77, 77, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                {Icon && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(255, 77, 77, 0.1)',
                      color: '#FF4D4D',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                )}
                <div>
                  <h2 
                    style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      color: '#E0E6ED',
                      fontSize: '20px',
                      fontWeight: 700,
                      margin: 0,
                      letterSpacing: '0.5px',
                      lineHeight: '1.2',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {currentMenuItem?.label || 'Dashboard'}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#8B8E94',
                      fontSize: '12px',
                      margin: 0,
                      marginTop: '2px',
                      fontWeight: 400,
                      letterSpacing: '0.3px'
                    }}
                  >
                    {currentPage === 'dashboard' && 'Overview & Analytics'}
                    {currentPage === 'cases' && 'Case Management'}
                    {currentPage === 'falcon-eye' && 'Threat Intelligence'}
                    {currentPage === 'playbooks' && 'Automation & Workflows'}
                    {currentPage === 'users' && 'User Administration'}
                    {currentPage === 'settings' && 'Application Settings'}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
        
        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <NotificationBell onNotificationClick={onNotificationClick} />
        </div>
      </div>
    </>
  );
};

export default Navbar;