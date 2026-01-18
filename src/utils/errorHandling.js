/**
 * Maneja errores de manera consistente
 * @param {Error} error - Error a manejar
 * @param {string} context - Contexto del error
 * @param {function} notifyFn - Función de notificación
 */
export const handleError = (error, context, notifyFn) => {
  console.error(`Error in ${context}:`, error);

  // Determinar el mensaje de error apropiado
  let userMessage = 'Ocurrió un error inesperado';

  if (error.name === 'StorageError') {
    userMessage = `Error al ${error.operation === 'load' ? 'cargar' : 'guardar'} datos. Reinténtalo.`;
  } else if (error.name === 'ValidationError') {
    userMessage = error.message;
  } else if (error.message) {
    userMessage = error.message;
  }

  // Notificar al usuario
  if (notifyFn) {
    notifyFn(userMessage, 'error');
  }

  // En producción, aquí se enviaría a un servicio de logging
  // como Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // logToService(error, context);
  }
};

/**
 * Error de validación personalizado
 */
export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Wrapper para ejecutar funciones async con manejo de errores
 * @param {function} fn - Función async a ejecutar
 * @param {string} context - Contexto de ejecución
 * @param {function} notifyFn - Función de notificación
 * @returns {function} - Función wrapeada
 */
export const withErrorHandling = (fn, context, notifyFn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, notifyFn);
      throw error;
    }
  };
};

/**
 * Retry logic para operaciones que pueden fallar temporalmente
 * @param {function} fn - Función a ejecutar
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} delay - Delay entre reintentos (ms)
 * @returns {Promise<any>} - Resultado de la función
 */
export const retryOperation = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};
