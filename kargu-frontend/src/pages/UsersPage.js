import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import CreateUserModal from '../components/users/CreateUserModal';
import EditUserModal from '../components/users/EditUserModal';
import { userAPI } from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      await userAPI.create(formData);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Username or email may already exist.');
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await userAPI.update(id, updatedData);
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userAPI.delete(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const filterUsers = () => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredUsers = filterUsers();

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-3xl font-bold" 
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          USER MANAGEMENT
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> ADD USER
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <div className="card">
          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6B7280'
              }} 
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2F38' }}>
                  <th 
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    USERNAME
                  </th>
                  <th 
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    FULL NAME
                  </th>
                  <th 
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    EMAIL
                  </th>
                  <th 
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    ROLE
                  </th>
                  <th 
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    CREATED AT
                  </th>
                  <th 
                    style={{ 
                      padding: '12px',
                      textAlign: 'center',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    style={{ 
                      borderBottom: '1px solid #2A2F38',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td 
                      style={{ 
                        padding: '12px',
                        color: '#E0E6ED',
                        fontSize: '13px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600
                      }}
                    >
                      @{user.username}
                    </td>
                    <td 
                      style={{ 
                        padding: '12px',
                        color: '#9CA3AF',
                        fontSize: '13px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {user.full_name || '-'}
                    </td>
                    <td 
                      style={{ 
                        padding: '12px',
                        color: '#9CA3AF',
                        fontSize: '13px',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {user.email}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge badge-${user.role}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td 
                      style={{ 
                        padding: '12px',
                        color: '#6B7280',
                        fontSize: '13px',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditClick(user)}
                          style={{ 
                            color: '#00C896', 
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{ 
                            color: '#FF4D4D', 
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted">
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateUser}
      />

      {selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UsersPage;