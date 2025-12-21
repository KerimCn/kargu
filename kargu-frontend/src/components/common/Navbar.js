import React, { useState } from 'react';
import { RadioTower, LayoutDashboard, Users, LogOut, Menu, X, Radio } from 'lucide-react';
import { IoBriefcaseOutline } from "react-icons/io5";
import { GiBeastEye } from "react-icons/gi";
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: IoBriefcaseOutline },
    { id: 'falcon-eye', label: 'Falcon Eye', icon: GiBeastEye },
   ...(user?.role === '4' ? [{ id: 'users', label: 'User Management', icon: Users }] : [])
  ];
  return (
    <>
      {/* Sidebar */}
      <div 
        className="fixed left-0 top-0 h-full transition-all duration-300"
        style={{ 
          width: isCollapsed ? '80px' : '280px',
          background: '#1E2229',
          borderRight: '1px solid #2A2F38',
          zIndex: 1000,
          height: '100%'
        }}
      >
        {/* Logo & Toggle */}
        <div 
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #2A2F38' }}
        >
          {!isCollapsed && (
            <div className="flex items-center">
              <RadioTower size={32} color="#FF4D4D" />
              <h1 
                className="text-2xl font-bold" 
                style={{ 
                  marginLeft: '12px', 
                  fontFamily: 'Rajdhani, sans-serif',
                  color: '#E0E6ED'
                }}
              >
                KARGU
              </h1>
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center w-full" style={{
                'padding-bottom':'35px'
            }}>
              <RadioTower size={32} color="#FF4D4D" style={{top:'100px'}}/>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
            style={{ 
              color: '#E0E6ED', 
              background: 'transparent',
              position: isCollapsed ? 'absolute' : 'relative',
              right: isCollapsed ? '16px' : '0',
              'margin-top': isCollapsed ?'45px': '0',
              'margin-right':  isCollapsed ?'6px' : '0'
            }}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="w-full flex items-center px-6 py-4 transition-all"
                style={{
                  background: isActive ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid #FF4D4D' : '4px solid transparent',
                  color: isActive ? '#FF4D4D' : '#E0E6ED',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  letterSpacing: '0.5px'
                }}
              >
                <Icon size={22} />
                {!isCollapsed && (
                  <span style={{ marginLeft: '16px' }}>{item.label.toUpperCase()}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            borderTop: '1px solid #2A2F38',
            background: '#1E2229'
          }}
        >
          {!isCollapsed && (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div 
                    className="text-sm font-semibold mb-1"
                    style={{ color: '#E0E6ED' }}
                  >
                    {user?.full_name || user?.username}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: '#6B7280' }}
                  >
                    {user?.role?.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2"
                  style={{ 
                    color: '#FF4D4D', 
                    background: 'transparent',
                    transition: 'transform 0.2s'
                  }}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="p-4 flex justify-center">
              <button
                onClick={logout}
                className="p-2"
                style={{ color: '#FF4D4D', background: 'transparent' }}
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Bar (Mobile/Additional Info) */}
      <div 
        className="fixed top-0 right-0 transition-all duration-300"
        style={{ 
          left: isCollapsed ? '80px' : '280px',
          height: '55px',
          background: 'rgb(30, 34, 41)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
          width: '100%'
        }}
      >
        <h2 
          className="text-xl font-bold"
          style={{ 
            fontFamily: 'Rajdhani, sans-serif',
            color: '#E0E6ED'
          }}
        >
          {menuItems.find(item => item.id === currentPage)?.label.toUpperCase()}
        </h2>
      </div>
    </>
  );
};

export default Navbar;