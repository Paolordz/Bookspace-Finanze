import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Tarjeta de estadística
 * @param {string} title - Título de la tarjeta
 * @param {string} value - Valor principal
 * @param {string} subtitle - Subtítulo opcional
 * @param {Component} icon - Icono de lucide-react
 * @param {string} color - Color del tema (primary, success, warning, danger)
 * @param {string} trend - Tendencia (up, down)
 */
const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'border-l-[#4f67eb]',
    success: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    danger: 'border-l-red-500'
  };

  const iconColors = {
    primary: 'text-[#4f67eb] bg-[#4f67eb]/10',
    success: 'text-emerald-600 bg-emerald-50',
    warning: 'text-amber-600 bg-amber-50',
    danger: 'text-red-600 bg-red-50'
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#b7bac3] text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-[#2a1d89] mt-1">{value}</p>
          {subtitle && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-[#b7bac3]'}`}>
              {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(StatCard);
