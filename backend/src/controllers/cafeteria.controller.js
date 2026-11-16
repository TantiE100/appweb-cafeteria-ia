import { obtenerCafeteria } from '../models/cafeteria.model.js';
import { listarGaleria } from '../models/galeria.model.js';

export async function getCafeteria(req, res) {
  const cafeteria = await obtenerCafeteria();
  if (!cafeteria) return res.status(404).json({ error: 'Cafetería no encontrada' });
  res.json(cafeteria);
}

export async function getNosotros(req, res) {
  const [cafeteria, galeria] = await Promise.all([obtenerCafeteria(), listarGaleria()]);
  if (!cafeteria) return res.status(404).json({ error: 'Cafetería no encontrada' });
  res.json({ ...cafeteria, galeria });
}

export async function getGaleria(req, res) {
  res.json(await listarGaleria());
}
