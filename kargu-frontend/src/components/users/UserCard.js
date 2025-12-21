import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import UserEditModal from './UserEditModal';

const UserCard = ({ userData, onDelete, onUpdate }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <tr className="table-row">
        <td className="table-cell font-bold">
          <span style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {userData.full_name || userData.username}
          </span>
        </td>

        <td className="table-cell text-muted">
          @{userData.username}
        </td>

        <td className="table-cell text-dim">
          {userData.email}
        </td>

        <td className="table-cell">
          <span className={`badge badge-${userData.role}`}>
            {userData.role?.toUpperCase()}
          </span>
        </td>

        <td className="table-cell">
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2"
            style={{ color: '#E0E6ED', background: 'transparent' }}
            title="Edit User"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(userData.id)}
            className="p-2"
            style={{ color: '#FF4D4D', background: 'transparent' }}
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>

      <UserEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={userData}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default UserCard;
