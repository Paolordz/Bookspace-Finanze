import { useState, useMemo } from 'react';

/**
 * Hook para manejar paginación
 * @param {array} data - Datos a paginar
 * @param {number} itemsPerPage - Items por página
 * @returns {object} - Estado y métodos de paginación
 */
export const usePagination = (data, itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    itemsPerPage,
    totalItems: data.length,
  };
};
