import { pool } from '../config/db.js';

async function idCarrito(sesion) {
  await pool.query('INSERT IGNORE INTO carritos (sesion) VALUES (?)', [sesion]);
  const [rows] = await pool.query('SELECT id FROM carritos WHERE sesion = ?', [sesion]);
  return rows[0].id;
}

export async function obtenerCarrito(sesion) {
  const id = await idCarrito(sesion);
  const [items] = await pool.query(
    `SELECT id, producto_id, nombre, precio_unitario, cantidad, detalle, precio_unitario * cantidad AS subtotal
     FROM carrito_items WHERE carrito_id = ? ORDER BY id`,
    [id]
  );
  return {
    id,
    items,
    cantidad: items.reduce((s, i) => s + i.cantidad, 0),
    total: Number(items.reduce((s, i) => s + Number(i.subtotal), 0).toFixed(2))
  };
}

export async function agregarItem(sesion, { producto_id = null, nombre, precio_unitario, cantidad = 1, detalle = null }) {
  const id = await idCarrito(sesion);
  const [existente] = await pool.query(
    'SELECT id FROM carrito_items WHERE carrito_id = ? AND producto_id <=> ? AND nombre = ? AND detalle <=> ?',
    [id, producto_id, nombre, detalle]
  );
  if (existente[0]) {
    await pool.query('UPDATE carrito_items SET cantidad = cantidad + ? WHERE id = ?', [cantidad, existente[0].id]);
  } else {
    await pool.query(
      'INSERT INTO carrito_items (carrito_id, producto_id, nombre, precio_unitario, cantidad, detalle) VALUES (?, ?, ?, ?, ?, ?)',
      [id, producto_id, nombre, precio_unitario, cantidad, detalle]
    );
  }
  return obtenerCarrito(sesion);
}

export async function cambiarCantidad(sesion, itemId, cantidad) {
  const id = await idCarrito(sesion);
  if (cantidad <= 0) await pool.query('DELETE FROM carrito_items WHERE id = ? AND carrito_id = ?', [itemId, id]);
  else await pool.query('UPDATE carrito_items SET cantidad = ? WHERE id = ? AND carrito_id = ?', [cantidad, itemId, id]);
  return obtenerCarrito(sesion);
}

export async function vaciarCarrito(sesion) {
  const id = await idCarrito(sesion);
  await pool.query('DELETE FROM carrito_items WHERE carrito_id = ?', [id]);
  return obtenerCarrito(sesion);
}
