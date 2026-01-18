import React from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';

/**
 * Menú dropdown para exportación
 * @param {function} onCsv - Callback al exportar CSV
 * @param {function} onJson - Callback al exportar JSON
 * @param {string} label - Label del botón
 */
const ExportMenu = ({ onCsv, onJson, label = 'Exportar' }) => (
  <details className="relative">
    <summary className="list-none">
      <span className="px-4 py-2.5 border border-gray-200 text-[#2a1d89] rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer">
        <Download className="w-4 h-4" />
        {label}
        <ChevronDown className="w-4 h-4 text-[#b7bac3]" />
      </span>
    </summary>
    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-10 p-2">
      <button
        type="button"
        onClick={(event) => {
          onCsv();
          const details = event.currentTarget.closest('details');
          if (details) details.removeAttribute('open');
        }}
        className="w-full px-3 py-2 rounded-lg text-left text-sm text-[#2a1d89] hover:bg-[#f8f9fc] flex items-center gap-2"
      >
        <FileSpreadsheet className="w-4 h-4 text-[#4f67eb]" />
        CSV (Excel)
      </button>
      <button
        type="button"
        onClick={(event) => {
          onJson();
          const details = event.currentTarget.closest('details');
          if (details) details.removeAttribute('open');
        }}
        className="w-full px-3 py-2 rounded-lg text-left text-sm text-[#2a1d89] hover:bg-[#f8f9fc] flex items-center gap-2"
      >
        <FileText className="w-4 h-4 text-[#4f67eb]" />
        JSON (API)
      </button>
    </div>
  </details>
);

export default React.memo(ExportMenu);
