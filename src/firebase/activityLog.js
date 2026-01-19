import {
  doc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

/**
 * Tipos de actividad para la bitácora
 */
export const ACTIVITY_TYPES = {
  // Transacciones
  TRANSACTION_CREATE: 'transaction_create',
  TRANSACTION_UPDATE: 'transaction_update',
  TRANSACTION_DELETE: 'transaction_delete',

  // Clientes
  CLIENT_CREATE: 'client_create',
  CLIENT_UPDATE: 'client_update',
  CLIENT_DELETE: 'client_delete',

  // Proveedores
  PROVIDER_CREATE: 'provider_create',
  PROVIDER_UPDATE: 'provider_update',
  PROVIDER_DELETE: 'provider_delete',

  // Empleados
  EMPLOYEE_CREATE: 'employee_create',
  EMPLOYEE_UPDATE: 'employee_update',
  EMPLOYEE_DELETE: 'employee_delete',

  // Leads
  LEAD_CREATE: 'lead_create',
  LEAD_UPDATE: 'lead_update',
  LEAD_DELETE: 'lead_delete',
  LEAD_STATUS_CHANGE: 'lead_status_change',

  // Facturas
  INVOICE_CREATE: 'invoice_create',
  INVOICE_UPDATE: 'invoice_update',
  INVOICE_DELETE: 'invoice_delete',
  INVOICE_STATUS_CHANGE: 'invoice_status_change',

  // Juntas
  MEETING_CREATE: 'meeting_create',
  MEETING_UPDATE: 'meeting_update',
  MEETING_DELETE: 'meeting_delete',

  // Configuración
  CONFIG_UPDATE: 'config_update',

  // Sistema
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  DATA_SYNC: 'data_sync',
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import'
};

/**
 * Descripciones legibles de cada tipo de actividad
 */
export const ACTIVITY_LABELS = {
  [ACTIVITY_TYPES.TRANSACTION_CREATE]: 'Transacción creada',
  [ACTIVITY_TYPES.TRANSACTION_UPDATE]: 'Transacción actualizada',
  [ACTIVITY_TYPES.TRANSACTION_DELETE]: 'Transacción eliminada',

  [ACTIVITY_TYPES.CLIENT_CREATE]: 'Cliente agregado',
  [ACTIVITY_TYPES.CLIENT_UPDATE]: 'Cliente actualizado',
  [ACTIVITY_TYPES.CLIENT_DELETE]: 'Cliente eliminado',

  [ACTIVITY_TYPES.PROVIDER_CREATE]: 'Proveedor agregado',
  [ACTIVITY_TYPES.PROVIDER_UPDATE]: 'Proveedor actualizado',
  [ACTIVITY_TYPES.PROVIDER_DELETE]: 'Proveedor eliminado',

  [ACTIVITY_TYPES.EMPLOYEE_CREATE]: 'Empleado agregado',
  [ACTIVITY_TYPES.EMPLOYEE_UPDATE]: 'Empleado actualizado',
  [ACTIVITY_TYPES.EMPLOYEE_DELETE]: 'Empleado eliminado',

  [ACTIVITY_TYPES.LEAD_CREATE]: 'Lead creado',
  [ACTIVITY_TYPES.LEAD_UPDATE]: 'Lead actualizado',
  [ACTIVITY_TYPES.LEAD_DELETE]: 'Lead eliminado',
  [ACTIVITY_TYPES.LEAD_STATUS_CHANGE]: 'Estado de lead cambiado',

  [ACTIVITY_TYPES.INVOICE_CREATE]: 'Factura creada',
  [ACTIVITY_TYPES.INVOICE_UPDATE]: 'Factura actualizada',
  [ACTIVITY_TYPES.INVOICE_DELETE]: 'Factura eliminada',
  [ACTIVITY_TYPES.INVOICE_STATUS_CHANGE]: 'Estado de factura cambiado',

  [ACTIVITY_TYPES.MEETING_CREATE]: 'Junta programada',
  [ACTIVITY_TYPES.MEETING_UPDATE]: 'Junta actualizada',
  [ACTIVITY_TYPES.MEETING_DELETE]: 'Junta eliminada',

  [ACTIVITY_TYPES.CONFIG_UPDATE]: 'Configuración actualizada',

  [ACTIVITY_TYPES.USER_LOGIN]: 'Inicio de sesión',
  [ACTIVITY_TYPES.USER_LOGOUT]: 'Cierre de sesión',
  [ACTIVITY_TYPES.DATA_SYNC]: 'Datos sincronizados',
  [ACTIVITY_TYPES.DATA_EXPORT]: 'Datos exportados',
  [ACTIVITY_TYPES.DATA_IMPORT]: 'Datos importados'
};

/**
 * Iconos para cada categoría de actividad
 */
export const ACTIVITY_CATEGORIES = {
  transaction: ['transaction_create', 'transaction_update', 'transaction_delete'],
  client: ['client_create', 'client_update', 'client_delete'],
  provider: ['provider_create', 'provider_update', 'provider_delete'],
  employee: ['employee_create', 'employee_update', 'employee_delete'],
  lead: ['lead_create', 'lead_update', 'lead_delete', 'lead_status_change'],
  invoice: ['invoice_create', 'invoice_update', 'invoice_delete', 'invoice_status_change'],
  meeting: ['meeting_create', 'meeting_update', 'meeting_delete'],
  config: ['config_update'],
  system: ['user_login', 'user_logout', 'data_sync', 'data_export', 'data_import']
};

/**
 * Colección de actividades en Firestore
 */
const ACTIVITY_COLLECTION = 'activity_logs';

/**
 * Crear una entrada de actividad en Firestore
 */
export const logActivityToCloud = async (userId, activityData) => {
  if (!isFirebaseConfigured() || !userId) {
    return { success: false, reason: 'not-configured' };
  }

  try {
    const activityRef = collection(db, ACTIVITY_COLLECTION);

    await addDoc(activityRef, {
      userId,
      type: activityData.type,
      description: activityData.description || ACTIVITY_LABELS[activityData.type] || 'Actividad registrada',
      details: activityData.details || null,
      entityType: activityData.entityType || null,
      entityId: activityData.entityId || null,
      entityName: activityData.entityName || null,
      metadata: activityData.metadata || {},
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error guardando actividad en la nube:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener actividades del usuario desde Firestore
 */
export const getActivitiesFromCloud = async (userId, options = {}) => {
  if (!isFirebaseConfigured() || !userId) {
    return { success: false, reason: 'not-configured', data: [] };
  }

  try {
    const {
      limitCount = 50,
      activityType = null,
      startDate = null,
      endDate = null
    } = options;

    const activityRef = collection(db, ACTIVITY_COLLECTION);
    let q = query(
      activityRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    // Filtrar por tipo de actividad si se especifica
    if (activityType) {
      q = query(
        activityRef,
        where('userId', '==', userId),
        where('type', '==', activityType),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const activities = [];

    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, data: activities };
  } catch (error) {
    console.error('Error cargando actividades de la nube:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Suscribirse a cambios en tiempo real de las actividades
 */
export const subscribeToActivities = (userId, callback, limitCount = 20) => {
  if (!isFirebaseConfigured() || !userId) {
    return () => {};
  }

  const activityRef = collection(db, ACTIVITY_COLLECTION);
  const q = query(
    activityRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const activities = [];
    snapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(activities);
  }, (error) => {
    console.error('Error en suscripción de actividades:', error);
  });
};

/**
 * Crear entrada de actividad local (para uso sin conexión)
 */
export const createLocalActivityEntry = (type, data = {}) => {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    description: data.description || ACTIVITY_LABELS[type] || 'Actividad registrada',
    details: data.details || null,
    entityType: data.entityType || null,
    entityId: data.entityId || null,
    entityName: data.entityName || null,
    metadata: data.metadata || {},
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isLocal: true
  };
};
