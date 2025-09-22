// src/utils/formatters.js
// Utilidades de formato para Peru

/**
 * Formatea una cantidad en soles peruanos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Cantidad formateada (ej: "S/ 150.75")
 */
export function formatPEN(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea una fecha para Peru
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej: "15 de marzo de 2024")
 */
export function formatDatePE(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Formatea una fecha y hora para Peru
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha y hora formateada
 */
export function formatDateTimePE(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima'
  }).format(dateObj);
}

/**
 * Convierte USD a PEN usando una tasa de cambio
 * @param {number} usdAmount - Cantidad en USD
 * @param {number} exchangeRate - Tasa de cambio (default: 3.7)
 * @returns {number} - Cantidad en PEN
 */
export function convertUSDtoPEN(usdAmount, exchangeRate = 3.7) {
  return parseFloat((usdAmount * exchangeRate).toFixed(2));
}

/**
 * Formatea un número de teléfono peruano
 * @param {string} phone - Número de teléfono
 * @returns {string} - Número formateado
 */
export function formatPhonePE(phone) {
  // Eliminar espacios y caracteres especiales
  const cleaned = phone.replace(/\D/g, '');

  // Formato para números peruanos (9 dígitos)
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  // Si tiene código de país (+51)
  if (cleaned.length === 11 && cleaned.startsWith('51')) {
    const local = cleaned.slice(2);
    return `+51 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  return phone; // Retornar original si no coincide con formato esperado
}

/**
 * Datos de regiones de Peru para formularios
 */
export const PERU_REGIONS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco',
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];