import { pool } from '../config/db.js';
import { generarCodigo } from './pedido.model.js';

const COLUMNAS = "id, codigo, nombre, telefono, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, TIME_FORMAT(hora, '%H:%i') AS hora, personas, estado";

export async function crearReserva({ nombre, telefono, fecha, hora, personas }) {
  const codigo = generarCodigo('R');
  await pool.query(
    'INSERT INTO reservas (codigo, nombre, telefono, fecha, hora, personas) VALUES (?, ?, ?, ?, ?, ?)',
    [codigo, nombre, telefono || null, fecha, hora, personas]
  );
  return obtenerReserva(codigo);
}

export async function obtenerReserva(codigo) {
  const [rows] = await pool.query(`SELECT ${COLUMNAS} FROM reservas WHERE codigo = ?`, [String(codigo ?? '').trim().toUpperCase()]);
  return rows[0] ?? null;
}
