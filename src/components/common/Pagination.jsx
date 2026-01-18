import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente de paginación
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {function} onPageChange - Callback al cambiar de página
 * @param {number} itemsPerPage - Items por página
 * @param {number} totalItems - Total de items
 */
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <div className="text-sm text-[#b7bac3]">
        Mostrando <span className="font-medium text-[#2a1d89]">{startItem}</span> a{' '}
        <span className="font-medium text-[#2a1d89]">{endItem}</span> de{' '}
        <span className="font-medium text-[#2a1d89]">{totalItems}</span> resultados
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-[#2a1d89] hover:bg-[#f8f9fc] disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            // Mostrar solo primeras 2, últimas 2, y alrededor de la página actual
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (!showPage) {
              // Mostrar "..." solo una vez entre grupos
              if (page === 2 || page === totalPages - 1) {
                return (
                  <span key={page} className="px-3 py-1 text-[#b7bac3]">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] px-3 py-1 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-[#4f67eb] text-white'
                    : 'text-[#2a1d89] hover:bg-[#f8f9fc]'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-[#2a1d89] hover:bg-[#f8f9fc] disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
