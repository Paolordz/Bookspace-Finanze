// ========== CONSTANTES ==========

export const CAT_ING = ['Comisiones', 'Premium', 'Premium +', 'Silver', 'Gold', 'Capital', 'Préstamo', 'Otro'];

export const CAT_EGR = ['Implementación', 'Nómina', 'Marketing', 'Hosting', 'Licencias', 'Ads', 'Equipo', 'Otros'];

export const CAJAS = ['Efectivo', 'Banco', 'Por cobrar', 'Por pagar'];

export const TIPOS_VENUE = ['Salón', 'Terraza', 'Sala juntas', 'Jardín', 'Rooftop', 'Hacienda', 'Quinta', 'Restaurant', 'Hotel', 'Otro'];

export const PLANES = [
  { id: 'basico', nombre: 'Básico', precio: 0 },
  { id: 'premium', nombre: 'Premium', precio: 2499 },
  { id: 'premium_plus', nombre: 'Premium +', precio: 3799 },
];

export const EST_LEAD = [
  { id: 'nuevo', nombre: 'Nuevo', cl: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'contactado', nombre: 'Contactado', cl: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { id: 'interesado', nombre: 'Interesado', cl: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'negociacion', nombre: 'Negociación', cl: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'cerrado', nombre: 'Cerrado ✓', cl: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'perdido', nombre: 'Perdido', cl: 'bg-red-100 text-red-700 border-red-200' },
];

export const FUENTES = ['Google', 'Facebook', 'Instagram', 'TikTok', 'Referido', 'WhatsApp', 'Evento', 'Otro'];

export const EST_FACT = [
  { id: 'borrador', nombre: 'Borrador', cl: 'bg-slate-100 text-slate-600 border-slate-200' },
  { id: 'pendiente', nombre: 'Pendiente', cl: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'pagada', nombre: 'Pagada', cl: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'cancelada', nombre: 'Cancelada', cl: 'bg-red-100 text-red-700 border-red-200' },
];

export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const MESES_COMPLETOS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: 'bs12-tx',
  CLIENTS: 'bs12-cli',
  PROVIDERS: 'bs12-prov',
  EMPLOYEES: 'bs12-emp',
  LEADS: 'bs12-leads',
  INVOICES: 'bs12-fact',
  MEETINGS: 'bs12-juntas',
  CONFIG: 'bs12-cfg',
  ACTIVITY_LOG: 'bs12-activity-log',
};
