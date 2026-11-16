import { pool } from '../config/db.js';

export async function crearContacto({ nombre, email, telefono, mensaje }) {
  const [result] = await pool.query(
    'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
    [nombre, email, telefono || null, mensaje]
  );
  return result.insertId;
}
