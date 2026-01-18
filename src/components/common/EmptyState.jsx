import React from 'react';

/**
 * Estado vacío mejorado
 * @param {Component} icon - Icono de lucide-react
 * @param {string} title - Título
 * @param {string} description - Descripción
 * @param {ReactNode} action - Acción (botón)
 */
const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-16">
      {Icon && <Icon className="w-16 h-16 mx-auto text-[#b7bac3] mb-4" />}
      <p className="text-[#2a1d89] font-semibold text-lg mb-2">{title}</p>
      {description && <p className="text-[#b7bac3] text-sm mb-4 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
