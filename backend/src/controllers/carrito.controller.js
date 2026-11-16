import { obtenerCarrito, agregarItem, cambiarCantidad, vaciarCarrito } from '../models/carrito.model.js';
import { obtenerProducto } from '../models/producto.model.js';
import { realizarCheckout } from '../services/checkout.service.js';

function cantidadValida(valor, minimo) {
  const n = Number.parseInt(valor, 10);
  return Number.isInteger(n) && n >= minimo && n <= 50 ? n : null;
}

export async function getCarrito(req, res) {
  res.json(await obtenerCarrito(req.sesion));
}

export async function postItem(req, res) {
  const producto = await obtenerProducto(Number(req.body?.producto_id));
  if (!producto || !producto.disponible) return res.status(404).json({ error: 'Producto no disponible' });
  const cantidad = cantidadValida(req.body?.cantidad ?? 1, 1);
  if (!cantidad) return res.status(400).json({ error: 'Cantidad inválida' });
  res.json(await agregarItem(req.sesion, { producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio, cantidad }));
}

export async function patchItem(req, res) {
  const cantidad = cantidadValida(req.body?.cantidad, 0);
  if (cantidad === null) return res.status(400).json({ error: 'Cantidad inválida' });
  res.json(await cambiarCantidad(req.sesion, Number(req.params.id), cantidad));
}

export async function deleteItem(req, res) {
  res.json(await cambiarCantidad(req.sesion, Number(req.params.id), 0));
}

export async function deleteCarrito(req, res) {
  res.json(await vaciarCarrito(req.sesion));
}

export async function postCheckout(req, res) {
  const pedido = await realizarCheckout(req.sesion, req.body ?? {});
  res.status(201).json({ pedido });
}
