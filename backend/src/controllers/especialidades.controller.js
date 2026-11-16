import { listarEspecialidades } from '../models/especialidad.model.js';

export async function getEspecialidades(req, res) {
  res.json(await listarEspecialidades());
}
