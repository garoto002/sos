// utils/formatMetical.js
export function formatMetical(value) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2
  }).format(value);
}
