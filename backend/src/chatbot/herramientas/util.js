export function bs(precio) {
  return `Bs ${Number(precio).toFixed(2)}`;
}

export function texto(valor) {
  return valor == null ? '' : String(valor).trim();
}

export function entero(valor, porDefecto) {
  const n = Number.parseInt(valor, 10);
  return Number.isFinite(n) && n > 0 ? n : porDefecto;
}

export function resumenCarrito(carrito) {
  if (!carrito.items.length) return 'El carrito está vacío.';
  return `Carrito: ${carrito.items.map((i) => `${i.cantidad} x ${i.nombre}${i.detalle ? ` (${i.detalle})` : ''}`).join(', ')}. Total ${bs(carrito.total)}.`;
}
