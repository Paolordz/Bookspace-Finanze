/**
 * Calcula totales de transacciones
 * @param {array} transactions - Array de transacciones
 * @returns {object} - Totales calculados
 */
export const calculateTotals = (transactions) => {
  let ing = 0, egr = 0, efectivo = 0, banco = 0, xCobrar = 0, xPagar = 0;

  transactions.forEach(t => {
    const m = Number(t.monto) || 0;
    if (t.tipo === 'Ingreso') {
      ing += m;
      if (t.caja === 'Efectivo') efectivo += m;
      else if (t.caja === 'Banco') banco += m;
      else if (t.caja === 'Por cobrar') xCobrar += m;
    } else {
      egr += m;
      if (t.caja === 'Efectivo') efectivo -= m;
      else if (t.caja === 'Banco') banco -= m;
      else if (t.caja === 'Por pagar') xPagar += m;
    }
  });

  return {
    ing,
    egr,
    balance: ing - egr,
    efectivo,
    banco,
    xCobrar,
    xPagar
  };
};

/**
 * Calcula análisis por categorías
 * @param {array} transactions - Array de transacciones
 * @param {array} incomeCategories - Categorías de ingresos
 * @param {array} expenseCategories - Categorías de egresos
 * @returns {object} - Análisis por categoría
 */
export const calculateCategoryAnalysis = (transactions, incomeCategories, expenseCategories) => {
  const ingresos = {};
  const egresos = {};

  incomeCategories.forEach(c => ingresos[c] = 0);
  expenseCategories.forEach(c => egresos[c] = 0);

  transactions.forEach(t => {
    const m = Number(t.monto) || 0;
    if (t.tipo === 'Ingreso' && t.cat) {
      ingresos[t.cat] = (ingresos[t.cat] || 0) + m;
    } else if (t.tipo === 'Egreso' && t.cat) {
      egresos[t.cat] = (egresos[t.cat] || 0) + m;
    }
  });

  return { ingresos, egresos };
};

/**
 * Calcula análisis mensual
 * @param {array} transactions - Array de transacciones
 * @param {number} year - Año a analizar
 * @returns {array} - Array con datos mensuales
 */
export const calculateMonthlyAnalysis = (transactions, year) => {
  const meses = Array(12).fill(null).map(() => ({ ing: 0, egr: 0 }));

  transactions.forEach(t => {
    const fecha = new Date(t.fecha);
    if (fecha.getFullYear() === year) {
      const mesIdx = fecha.getMonth();
      const m = Number(t.monto) || 0;
      if (t.tipo === 'Ingreso') {
        meses[mesIdx].ing += m;
      } else {
        meses[mesIdx].egr += m;
      }
    }
  });

  return meses;
};

/**
 * Calcula métricas financieras avanzadas
 * @param {object} totals - Totales calculados
 * @param {object} globalTotals - Totales globales del año
 * @param {array} filteredTransactions - Transacciones filtradas
 * @param {array} monthlyAnalysis - Análisis mensual
 * @returns {object} - Métricas calculadas
 */
export const calculateMetrics = (totals, globalTotals, filteredTransactions, monthlyAnalysis) => {
  const margenBruto = totals.ing > 0 ? ((totals.balance / totals.ing) * 100) : 0;
  const roi = totals.egr > 0 ? ((totals.balance / totals.egr) * 100) : 0;
  const liquidez = totals.efectivo + totals.banco;
  const capitalTrabajo = liquidez + totals.xCobrar - totals.xPagar;

  const promedioIngreso = filteredTransactions.filter(t => t.tipo === 'Ingreso').length > 0
    ? totals.ing / filteredTransactions.filter(t => t.tipo === 'Ingreso').length : 0;

  const promedioEgreso = filteredTransactions.filter(t => t.tipo === 'Egreso').length > 0
    ? totals.egr / filteredTransactions.filter(t => t.tipo === 'Egreso').length : 0;

  const mesesConDatos = monthlyAnalysis.filter(m => m.ing > 0 || m.egr > 0).length || 1;
  const promedioMensualIng = globalTotals.ing / mesesConDatos;
  const promedioMensualEgr = globalTotals.egr / mesesConDatos;
  const proyeccionAnual = (promedioMensualIng - promedioMensualEgr) * 12;

  return {
    margenBruto,
    roi,
    liquidez,
    capitalTrabajo,
    promedioIngreso,
    promedioEgreso,
    promedioMensualIng,
    promedioMensualEgr,
    proyeccionAnual
  };
};

/**
 * Calcula totales de factura con IVA
 * @param {array} items - Items de la factura
 * @param {number} ivaRate - Tasa de IVA (default 0.16)
 * @returns {object} - { sub, iva, total }
 */
export const calculateInvoiceTotals = (items, ivaRate = 0.16) => {
  const sub = items.reduce((s, i) => s + (Number(i.c) || 0) * (Number(i.p) || 0), 0);
  const iva = sub * ivaRate;
  const total = sub + iva;

  return { sub, iva, total };
};

/**
 * Calcula estadísticas de CRM
 * @param {array} leads - Array de leads
 * @param {array} plans - Planes disponibles
 * @returns {object} - Estadísticas CRM
 */
export const calculateCRMStats = (leads, plans) => {
  const nuevo = leads.filter(l => l.estado === 'nuevo').length;
  const contactado = leads.filter(l => l.estado === 'contactado').length;
  const interesado = leads.filter(l => l.estado === 'interesado').length;
  const negociacion = leads.filter(l => l.estado === 'negociacion').length;
  const cerrado = leads.filter(l => l.estado === 'cerrado').length;
  const perdido = leads.filter(l => l.estado === 'perdido').length;
  const proceso = contactado + interesado + negociacion;

  const potencial = leads
    .filter(l => !['cerrado', 'perdido'].includes(l.estado))
    .reduce((sum, l) => sum + (plans.find(p => p.id === l.plan)?.precio || 0), 0);

  const conversion = (cerrado + perdido) > 0 ? (cerrado / (cerrado + perdido)) * 100 : 0;

  return {
    total: leads.length,
    nuevo,
    contactado,
    interesado,
    negociacion,
    proceso,
    cerrado,
    perdido,
    potencial,
    conversion
  };
};

/**
 * Calcula estadísticas de facturas
 * @param {array} invoices - Array de facturas
 * @returns {object} - Estadísticas de facturas
 */
export const calculateInvoiceStats = (invoices) => {
  return {
    total: invoices.length,
    pendiente: invoices.filter(f => f.estado === 'pendiente').reduce((s, f) => s + (f.total || 0), 0),
    pagada: invoices.filter(f => f.estado === 'pagada').reduce((s, f) => s + (f.total || 0), 0),
  };
};

/**
 * Filtra transacciones por año y mes
 * @param {array} transactions - Array de transacciones
 * @param {number} year - Año
 * @param {number} month - Mes (0 = todos)
 * @returns {array} - Transacciones filtradas
 */
export const filterTransactionsByPeriod = (transactions, year, month) => {
  return transactions.filter(t => {
    const fecha = new Date(t.fecha);
    const matchYear = fecha.getFullYear() === year;
    const matchMonth = month === 0 || (fecha.getMonth() + 1) === month;
    return matchYear && matchMonth;
  });
};
