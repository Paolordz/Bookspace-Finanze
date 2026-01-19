import React, { useState, useMemo } from 'react';
import {
  Activity,
  Clock,
  Filter,
  DollarSign,
  Users,
  Building,
  UserPlus,
  Target,
  FileText,
  Calendar,
  Settings,
  LogIn,
  LogOut,
  RefreshCw,
  Download,
  Upload,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { ACTIVITY_TYPES, ACTIVITY_LABELS } from '../hooks/useActivityLog';

/**
 * Obtener icono según el tipo de actividad
 */
const getActivityIcon = (type) => {
  if (type?.includes('transaction')) return DollarSign;
  if (type?.includes('client')) return Users;
  if (type?.includes('provider')) return Building;
  if (type?.includes('employee')) return UserPlus;
  if (type?.includes('lead')) return Target;
  if (type?.includes('invoice')) return FileText;
  if (type?.includes('meeting')) return Calendar;
  if (type?.includes('config')) return Settings;
  if (type === ACTIVITY_TYPES.USER_LOGIN) return LogIn;
  if (type === ACTIVITY_TYPES.USER_LOGOUT) return LogOut;
  if (type === ACTIVITY_TYPES.DATA_SYNC) return RefreshCw;
  if (type === ACTIVITY_TYPES.DATA_EXPORT) return Download;
  if (type === ACTIVITY_TYPES.DATA_IMPORT) return Upload;
  return Activity;
};

/**
 * Obtener color según el tipo de acción
 */
const getActivityColor = (type) => {
  if (type?.includes('create')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (type?.includes('update') || type?.includes('status_change')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (type?.includes('delete')) return 'bg-red-100 text-red-700 border-red-200';
  if (type === ACTIVITY_TYPES.USER_LOGIN) return 'bg-green-100 text-green-700 border-green-200';
  if (type === ACTIVITY_TYPES.USER_LOGOUT) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (type === ACTIVITY_TYPES.DATA_SYNC) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
  return 'bg-violet-100 text-violet-700 border-violet-200';
};

/**
 * Formatear timestamp relativo
 */
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;

  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Formatear timestamp completo
 */
const formatFullTime = (timestamp) => {
  if (!timestamp) return '';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date.toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Categorías disponibles para filtrar
 */
const FILTER_CATEGORIES = [
  { id: 'all', label: 'Todas', icon: Activity },
  { id: 'transactions', label: 'Transacciones', icon: DollarSign },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'invoices', label: 'Facturas', icon: FileText },
  { id: 'system', label: 'Sistema', icon: Settings }
];

/**
 * Componente individual de actividad
 */
const ActivityItem = ({ activity, isCompact = false }) => {
  const Icon = getActivityIcon(activity.type);
  const colorClass = getActivityColor(activity.type);

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded-lg transition-colors">
        <div className={`p-1.5 rounded-lg border ${colorClass}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700 truncate">
            {activity.description || ACTIVITY_LABELS[activity.type]}
          </p>
          {activity.entityName && (
            <p className="text-xs text-slate-500 truncate">{activity.entityName}</p>
          )}
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {formatRelativeTime(activity.timestamp || activity.createdAt)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
      <div className={`p-2.5 rounded-xl border ${colorClass} h-fit`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800">
          {activity.description || ACTIVITY_LABELS[activity.type]}
        </p>
        {activity.entityName && (
          <p className="text-sm text-slate-600 mt-0.5">{activity.entityName}</p>
        )}
        {activity.details && (
          <div className="mt-2 flex flex-wrap gap-2">
            {activity.details.monto && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                ${activity.details.monto.toLocaleString('es-MX')}
              </span>
            )}
            {activity.details.estado && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                {activity.details.estado}
              </span>
            )}
            {activity.details.categoria && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                {activity.details.categoria}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Clock size={12} className="text-slate-400" />
          <span className="text-xs text-slate-400" title={formatFullTime(activity.timestamp || activity.createdAt)}>
            {formatRelativeTime(activity.timestamp || activity.createdAt)}
          </span>
          {activity.isLocal && (
            <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
              Local
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal de bitácora de actividad
 */
export const ActivityLog = ({
  activities = [],
  loading = false,
  isCompact = false,
  showFilter = true,
  showSearch = true,
  maxItems = 50,
  title = 'Bitácora de Actividad',
  emptyMessage = 'No hay actividades registradas'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Filtrar actividades
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      const categoryTypes = {
        transactions: [ACTIVITY_TYPES.TRANSACTION_CREATE, ACTIVITY_TYPES.TRANSACTION_UPDATE, ACTIVITY_TYPES.TRANSACTION_DELETE],
        clients: [ACTIVITY_TYPES.CLIENT_CREATE, ACTIVITY_TYPES.CLIENT_UPDATE, ACTIVITY_TYPES.CLIENT_DELETE],
        providers: [ACTIVITY_TYPES.PROVIDER_CREATE, ACTIVITY_TYPES.PROVIDER_UPDATE, ACTIVITY_TYPES.PROVIDER_DELETE],
        employees: [ACTIVITY_TYPES.EMPLOYEE_CREATE, ACTIVITY_TYPES.EMPLOYEE_UPDATE, ACTIVITY_TYPES.EMPLOYEE_DELETE],
        leads: [ACTIVITY_TYPES.LEAD_CREATE, ACTIVITY_TYPES.LEAD_UPDATE, ACTIVITY_TYPES.LEAD_DELETE, ACTIVITY_TYPES.LEAD_STATUS_CHANGE],
        invoices: [ACTIVITY_TYPES.INVOICE_CREATE, ACTIVITY_TYPES.INVOICE_UPDATE, ACTIVITY_TYPES.INVOICE_DELETE, ACTIVITY_TYPES.INVOICE_STATUS_CHANGE],
        meetings: [ACTIVITY_TYPES.MEETING_CREATE, ACTIVITY_TYPES.MEETING_UPDATE, ACTIVITY_TYPES.MEETING_DELETE],
        system: [ACTIVITY_TYPES.USER_LOGIN, ACTIVITY_TYPES.USER_LOGOUT, ACTIVITY_TYPES.DATA_SYNC, ACTIVITY_TYPES.DATA_EXPORT, ACTIVITY_TYPES.DATA_IMPORT, ACTIVITY_TYPES.CONFIG_UPDATE]
      };

      const types = categoryTypes[selectedCategory] || [];
      filtered = filtered.filter(a => types.includes(a.type));
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.description?.toLowerCase().includes(term) ||
        a.entityName?.toLowerCase().includes(term) ||
        ACTIVITY_LABELS[a.type]?.toLowerCase().includes(term)
      );
    }

    return filtered.slice(0, maxItems);
  }, [activities, selectedCategory, searchTerm, maxItems]);

  // Agrupar por fecha
  const groupedActivities = useMemo(() => {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    filteredActivities.forEach(activity => {
      const date = activity.timestamp?.toDate
        ? activity.timestamp.toDate()
        : new Date(activity.timestamp || activity.createdAt);

      const dateStr = date.toDateString();
      let label;

      if (dateStr === today) {
        label = 'Hoy';
      } else if (dateStr === yesterday) {
        label = 'Ayer';
      } else {
        label = date.toLocaleDateString('es-MX', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(activity);
    });

    return groups;
  }, [filteredActivities]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="text-violet-600" size={20} />
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {filteredActivities.length}
            </span>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        {showFilter && (
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.slice(0, showAllFilters ? undefined : 4).map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-violet-100 text-violet-700 border-violet-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
            {FILTER_CATEGORIES.length > 4 && (
              <button
                onClick={() => setShowAllFilters(!showAllFilters)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <ChevronDown size={14} className={showAllFilters ? 'rotate-180' : ''} />
                {showAllFilters ? 'Menos' : 'Más'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className={`overflow-y-auto ${isCompact ? 'max-h-80' : 'max-h-[500px]'}`}>
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500">{emptyMessage}</p>
          </div>
        ) : isCompact ? (
          <div className="divide-y divide-slate-100">
            {filteredActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} isCompact />
            ))}
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date} className="mb-4">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-4 py-2 -mx-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {date}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Widget compacto para sidebar o dashboard
 */
export const ActivityWidget = ({
  activities = [],
  loading = false,
  maxItems = 5,
  onViewAll
}) => {
  const recentActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="text-violet-600" size={18} />
          <h4 className="font-semibold text-slate-800">Actividad Reciente</h4>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-violet-600 hover:text-violet-700 font-medium"
          >
            Ver todo
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recentActivities.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          Sin actividad reciente
        </p>
      ) : (
        <div className="space-y-1">
          {recentActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} isCompact />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
