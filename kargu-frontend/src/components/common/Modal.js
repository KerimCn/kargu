import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const sizeStyles = {
    small: { width: '400px' },
    medium: { width: '600px', maxWidth: '90vw' },
    large: { width: '900px', maxWidth: '95vw' }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{ 
        background: 'rgba(0,0,0,0.8)',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="card" 
        style={sizeStyles[size]}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h3 
              className="text-2xl font-bold" 
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {title}
            </h3>
            <button 
              onClick={onClose} 
              style={{ color: '#FF4D4D', background: 'transparent' }}
            >
              <X size={24} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;