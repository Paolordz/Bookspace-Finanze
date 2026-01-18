import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Componente de notificación
 * @param {string} text - Texto de la notificación
 * @param {string} type - Tipo (success, error)
 */
const Notification = ({ text, type = 'success' }) => {
  if (!text) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-[#2a1d89] text-white'
      }`}
    >
      {type === 'error' ? (
        <AlertTriangle className="w-5 h-5" />
      ) : (
        <CheckCircle className="w-5 h-5" />
      )}
      <span className="font-medium">{text}</span>
    </div>
  );
};

export default Notification;
