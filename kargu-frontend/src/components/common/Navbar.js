import React, { useState } from 'react';
import { RadioTower, LayoutDashboard, Users, LogOut, Menu, X, Radio, BookOpen } from 'lucide-react';
import { IoBriefcaseOutline } from "react-icons/io5";
import { GiBeastEye } from "react-icons/gi";
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = ({ currentPage, setCurrentPage, onNotificationClick }) => {
  const { user, logout } = useAuth();
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
          background: '#1E2229',
          borderRight: '1px solid #2A2F38',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <div 
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 0',
            borderBottom: '1px solid #2A2F38'
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
                    color: isActive ? '#FF4D4D' : '#E0E6ED',
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
                      background: '#1E2229',
                      border: '1px solid #FF4D4D',
                      borderRadius: '2px',
                      padding: '8px 16px',
                      whiteSpace: 'nowrap',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
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
          height: '64px',
          background: '#0F1115',
          borderBottom: '1px solid #2A2F38',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}
      >
        <h2 
          style={{ 
            fontFamily: 'Rajdhani, sans-serif',
            color: '#E0E6ED',
            fontSize: '20px',
            fontWeight: 700,
            margin: 0
          }}
        >
          {menuItems.find(item => item.id === currentPage)?.label.toUpperCase()}
        </h2>
        <NotificationBell onNotificationClick={onNotificationClick} />
      </div>
    </>
  );
};

export default Navbar;