import { pool } from '../config/db.js';

export async function listarOpciones() {
  const [rows] = await pool.query('SELECT id, tipo, nombre, precio_extra FROM opciones_cafe ORDER BY tipo, id');
  const porTipo = (tipo) => rows.filter((r) => r.tipo === tipo).map(({ tipo: _t, ...o }) => o);
  return {
    tamanos: porTipo('tamano'),
    bases: porTipo('base'),
    leches: porTipo('leche'),
    extras: porTipo('extra'),
    endulzantes: porTipo('endulzante')
  };
}
