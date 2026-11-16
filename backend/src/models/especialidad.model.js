import { pool } from '../config/db.js';

export async function listarEspecialidades() {
  const [rows] = await pool.query('SELECT id, nombre, descripcion, imagen, precio FROM especialidades ORDER BY id');
  return rows;
}
