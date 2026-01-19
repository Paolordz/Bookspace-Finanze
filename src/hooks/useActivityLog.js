import { useState, useEffect, useCallback, useRef } from 'react';
import {
  logActivityToCloud,
  getActivitiesFromCloud,
  subscribeToActivities,
  createLocalActivityEntry,
  ACTIVITY_TYPES,
  ACTIVITY_LABELS
} from '../firebase/activityLog';
import { isFirebaseConfigured } from '../firebase';

// Clave para almacenamiento local
const ACTIVITY_STORAGE_KEY = 'bs12-activity-log';
const MAX_LOCAL_ACTIVITIES = 100;

/**
 * Hook para manejar la bitácora de actividad
 */
export const useActivityLog = (userId) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSubscribedRef = useRef(false);

  // Verificar si Firebase está configurado
  const isEnabled = isFirebaseConfigured() && !!userId;

  // Cargar actividades locales
  const loadLocalActivities = useCallback(async () => {
    try {
      const result = await window.storage?.get(ACTIVITY_STORAGE_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
    } catch (e) {
      console.error('Error cargando actividades locales:', e);
    }
    return [];
  }, []);

  // Guardar actividades locales
  const saveLocalActivities = useCallback(async (newActivities) => {
    try {
      // Mantener solo las últimas MAX_LOCAL_ACTIVITIES actividades
      const trimmed = newActivities.slice(0, MAX_LOCAL_ACTIVITIES);
      await window.storage?.set(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Error guardando actividades locales:', e);
    }
  }, []);

  // Registrar una nueva actividad
  const logActivity = useCallback(async (type, data = {}) => {
    const activityEntry = createLocalActivityEntry(type, data);

    // Agregar a la lista local inmediatamente
    setActivities((prev) => {
      const updated = [activityEntry, ...prev].slice(0, MAX_LOCAL_ACTIVITIES);
      saveLocalActivities(updated);
      return updated;
    });

    // Si está habilitado Firebase, guardar en la nube
    if (isEnabled) {
      try {
        await logActivityToCloud(userId, {
          type,
          description: data.description || ACTIVITY_LABELS[type],
          details: data.details,
          entityType: data.entityType,
          entityId: data.entityId,
          entityName: data.entityName,
          metadata: data.metadata
        });
      } catch (e) {
        console.error('Error guardando actividad en la nube:', e);
      }
    }

    return activityEntry;
  }, [userId, isEnabled, saveLocalActivities]);

  // Funciones helper para cada tipo de actividad
  const logTransaction = useCallback((action, transaction) => {
    const typeMap = {
      create: ACTIVITY_TYPES.TRANSACTION_CREATE,
      update: ACTIVITY_TYPES.TRANSACTION_UPDATE,
      delete: ACTIVITY_TYPES.TRANSACTION_DELETE
    };

    return logActivity(typeMap[action] || ACTIVITY_TYPES.TRANSACTION_UPDATE, {
      entityType: 'transaction',
      entityId: transaction.id,
      entityName: transaction.concepto || 'Transacción',
      details: {
        tipo: transaction.tipo,
        monto: transaction.monto,
        categoria: transaction.cat
      }
    });
  }, [logActivity]);

  const logClient = useCallback((action, client) => {
    const typeMap = {
      create: ACTIVITY_TYPES.CLIENT_CREATE,
      update: ACTIVITY_TYPES.CLIENT_UPDATE,
      delete: ACTIVITY_TYPES.CLIENT_DELETE
    };

    return logActivity(typeMap[action] || ACTIVITY_TYPES.CLIENT_UPDATE, {
      entityType: 'client',
      entityId: client.id,
      entityName: client.nombre || 'Cliente'
    });
  }, [logActivity]);

  const logProvider = useCallback((action, provider) => {
    const typeMap = {
      create: ACTIVITY_TYPES.PROVIDER_CREATE,
      update: ACTIVITY_TYPES.PROVIDER_UPDATE,
      delete: ACTIVITY_TYPES.PROVIDER_DELETE
    };

    return logActivity(typeMap[action] || ACTIVITY_TYPES.PROVIDER_UPDATE, {
      entityType: 'provider',
      entityId: provider.id,
      entityName: provider.nombre || 'Proveedor'
    });
  }, [logActivity]);

  const logEmployee = useCallback((action, employee) => {
    const typeMap = {
      create: ACTIVITY_TYPES.EMPLOYEE_CREATE,
      update: ACTIVITY_TYPES.EMPLOYEE_UPDATE,
      delete: ACTIVITY_TYPES.EMPLOYEE_DELETE
    };

    return logActivity(typeMap[action] || ACTIVITY_TYPES.EMPLOYEE_UPDATE, {
      entityType: 'employee',
      entityId: employee.id,
      entityName: employee.nombre || 'Empleado'
    });
  }, [logActivity]);

  const logLead = useCallback((action, lead, oldStatus = null) => {
    let type;
    if (action === 'status_change') {
      type = ACTIVITY_TYPES.LEAD_STATUS_CHANGE;
    } else {
      const typeMap = {
        create: ACTIVITY_TYPES.LEAD_CREATE,
        update: ACTIVITY_TYPES.LEAD_UPDATE,
        delete: ACTIVITY_TYPES.LEAD_DELETE
      };
      type = typeMap[action] || ACTIVITY_TYPES.LEAD_UPDATE;
    }

    return logActivity(type, {
      entityType: 'lead',
      entityId: lead.id,
      entityName: lead.nombre || lead.venue || 'Lead',
      details: {
        estado: lead.estado,
        oldStatus,
        fuente: lead.fuente
      }
    });
  }, [logActivity]);

  const logInvoice = useCallback((action, invoice, oldStatus = null) => {
    let type;
    if (action === 'status_change') {
      type = ACTIVITY_TYPES.INVOICE_STATUS_CHANGE;
    } else {
      const typeMap = {
        create: ACTIVITY_TYPES.INVOICE_CREATE,
        update: ACTIVITY_TYPES.INVOICE_UPDATE,
        delete: ACTIVITY_TYPES.INVOICE_DELETE
      };
      type = typeMap[action] || ACTIVITY_TYPES.INVOICE_UPDATE;
    }

    return logActivity(type, {
      entityType: 'invoice',
      entityId: invoice.id,
      entityName: invoice.numero || `Factura ${invoice.id?.slice(0, 8)}`,
      details: {
        estado: invoice.estado,
        oldStatus,
        total: invoice.total
      }
    });
  }, [logActivity]);

  const logMeeting = useCallback((action, meeting) => {
    const typeMap = {
      create: ACTIVITY_TYPES.MEETING_CREATE,
      update: ACTIVITY_TYPES.MEETING_UPDATE,
      delete: ACTIVITY_TYPES.MEETING_DELETE
    };

    return logActivity(typeMap[action] || ACTIVITY_TYPES.MEETING_UPDATE, {
      entityType: 'meeting',
      entityId: meeting.id,
      entityName: meeting.titulo || 'Junta',
      details: {
        fecha: meeting.fecha,
        hora: meeting.hora
      }
    });
  }, [logActivity]);

  const logConfig = useCallback((config) => {
    return logActivity(ACTIVITY_TYPES.CONFIG_UPDATE, {
      entityType: 'config',
      entityName: config.empresa || 'Configuración'
    });
  }, [logActivity]);

  const logUserLogin = useCallback((userEmail) => {
    return logActivity(ACTIVITY_TYPES.USER_LOGIN, {
      entityType: 'user',
      entityName: userEmail,
      description: `Inicio de sesión: ${userEmail}`
    });
  }, [logActivity]);

  const logUserLogout = useCallback((userEmail) => {
    return logActivity(ACTIVITY_TYPES.USER_LOGOUT, {
      entityType: 'user',
      entityName: userEmail,
      description: `Cierre de sesión: ${userEmail}`
    });
  }, [logActivity]);

  const logDataSync = useCallback(() => {
    return logActivity(ACTIVITY_TYPES.DATA_SYNC, {
      description: 'Datos sincronizados con la nube'
    });
  }, [logActivity]);

  const logDataExport = useCallback(() => {
    return logActivity(ACTIVITY_TYPES.DATA_EXPORT, {
      description: 'Datos exportados a archivo JSON'
    });
  }, [logActivity]);

  const logDataImport = useCallback(() => {
    return logActivity(ACTIVITY_TYPES.DATA_IMPORT, {
      description: 'Datos importados desde archivo JSON'
    });
  }, [logActivity]);

  // Cargar actividades al montar
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        // Primero cargar actividades locales
        const localActivities = await loadLocalActivities();

        if (isEnabled) {
          // Si hay conexión, obtener de la nube
          const result = await getActivitiesFromCloud(userId, { limitCount: MAX_LOCAL_ACTIVITIES });
          if (result.success && result.data.length > 0) {
            // Combinar actividades locales no sincronizadas con las de la nube
            const localOnly = localActivities.filter(a => a.isLocal);
            const combined = [...localOnly, ...result.data].slice(0, MAX_LOCAL_ACTIVITIES);
            setActivities(combined);
          } else {
            setActivities(localActivities);
          }
        } else {
          setActivities(localActivities);
        }
      } catch (e) {
        console.error('Error cargando actividades:', e);
        setError(e.message);
        // Usar actividades locales como fallback
        const localActivities = await loadLocalActivities();
        setActivities(localActivities);
      }

      setLoading(false);
    };

    loadActivities();
  }, [userId, isEnabled, loadLocalActivities]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!isEnabled || isSubscribedRef.current) return;

    isSubscribedRef.current = true;

    const unsubscribe = subscribeToActivities(userId, (cloudActivities) => {
      setActivities(prev => {
        // Mantener actividades locales no sincronizadas
        const localOnly = prev.filter(a => a.isLocal);
        const combined = [...localOnly, ...cloudActivities].slice(0, MAX_LOCAL_ACTIVITIES);
        return combined;
      });
    }, MAX_LOCAL_ACTIVITIES);

    return () => {
      unsubscribe();
      isSubscribedRef.current = false;
    };
  }, [userId, isEnabled]);

  // Filtrar actividades por tipo
  const filterByType = useCallback((type) => {
    return activities.filter(a => a.type === type);
  }, [activities]);

  // Filtrar actividades por categoría
  const filterByCategory = useCallback((category) => {
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

    const types = categoryTypes[category] || [];
    return activities.filter(a => types.includes(a.type));
  }, [activities]);

  // Obtener actividades recientes (últimas 24 horas)
  const getRecentActivities = useCallback((hours = 24) => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    return activities.filter(a => {
      const activityDate = new Date(a.timestamp || a.createdAt);
      return activityDate >= cutoff;
    });
  }, [activities]);

  return {
    activities,
    loading,
    error,
    isEnabled,

    // Métodos generales
    logActivity,
    filterByType,
    filterByCategory,
    getRecentActivities,

    // Métodos específicos por entidad
    logTransaction,
    logClient,
    logProvider,
    logEmployee,
    logLead,
    logInvoice,
    logMeeting,
    logConfig,

    // Métodos de sistema
    logUserLogin,
    logUserLogout,
    logDataSync,
    logDataExport,
    logDataImport
  };
};

export { ACTIVITY_TYPES, ACTIVITY_LABELS };
