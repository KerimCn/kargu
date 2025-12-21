import React, { useState } from 'react';
import Modal from '../common/Modal';

const CreateCaseModal = ({ isOpen, onClose, onCreate, users }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'medium',
    assigned_to: ''
  });

  const handleSubmit = () => {
    if (!form.title) {
      alert('Please enter a title');
      return;
    }
    onCreate(form);
    setForm({ title: '', description: '', severity: 'medium', assigned_to: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CREATE NEW CASE">
      <div>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder="Enter case title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows="3"
            placeholder="Describe the incident"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm">Severity</label>
          <select
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm">Assign To</label>
          <select
            value={form.assigned_to}
            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            className="input-field"
          >
            <option value="">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.username}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full py-3"
        >
          CREATE CASE
        </button>
      </div>
    </Modal>
  );
};

export default CreateCaseModal;