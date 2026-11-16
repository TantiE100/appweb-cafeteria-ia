import { pool } from '../config/db.js';
import { obtenerCafeteria } from './cafeteria.model.js';

export async function obtenerAgente() {
  const [rows] = await pool.query('SELECT nombre, rol, personalidad, reglas FROM agente LIMIT 1');
  return rows[0] ?? null;
}

export async function obtenerSitio() {
  const [cafeteria, agente, [textos], [navegacion], [sugerencias]] = await Promise.all([
    obtenerCafeteria(),
    obtenerAgente(),
    pool.query('SELECT clave, valor FROM textos'),
    pool.query('SELECT etiqueta, ruta, icono FROM navegacion ORDER BY orden'),
    pool.query('SELECT texto, icono FROM sugerencias_chat ORDER BY orden')
  ]);
  return {
    cafeteria,
    textos: Object.fromEntries(textos.map((t) => [t.clave, t.valor])),
    navegacion,
    sugerencias,
    agente: agente ? { nombre: agente.nombre, rol: agente.rol } : null
  };
}
