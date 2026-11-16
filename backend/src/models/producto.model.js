import { pool } from '../config/db.js';

const COLUMNAS = 'p.id, p.nombre, p.descripcion, p.precio, c.nombre AS categoria';
const BASE = 'FROM productos p JOIN categorias c ON c.id = p.categoria_id';

export async function listarPreciosPorCategoria() {
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS}, c.icono ${BASE} WHERE p.disponible = TRUE ORDER BY c.orden, p.id`
  );
  const grupos = new Map();
  for (const { categoria, icono, ...producto } of rows) {
    if (!grupos.has(categoria)) grupos.set(categoria, { categoria, icono, productos: [] });
    grupos.get(categoria).productos.push(producto);
  }
  return [...grupos.values()];
}

export async function listarCategorias() {
  const [rows] = await pool.query('SELECT nombre FROM categorias ORDER BY orden');
  return rows.map((r) => r.nombre);
}

export async function paginarMenu({ categoria, pagina = 1, porPagina = 6 } = {}) {
  const categorias = await listarCategorias();
  const buscada = categoria ? String(categoria).trim().toLowerCase() : '';
  const elegida = buscada ? categorias.find((c) => c.toLowerCase().includes(buscada)) ?? null : null;
  const filtro = elegida ? 'AND c.nombre = ?' : '';
  const valores = elegida ? [elegida] : [];
  const por = Math.min(Math.max(Number.parseInt(porPagina, 10) || 6, 1), 20);
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${BASE} WHERE p.disponible = TRUE ${filtro}`, valores);
  const totalPaginas = Math.max(Math.ceil(total / por), 1);
  const actual = Math.min(Math.max(Number.parseInt(pagina, 10) || 1, 1), totalPaginas);
  const [productos] = await pool.query(
    `SELECT ${COLUMNAS} ${BASE} WHERE p.disponible = TRUE ${filtro} ORDER BY c.orden, p.id LIMIT ? OFFSET ?`,
    [...valores, por, (actual - 1) * por]
  );
  return { categoria: elegida, categorias, pagina: actual, por_pagina: por, total, total_paginas: totalPaginas, productos };
}

export async function buscarProductos({ texto, categoria, precioMax } = {}) {
  const condiciones = ['p.disponible = TRUE'];
  const valores = [];
  for (const palabra of String(texto ?? '').toLowerCase().split(/\s+/).filter((p) => p.length > 2)) {
    condiciones.push('(LOWER(p.nombre) LIKE ? OR LOWER(p.descripcion) LIKE ? OR p.etiquetas LIKE ?)');
    valores.push(`%${palabra}%`, `%${palabra}%`, `%${palabra}%`);
  }
  if (categoria) {
    condiciones.push('c.nombre LIKE ?');
    valores.push(`%${categoria}%`);
  }
  if (precioMax) {
    condiciones.push('p.precio <= ?');
    valores.push(Number(precioMax));
  }
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS} ${BASE} WHERE ${condiciones.join(' AND ')} ORDER BY p.precio LIMIT 8`,
    valores
  );
  return rows;
}

export async function obtenerProducto(id) {
  const [rows] = await pool.query('SELECT id, nombre, precio, disponible FROM productos WHERE id = ?', [id]);
  return rows[0] ?? null;
}

export async function encontrarProducto(nombre) {
  const limpio = String(nombre ?? '').trim();
  if (!limpio) return null;
  if (/^\d+$/.test(limpio)) return obtenerProducto(Number(limpio));
  const consultas = [
    ['SELECT id, nombre, precio, disponible FROM productos WHERE LOWER(nombre) = LOWER(?) LIMIT 1', limpio],
    ['SELECT id, nombre, precio, disponible FROM productos WHERE nombre LIKE ? ORDER BY CHAR_LENGTH(nombre) LIMIT 1', `%${limpio}%`],
    ['SELECT p.id, p.nombre, p.precio, p.disponible FROM especialidades e JOIN productos p ON p.id = e.producto_id WHERE e.nombre LIKE ? LIMIT 1', `%${limpio}%`]
  ];
  for (const [sql, valor] of consultas) {
    const [rows] = await pool.query(sql, [valor]);
    if (rows[0]) return rows[0];
  }
  for (const palabra of limpio.split(/\s+/).filter((p) => p.length > 3)) {
    const [rows] = await pool.query(
      'SELECT id, nombre, precio, disponible FROM productos WHERE nombre LIKE ? ORDER BY CHAR_LENGTH(nombre) LIMIT 1',
      [`%${palabra}%`]
    );
    if (rows[0]) return rows[0];
  }
  return null;
}

export async function buscarPorId(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNAS} ${BASE} WHERE p.id = ?`, [id]);
  return rows;
}
