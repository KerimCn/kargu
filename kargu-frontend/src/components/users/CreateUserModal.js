import React, { useState } from 'react';
import Modal from '../common/Modal';

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: '1'
  });

  const handleSubmit = () => {
    if (!form.username || !form.email || !form.password) {
      alert('Please fill in all required fields');
      return;
    }
    onCreate(form);
    setForm({ username: '', email: '', password: '', full_name: '', role: '1' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ADD NEW USER">
      <div>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Username *</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input-field"
            placeholder="Enter username"
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
          <label className="block mb-2 text-sm">Password *</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="Enter password"
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
            <option value="1">Viewer</option>
            <option value="2">Investigator</option>
            <option value="3">Incident Responder</option>
            <option value="4">Admin</option>
          </select>
        </div>
        
        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full py-3"
        >
          ADD USER
        </button>
      </div>
    </Modal>
  );
};

export default CreateUserModal;