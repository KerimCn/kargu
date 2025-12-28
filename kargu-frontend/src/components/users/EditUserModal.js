import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const EditUserModal = ({ isOpen, onClose, onUpdate, user }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        password: '', // Şifre boş bırakılır
        full_name: user.full_name || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleSubmit = () => {
    // Sadece değişen alanları gönder
    const updates = {};
    
    if (form.email !== user.email) updates.email = form.email;
    if (form.full_name !== user.full_name) updates.full_name = form.full_name;
    if (form.role !== user.role) updates.role = form.role;
    if (form.password) updates.password = form.password; // Şifre girilmişse ekle

    if (Object.keys(updates).length === 0) {
      alert('No changes detected');
      return;
    }

    onUpdate(user.id, updates);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="EDIT USER">
      <div>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Username</label>
          <input
            type="text"
            value={form.username}
            disabled
            className="input-field"
            style={{ 
              opacity: 0.6, 
              cursor: 'not-allowed',
              background: '#0F1115'
            }}
            placeholder="Cannot change username"
          />
          <p className="text-xs text-dim mt-1">Username cannot be changed</p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="user@example.com"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm">New Password (optional)</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="Leave blank to keep current password"
          />
          <p className="text-xs text-dim mt-1">Leave blank if you don't want to change password</p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm">Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="input-field"
            placeholder="John Doe"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="input-field"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            UPDATE USER
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;