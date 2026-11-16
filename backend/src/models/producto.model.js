import { pool } from '../config/db.js';

const COLUMNAS = 'p.id, p.nombre, p.descripcion, p.precio, c.nombre AS categoria';

function agrupar(rows) {
  const grupos = new Map();
  for (const { categoria, ...producto } of rows) {
    if (!grupos.has(categoria)) grupos.set(categoria, []);
    grupos.get(categoria).push(producto);
  }
  return [...grupos].map(([categoria, productos]) => ({ categoria, productos }));
}

export async function listarPreciosPorCategoria(categoria) {
  const filtro = categoria ? 'AND c.nombre LIKE ?' : '';
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS} FROM productos p JOIN categorias c ON c.id = p.categoria_id
     WHERE p.disponible = TRUE ${filtro} ORDER BY c.orden, p.id`,
    categoria ? [`%${categoria}%`] : []
  );
  return agrupar(rows);
}

export async function listarCategorias() {
  const [rows] = await pool.query('SELECT nombre FROM categorias ORDER BY orden');
  return rows.map((r) => r.nombre);
}

export async function buscarProductos({ texto, categoria, precioMax, etiqueta } = {}) {
  const condiciones = ['p.disponible = TRUE'];
  const valores = [];
  if (texto) {
    condiciones.push('(p.nombre LIKE ? OR p.descripcion LIKE ? OR p.etiquetas LIKE ?)');
    valores.push(`%${texto}%`, `%${texto}%`, `%${texto}%`);
  }
  if (categoria) {
    condiciones.push('c.nombre LIKE ?');
    valores.push(`%${categoria}%`);
  }
  if (etiqueta) {
    condiciones.push('p.etiquetas LIKE ?');
    valores.push(`%${etiqueta}%`);
  }
  if (precioMax) {
    condiciones.push('p.precio <= ?');
    valores.push(Number(precioMax));
  }
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS} FROM productos p JOIN categorias c ON c.id = p.categoria_id
     WHERE ${condiciones.join(' AND ')} ORDER BY p.precio LIMIT 12`,
    valores
  );
  return rows;
}

export async function encontrarProducto(nombre) {
  const limpio = String(nombre ?? '').trim();
  if (!limpio) return null;
  const [exacto] = await pool.query(
    'SELECT id, nombre, precio, disponible FROM productos WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
    [limpio]
  );
  if (exacto[0]) return exacto[0];
  const [parecidos] = await pool.query(
    'SELECT id, nombre, precio, disponible FROM productos WHERE nombre LIKE ? ORDER BY CHAR_LENGTH(nombre) LIMIT 1',
    [`%${limpio}%`]
  );
  if (parecidos[0]) return parecidos[0];
  const palabras = limpio.split(/\s+/).filter((p) => p.length > 3);
  for (const palabra of palabras) {
    const [rows] = await pool.query(
      'SELECT id, nombre, precio, disponible FROM productos WHERE nombre LIKE ? ORDER BY CHAR_LENGTH(nombre) LIMIT 1',
      [`%${palabra}%`]
    );
    if (rows[0]) return rows[0];
  }
  return null;
}
