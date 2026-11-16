import { pool } from '../config/db.js';

export async function listarServicios() {
  const [rows] = await pool.query('SELECT id, nombre, descripcion, icono FROM servicios ORDER BY orden');
  return rows;
}
