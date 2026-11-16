import { obtenerCarrito, vaciarCarrito } from '../models/carrito.model.js';
import { crearPedido } from '../models/pedido.model.js';

const MODALIDADES = ['mesa', 'llevar', 'delivery'];
const METODOS = ['tarjeta', 'qr', 'efectivo'];

function fallo(mensaje, status) {
  return Object.assign(new Error(mensaje), { status, publico: true });
}

export async function realizarCheckout(sesion, { cliente, telefono, modalidad, metodo_pago, tarjeta }) {
  const nombre = String(cliente ?? '').trim();
  if (nombre.length < 2) throw fallo('Falta el nombre del cliente.', 400);
  if (!MODALIDADES.includes(modalidad)) throw fallo('Modalidad inválida: usa mesa, llevar o delivery.', 400);
  if (!METODOS.includes(metodo_pago)) throw fallo('Método de pago inválido: usa tarjeta, qr o efectivo.', 400);

  const carrito = await obtenerCarrito(sesion);
  if (!carrito.items.length) throw fallo('El carrito está vacío.', 400);

  let pago_estado = 'pendiente';
  if (metodo_pago === 'tarjeta') {
    const numero = String(tarjeta?.numero ?? '').replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(numero)) throw fallo('Número de tarjeta inválido.', 400);
    if (!/^\d{2}\/\d{2}$/.test(String(tarjeta?.vencimiento ?? ''))) throw fallo('Vencimiento inválido (MM/AA).', 400);
    if (!/^\d{3,4}$/.test(String(tarjeta?.cvv ?? ''))) throw fallo('CVV inválido.', 400);
    if (numero.endsWith('0000')) throw fallo('Pago rechazado por el banco (simulado). Prueba con otra tarjeta.', 402);
    pago_estado = 'aprobado';
  } else if (metodo_pago === 'qr') {
    pago_estado = 'aprobado';
  }

  const pedido = await crearPedido({
    sesion,
    cliente: nombre,
    telefono: telefono ? String(telefono).trim() : null,
    modalidad,
    metodo_pago,
    pago_estado,
    items: carrito.items.map((i) => ({
      producto_id: i.producto_id,
      producto: i.nombre,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
      detalle: i.detalle
    }))
  });
  await vaciarCarrito(sesion);
  return pedido;
}
