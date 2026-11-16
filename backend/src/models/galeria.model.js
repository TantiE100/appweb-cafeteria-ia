import { pool } from '../config/db.js';

export async function listarGaleria() {
  const [rows] = await pool.query('SELECT id, titulo, imagen FROM galeria ORDER BY id');
  return rows;
}
