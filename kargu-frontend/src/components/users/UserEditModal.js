import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!form.username || !form.email) {
      alert('Please fill in all required fields');
      return;
    }

    onUpdate(user.id, form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="EDIT USER">
      <div>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Username *</label>
          <input
            type="text"
            value={form.username}
            disabled
            className="input-field opacity-60 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="user@example.com"
          />
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

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full py-3"
        >
          SAVE CHANGES
        </button>
      </div>
    </Modal>
  );
};

export default UserEditModal;
