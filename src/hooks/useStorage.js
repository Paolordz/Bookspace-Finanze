import { useState, useEffect, useCallback } from 'react';
import { loadAllData, saveAllData } from '../utils/storage';
import { handleError } from '../utils/errorHandling';

/**
 * Hook para manejar el almacenamiento de datos
 * @param {function} notifyFn - Función de notificación
 * @returns {object} - Estado y métodos de storage
 */
export const useStorage = (notifyFn) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    transactions: [],
    clients: [],
    providers: [],
    employees: [],
    leads: [],
    invoices: [],
    meetings: [],
    config: { empresa: 'Bookspace', rfc: '', dir: '', tel: '', email: '' }
  });

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadAllData();
        setData(loadedData);
      } catch (error) {
        handleError(error, 'useStorage.loadData', notifyFn);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [notifyFn]);

  // Guardar datos con debounce
  useEffect(() => {
    if (loading) return;

    const saveData = async () => {
      try {
        await saveAllData(data);
      } catch (error) {
        handleError(error, 'useStorage.saveData', notifyFn);
      }
    };

    const timer = setTimeout(saveData, 1000); // Aumentado a 1s
    return () => clearTimeout(timer);
  }, [data, loading, notifyFn]);

  // Métodos para actualizar cada tipo de dato
  const updateTransactions = useCallback((transactions) => {
    setData(prev => ({ ...prev, transactions }));
  }, []);

  const updateClients = useCallback((clients) => {
    setData(prev => ({ ...prev, clients }));
  }, []);

  const updateProviders = useCallback((providers) => {
    setData(prev => ({ ...prev, providers }));
  }, []);

  const updateEmployees = useCallback((employees) => {
    setData(prev => ({ ...prev, employees }));
  }, []);

  const updateLeads = useCallback((leads) => {
    setData(prev => ({ ...prev, leads }));
  }, []);

  const updateInvoices = useCallback((invoices) => {
    setData(prev => ({ ...prev, invoices }));
  }, []);

  const updateMeetings = useCallback((meetings) => {
    setData(prev => ({ ...prev, meetings }));
  }, []);

  const updateConfig = useCallback((config) => {
    setData(prev => ({ ...prev, config }));
  }, []);

  return {
    loading,
    data,
    updateTransactions,
    updateClients,
    updateProviders,
    updateEmployees,
    updateLeads,
    updateInvoices,
    updateMeetings,
    updateConfig,
  };
};
