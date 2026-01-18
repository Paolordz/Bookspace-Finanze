/**
 * Descarga un archivo blob
 * @param {Blob} blob - Blob a descargar
 * @param {string} fileName - Nombre del archivo
 */
export const downloadFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta datos a CSV
 * @param {array} data - Datos a exportar
 * @param {array} headers - Headers del CSV
 * @param {function} mapFn - Función para mapear cada item
 * @returns {Blob} - Blob del CSV
 */
export const exportToCSV = (data, headers, mapFn) => {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel
  const csvRows = [headers];

  data.forEach(item => {
    const row = mapFn(item);
    csvRows.push(row);
  });

  const csvContent = BOM + csvRows.map(row => {
    if (Array.isArray(row)) {
      return row.map(cell => {
        const cellStr = String(cell ?? '');
        // Escape commas, quotes, and newlines
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',');
    }
    return row;
  }).join('\r\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Exporta datos a JSON
 * @param {array} data - Datos a exportar
 * @param {string} name - Nombre del dataset
 * @param {array} headers - Headers
 * @param {function} mapFn - Función para mapear cada item
 * @param {string} period - Periodo de exportación
 * @returns {Blob} - Blob del JSON
 */
export const exportToJSON = (data, name, headers, mapFn, period) => {
  const payload = {
    nombre: name,
    periodo: period,
    exportadoEn: new Date().toISOString(),
    headers,
    rows: data.map(item => mapFn(item)),
  };

  const jsonContent = JSON.stringify(payload, null, 2);
  return new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
};

/**
 * Genera HTML para impresión de factura
 * @param {object} invoice - Factura a imprimir
 * @param {object} config - Configuración de la empresa
 * @param {function} formatCurrency - Función para formatear moneda
 * @returns {string} - HTML de la factura
 */
export const generateInvoicePrintHTML = (invoice, config, formatCurrency) => {
  const f = invoice;
  return `
    <html>
      <head>
        <title>${f.num}</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Plus Jakarta Sans', system-ui;
            padding: 40px;
            max-width: 800px;
            margin: auto;
            color: #2a1d89;
          }
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 3px solid #4f67eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            color: #2a1d89;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #b7bac3;
          }
          th {
            background: #f8f9fc;
            color: #2a1d89;
          }
          .r {
            text-align: right;
          }
          .total {
            font-size: 24px;
            color: #4f67eb;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${config.empresa}</h1>
            <p>${config.rfc || ''}</p>
          </div>
          <div style="text-align:right">
            <h2 style="color:#4f67eb">${f.num}</h2>
            <p>${new Date(f.fecha).toLocaleDateString('es-MX')}</p>
          </div>
        </div>
        <p><strong>Cliente:</strong> ${f.clienteNom || 'No especificado'}</p>
        <table>
          <tr>
            <th>Descripción</th>
            <th>Cant</th>
            <th class="r">Precio</th>
            <th class="r">Total</th>
          </tr>
          ${f.items.map(i => `
            <tr>
              <td>${i.d || '-'}</td>
              <td>${i.c}</td>
              <td class="r">${formatCurrency(i.p)}</td>
              <td class="r">${formatCurrency(i.c * i.p)}</td>
            </tr>
          `).join('')}
        </table>
        <div style="text-align:right">
          <p>Subtotal: ${formatCurrency(f.sub)}</p>
          <p>IVA: ${formatCurrency(f.iva)}</p>
          <p class="total">Total: ${formatCurrency(f.total)}</p>
        </div>
        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `;
};
