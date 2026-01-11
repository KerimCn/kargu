import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { isDark } = useTheme();
  const [form, setForm] = useState({
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate password if provided
    if (form.password) {
      if (form.password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
        return;
      }
      if (form.password !== form.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return;
      }
    }

    // Check if there are any changes
    if (form.full_name === user.full_name && !form.password) {
      setMessage({ type: 'info', text: 'No changes detected' });
      return;
    }

    setLoading(true);
    try {
      const updates = {};
      if (form.full_name !== user.full_name) {
        updates.full_name = form.full_name;
      }
      if (form.password) {
        updates.password = form.password;
      }

      const updatedUser = await userAPI.updateProfile(updates);
      
      // Update local user state
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      // Clear password fields
      setForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: isDark ? '#1E2229' : '#FFFFFF',
          borderRadius: '8px',
          padding: '32px',
          border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
          boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: isDark ? '#E0E6ED' : '#1A1F2E',
            marginBottom: '8px'
          }}
        >
          SETTINGS
        </h2>
        <p
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px',
            color: isDark ? '#94A3B8' : '#64748B',
            marginBottom: '32px'
          }}
        >
          Update your profile information
        </p>

        {/* Message */}
        {message.text && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '4px',
              marginBottom: '24px',
              background:
                message.type === 'success'
                  ? 'rgba(34, 197, 94, 0.1)'
                  : message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${
                message.type === 'success'
                  ? 'rgba(34, 197, 94, 0.3)'
                  : message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(59, 130, 246, 0.3)'
              }`,
              color:
                message.type === 'success'
                  ? '#22C55E'
                  : message.type === 'error'
                  ? '#EF4444'
                  : '#3B82F6',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username (read-only) */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                marginBottom: '8px'
              }}
            >
              USERNAME
            </label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
                background: isDark ? '#0F1115' : '#F8F9FA',
                color: isDark ? '#94A3B8' : '#64748B',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                cursor: 'not-allowed'
              }}
            />
            <p
              style={{
                marginTop: '4px',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px',
                color: isDark ? '#64748B' : '#94A3B8'
              }}
            >
              Username cannot be changed
            </p>
          </div>

          {/* Email (read-only) */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                marginBottom: '8px'
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
                background: isDark ? '#0F1115' : '#F8F9FA',
                color: isDark ? '#94A3B8' : '#64748B',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                cursor: 'not-allowed'
              }}
            />
            <p
              style={{
                marginTop: '4px',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px',
                color: isDark ? '#64748B' : '#94A3B8'
              }}
            >
              Email cannot be changed
            </p>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                marginBottom: '8px'
              }}
            >
              FULL NAME
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
                background: isDark ? '#1E2229' : '#FFFFFF',
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF4D4D';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                marginBottom: '8px'
              }}
            >
              NEW PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave empty to keep current password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
                background: isDark ? '#1E2229' : '#FFFFFF',
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF4D4D';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
              }}
            />
          </div>

          {/* Confirm Password */}
          {form.password && (
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isDark ? '#E0E6ED' : '#1A1F2E',
                  marginBottom: '8px'
                }}
              >
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
                  background: isDark ? '#1E2229' : '#FFFFFF',
                  color: isDark ? '#E0E6ED' : '#1A1F2E',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF4D4D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
                }}
              />
            </div>
          )}

          {/* Role (read-only) */}
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: isDark ? '#E0E6ED' : '#1A1F2E',
                marginBottom: '8px'
              }}
            >
              ROLE
            </label>
            <input
              type="text"
              value={
                user?.role === '0'
                  ? 'Viewer'
                  : user?.role === '1'
                  ? 'Investigator'
                  : user?.role === '2'
                  ? 'Incident Responder'
                  : user?.role === '3'
                  ? 'Admin'
                  : user?.role === '4'
                  ? 'Admin'
                  : 'Unknown'
              }
              disabled
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
                background: isDark ? '#0F1115' : '#F8F9FA',
                color: isDark ? '#94A3B8' : '#64748B',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                cursor: 'not-allowed'
              }}
            />
            <p
              style={{
                marginTop: '4px',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px',
                color: isDark ? '#64748B' : '#94A3B8'
              }}
            >
              Role cannot be changed
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              background: loading ? '#94A3B8' : '#FF4D4D',
              color: '#FFFFFF',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#E63946';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#FF4D4D';
              }
            }}
          >
            {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
