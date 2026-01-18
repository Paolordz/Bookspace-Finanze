# 🚀 Guía Rápida de Uso - Mejoras Implementadas

## ⚡ Inicio Rápido

### 1. Importar componentes comunes

```javascript
import {
  BookspaceLogo,
  ProgressBar,
  StatCard,
  ExportMenu,
  Notification,
  Pagination,
  EmptyState,
  LoadingSpinner
} from './src/components/common';
```

### 2. Importar utilidades

```javascript
// Formateo
import { formatCurrency, formatDate, formatPhone } from './src/utils/formatters';

// Validación
import { validateLead, validateClient, validateInvoice } from './src/utils/validators';

// Cálculos
import { calculateTotals, calculateCRMStats } from './src/utils/calculations';

// Storage
import { loadAllData, saveAllData } from './src/utils/storage';

// Exportación
import { exportToCSV, exportToJSON, downloadFile } from './src/utils/export';
```

### 3. Importar hooks

```javascript
import { usePagination, useStorage } from './src/hooks';
```

### 4. Importar constantes

```javascript
import { PLANES, EST_LEAD, CAT_ING, MESES } from './src/constants';
```

---

## 📋 Ejemplos Comunes

### Validar un formulario

```javascript
import { validateLead } from './src/utils/validators';

const handleSubmit = () => {
  const { isValid, errors } = validateLead(formData);

  if (!isValid) {
    errors.forEach(error => notify(error, 'error'));
    return;
  }

  // Continuar con el guardado...
};
```

### Agregar paginación a una tabla

```javascript
import { usePagination } from './src/hooks';
import { Pagination } from './src/components/common';

function TransactionTable({ transactions }) {
  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    itemsPerPage,
    totalItems
  } = usePagination(transactions, 20);

  return (
    <>
      <table>
        {paginatedData.map(tx => <tr key={tx.id}>...</tr>)}
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </>
  );
}
```

### Calcular métricas financieras

```javascript
import { calculateTotals, calculateMetrics } from './src/utils/calculations';

const totals = calculateTotals(transactions);
// { ing, egr, balance, efectivo, banco, xCobrar, xPagar }

const metrics = calculateMetrics(totals, globalTotals, filteredTx, monthlyAnalysis);
// { margenBruto, roi, liquidez, capitalTrabajo, ... }
```

### Exportar datos

```javascript
import { exportToCSV, downloadFile } from './src/utils/export';
import { formatCurrency } from './src/utils/formatters';

const handleExport = () => {
  const csvBlob = exportToCSV(
    transactions,
    ['Fecha', 'Tipo', 'Monto'],
    (t) => [t.fecha, t.tipo, t.monto]
  );

  downloadFile(csvBlob, 'transacciones.csv');
};
```

### Mostrar estado vacío

```javascript
import { EmptyState } from './src/components/common';
import { Users, Plus } from 'lucide-react';

{transactions.length === 0 && (
  <EmptyState
    icon={Users}
    title="No hay transacciones"
    description="Comienza agregando tu primera transacción"
    action={
      <button onClick={agregarTransaccion}>
        <Plus /> Agregar transacción
      </button>
    }
  />
)}
```

---

## 🎯 Validaciones Disponibles

### Email
```javascript
import { validateEmail } from './src/utils/validators';
const isValid = validateEmail('test@example.com'); // true/false
```

### RFC
```javascript
import { validateRFC } from './src/utils/validators';
const isValid = validateRFC('XAXX010101000'); // true/false
```

### Teléfono
```javascript
import { validatePhone } from './src/utils/validators';
const isValid = validatePhone('5512345678'); // true/false
```

### Lead completo
```javascript
import { validateLead } from './src/utils/validators';
const { isValid, errors } = validateLead({
  contacto: "Juan",
  email: "juan@example.com",
  tel: "5512345678"
});
```

---

## 🎨 Componentes Visuales

### StatCard con tendencia
```javascript
<StatCard
  title="Ingresos"
  value={formatCurrency(50000)}
  subtitle="vs mes anterior"
  icon={ArrowUpRight}
  color="success"
  trend="up"
/>
```

### ProgressBar
```javascript
<ProgressBar value={7500} max={10000} color="success" />
<ProgressBar value={3000} max={10000} color="warning" />
<ProgressBar value={1000} max={10000} color="danger" />
```

### Notification
```javascript
<Notification text="Guardado correctamente" type="success" />
<Notification text="Error al cargar" type="error" />
```

---

## 💾 Storage

### Cargar todos los datos
```javascript
import { loadAllData } from './src/utils/storage';

const data = await loadAllData();
// {
//   transactions: [...],
//   clients: [...],
//   leads: [...],
//   ...
// }
```

### Guardar todos los datos
```javascript
import { saveAllData } from './src/utils/storage';

await saveAllData({
  transactions: [...],
  clients: [...],
  // ...
});
```

---

## 🔧 Manejo de Errores

### Manejo básico
```javascript
import { handleError } from './src/utils/errorHandling';

try {
  await saveData();
} catch (error) {
  handleError(error, 'saveData', notify);
}
```

### Con wrapper automático
```javascript
import { withErrorHandling } from './src/utils/errorHandling';

const safeSave = withErrorHandling(saveData, 'saveData', notify);
await safeSave();
```

### Con reintentos
```javascript
import { retryOperation } from './src/utils/errorHandling';

await retryOperation(
  () => window.storage.set('key', 'value'),
  3, // max reintentos
  1000 // delay en ms
);
```

---

## 📊 Cálculos Financieros

```javascript
import {
  calculateTotals,
  calculateCategoryAnalysis,
  calculateMonthlyAnalysis,
  calculateCRMStats
} from './src/utils/calculations';

// Totales
const totals = calculateTotals(transactions);

// Por categoría
const { ingresos, egresos } = calculateCategoryAnalysis(
  transactions,
  CAT_ING,
  CAT_EGR
);

// Análisis mensual
const monthlyData = calculateMonthlyAnalysis(transactions, 2026);

// Stats CRM
const crmStats = calculateCRMStats(leads, PLANES);
```

---

## 🎨 Formateo

```javascript
import { formatCurrency, formatDate, formatPhone } from './src/utils/formatters';

formatCurrency(2499);        // "$2,499.00"
formatDate("2026-01-18");    // "18/01/2026"
formatPhone("5512345678");   // "(551) 234-5678"
```

---

## 📤 Exportación

### CSV
```javascript
import { exportToCSV, downloadFile } from './src/utils/export';

const blob = exportToCSV(
  data,
  ['Columna1', 'Columna2'],
  (item) => [item.col1, item.col2]
);

downloadFile(blob, 'export.csv');
```

### JSON
```javascript
import { exportToJSON, downloadFile } from './src/utils/export';

const blob = exportToJSON(
  data,
  'Datos',
  ['Col1', 'Col2'],
  (item) => [item.col1, item.col2],
  'Enero 2026'
);

downloadFile(blob, 'export.json');
```

---

## 🔍 Tips y Trucos

### 1. Combinar validación con manejo de errores
```javascript
import { validateLead } from './src/utils/validators';
import { ValidationError } from './src/utils/errorHandling';

const guardarLead = () => {
  const { isValid, errors } = validateLead(lead);

  if (!isValid) {
    throw new ValidationError(errors.join(', '), 'lead');
  }

  // Guardar...
};
```

### 2. Usar paginación con filtros
```javascript
// Primero filtrar
const filtered = transactions.filter(t => t.tipo === 'Ingreso');

// Luego paginar
const { paginatedData, resetPage } = usePagination(filtered, 20);

// Resetear página al cambiar filtros
useEffect(() => {
  resetPage();
}, [filtered]);
```

### 3. Formatear en mapeos
```javascript
import { formatCurrency } from './src/utils/formatters';

{transactions.map(t => (
  <tr key={t.id}>
    <td>{formatCurrency(t.monto)}</td>
  </tr>
))}
```

---

## 📚 Recursos

- **Documentación completa**: Ver `MEJORAS_FASE_1.md`
- **Código original**: `BookspaceERP-v5.jsx`
- **Constantes**: `src/constants/index.js`
- **Ejemplos de uso**: Este archivo

---

## ❓ FAQ

**P: ¿Puedo usar estos módulos con el código existente?**
R: Sí, todos los módulos son compatibles y pueden importarse gradualmente.

**P: ¿Qué pasa si no valido los datos?**
R: La aplicación funcionará, pero podrías guardar datos inválidos. Se recomienda siempre validar.

**P: ¿Cómo agrego paginación a una vista existente?**
R: Importa `usePagination`, pasa tus datos, y usa `paginatedData` en lugar del array completo.

**P: ¿Los componentes están optimizados?**
R: Sí, `StatCard` y `ExportMenu` usan `React.memo()` para evitar re-renders innecesarios.

**P: ¿Puedo personalizar los validadores?**
R: Sí, están en `src/utils/validators.js` y puedes modificarlos o agregar nuevos.

---

**¡Listo para usar! 🚀**

Para más detalles, consulta `MEJORAS_FASE_1.md`
