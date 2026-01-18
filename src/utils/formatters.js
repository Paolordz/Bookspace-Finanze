/**
 * Formatea un número como moneda mexicana (MXN)
 * @param {number} n - Número a formatear
 * @returns {string} - Número formateado como moneda
 */
export const formatCurrency = (n) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(n || 0);
};

/**
 * Formatea una fecha en formato local mexicano
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-MX');
};

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 * @returns {string} - Fecha actual
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formatea un número de teléfono mexicano
 * @param {string} phone - Número de teléfono
 * @returns {string} - Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Genera un nombre de archivo con timestamp
 * @param {string} baseName - Nombre base del archivo
 * @param {string} extension - Extensión del archivo
 * @returns {string} - Nombre de archivo con timestamp
 */
export const generateFileName = (baseName, extension) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${baseName}_${timestamp}.${extension}`;
};
