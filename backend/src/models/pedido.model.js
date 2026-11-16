import { pool } from '../config/db.js';

function generarCodigo(prefijo) {
  return `${prefijo}-${Math.floor(1000 + Math.random() * 9000)}${Date.now().toString().slice(-2)}`;
}

export async function crearPedido({ cliente, modalidad, items }) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const total = items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0);
    const codigo = generarCodigo('SC');
    const [resultado] = await conexion.query(
      'INSERT INTO pedidos (codigo, cliente, modalidad, total) VALUES (?, ?, ?, ?)',
      [codigo, cliente, modalidad, total]
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
    'SELECT id, codigo, cliente, modalidad, estado, total, creado_en FROM pedidos WHERE codigo = ?',
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

export async function cancelarPedido(codigo) {
  const pedido = await obtenerPedido(codigo);
  if (!pedido) return { error: `No existe un pedido con el código ${codigo}.` };
  if (!['recibido', 'preparando'].includes(pedido.estado)) {
    return { error: `El pedido ${pedido.codigo} ya está ${pedido.estado} y no se puede cancelar.`, pedido };
  }
  await pool.query("UPDATE pedidos SET estado = 'cancelado' WHERE id = ?", [pedido.id]);
  return { pedido: await obtenerPedido(pedido.codigo) };
}

export { generarCodigo };
