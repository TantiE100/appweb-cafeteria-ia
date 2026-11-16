import { pool } from '../config/db.js';

export function generarCodigo(prefijo) {
  return `${prefijo}-${Math.floor(1000 + Math.random() * 9000)}${Date.now().toString().slice(-2)}`;
}

export async function crearPedido({ sesion = null, cliente, telefono = null, modalidad = 'llevar', metodo_pago = 'efectivo', pago_estado = 'pendiente', items }) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const total = items.reduce((suma, i) => suma + Number(i.precio_unitario) * i.cantidad, 0);
    const codigo = generarCodigo('SC');
    const [resultado] = await conexion.query(
      'INSERT INTO pedidos (codigo, sesion, cliente, telefono, modalidad, metodo_pago, pago_estado, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [codigo, sesion, cliente, telefono, modalidad, metodo_pago, pago_estado, total]
    );
    for (const item of items) {
      await conexion.query(
        'INSERT INTO pedido_items (pedido_id, producto_id, producto, cantidad, precio_unitario, detalle) VALUES (?, ?, ?, ?, ?, ?)',
        [resultado.insertId, item.producto_id ?? null, item.producto, item.cantidad, item.precio_unitario, item.detalle ?? null]
      );
    }
    await conexion.commit();
    return obtenerPedido(codigo);
  } catch (err) {
    await conexion.rollback();
    throw err;
  } finally {
    conexion.release();
  }
}

export async function obtenerPedido(codigo) {
  const [pedidos] = await pool.query(
    'SELECT id, codigo, cliente, telefono, modalidad, estado, metodo_pago, pago_estado, total, creado_en FROM pedidos WHERE codigo = ?',
    [String(codigo ?? '').trim().toUpperCase()]
  );
  const pedido = pedidos[0];
  if (!pedido) return null;
  const [items] = await pool.query(
    'SELECT producto, cantidad, precio_unitario, cantidad * precio_unitario AS subtotal, detalle FROM pedido_items WHERE pedido_id = ?',
    [pedido.id]
  );
  return { ...pedido, items };
}

export async function ultimoPedidoDeSesion(sesion) {
  const [rows] = await pool.query('SELECT codigo FROM pedidos WHERE sesion = ? ORDER BY id DESC LIMIT 1', [sesion]);
  return rows[0] ? obtenerPedido(rows[0].codigo) : null;
}

export async function cancelarPedido(codigo) {
  const pedido = await obtenerPedido(codigo);
  if (!pedido) return { error: `No existe un pedido con el código ${codigo}.` };
  if (!['recibido', 'preparando'].includes(pedido.estado)) {
    return { error: `El pedido ${pedido.codigo} ya está ${pedido.estado} y no se puede cancelar.`, pedido };
  }
  const pago = pedido.pago_estado === 'aprobado' ? 'reembolsado' : pedido.pago_estado;
  await pool.query("UPDATE pedidos SET estado = 'cancelado', pago_estado = ? WHERE id = ?", [pago, pedido.id]);
  return { pedido: await obtenerPedido(pedido.codigo) };
}
