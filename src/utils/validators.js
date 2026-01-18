/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const validateEmail = (email) => {
  if (!email) return true; // Email es opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un RFC mexicano
 * @param {string} rfc - RFC a validar
 * @returns {boolean} - true si es válido
 */
export const validateRFC = (rfc) => {
  if (!rfc) return true; // RFC es opcional
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcRegex.test(rfc.toUpperCase());
};

/**
 * Valida un teléfono mexicano
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - true si es válido
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Teléfono es opcional
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

/**
 * Valida un monto
 * @param {number} amount - Monto a validar
 * @returns {boolean} - true si es válido
 */
export const validateAmount = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num >= 0;
};

/**
 * Valida una fecha (no puede ser futura para transacciones)
 * @param {string} date - Fecha a validar
 * @param {boolean} allowFuture - Permitir fechas futuras
 * @returns {boolean} - true si es válida
 */
export const validateDate = (date, allowFuture = false) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(dateObj.getTime())) return false;
  if (!allowFuture && dateObj > today) return false;

  return true;
};

/**
 * Valida campos requeridos
 * @param {object} data - Objeto con datos a validar
 * @param {array} requiredFields - Array de campos requeridos
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateRequired = (data, requiredFields) => {
  const errors = [];

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`El campo ${field} es requerido`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida un lead completo
 * @param {object} lead - Lead a validar
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateLead = (lead) => {
  const errors = [];

  // Al menos contacto o venue debe estar presente
  if (!lead.contacto && !lead.venue) {
    errors.push('Ingresa nombre de contacto o venue');
  }

  // Validar email
  if (lead.email && !validateEmail(lead.email)) {
    errors.push('Email inválido');
  }

  // Validar teléfono
  if (lead.tel && !validatePhone(lead.tel)) {
    errors.push('Teléfono debe tener al menos 10 dígitos');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida un cliente
 * @param {object} client - Cliente a validar
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateClient = (client) => {
  const errors = [];

  if (!client.nombre || client.nombre.trim() === '') {
    errors.push('El nombre es requerido');
  }

  if (client.email && !validateEmail(client.email)) {
    errors.push('Email inválido');
  }

  if (client.rfc && !validateRFC(client.rfc)) {
    errors.push('RFC inválido (formato: AAA123456XXX)');
  }

  if (client.tel && !validatePhone(client.tel)) {
    errors.push('Teléfono debe tener al menos 10 dígitos');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida una transacción
 * @param {object} transaction - Transacción a validar
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateTransaction = (transaction) => {
  const errors = [];

  if (!validateDate(transaction.fecha, false)) {
    errors.push('Fecha inválida o futura');
  }

  if (!validateAmount(transaction.monto)) {
    errors.push('Monto debe ser un número positivo');
  }

  if (!transaction.tipo || !['Ingreso', 'Egreso'].includes(transaction.tipo)) {
    errors.push('Tipo de transacción inválido');
  }

  if (!transaction.caja) {
    errors.push('Caja es requerida');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida una factura
 * @param {object} invoice - Factura a validar
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateInvoice = (invoice) => {
  const errors = [];

  if (!invoice.fecha || !validateDate(invoice.fecha, true)) {
    errors.push('Fecha inválida');
  }

  if (!invoice.clienteNom || invoice.clienteNom.trim() === '') {
    errors.push('Selecciona un cliente');
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.push('Agrega al menos un concepto');
  }

  if (invoice.items && invoice.items.some(item => !item.d || item.d.trim() === '')) {
    errors.push('Todos los conceptos deben tener descripción');
  }

  if (invoice.total <= 0) {
    errors.push('El total debe ser mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
