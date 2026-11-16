import negocio from './negocio.js';
import menu from './menu.js';
import carrito from './carrito.js';
import pedidos from './pedidos.js';
import reservas from './reservas.js';
import contacto from './contacto.js';

export const MODULOS = { negocio, menu, carrito, pedidos, reservas, contacto };

export const HERRAMIENTAS = Object.fromEntries(Object.values(MODULOS).flat().map((h) => [h.nombre, h]));

export function definicionesAnthropic() {
  return Object.values(HERRAMIENTAS).map((h) => ({ name: h.nombre, description: h.descripcion, input_schema: h.parametros }));
}

export function catalogoTexto() {
  return Object.entries(MODULOS)
    .map(([modulo, hs]) => `[${modulo}]\n${hs.map((h) => `- ${h.nombre}: ${h.descripcion} Parámetros: ${JSON.stringify(h.parametros.properties)}`).join('\n')}`)
    .join('\n');
}
