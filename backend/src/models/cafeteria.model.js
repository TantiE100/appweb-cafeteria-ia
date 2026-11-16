import { pool } from '../config/db.js';

export async function obtenerCafeteria() {
  const [rows] = await pool.query('SELECT * FROM cafeteria LIMIT 1');
  return rows[0] ?? null;
}
