import { listarServicios } from '../models/servicio.model.js';

export async function getServicios(req, res) {
  res.json(await listarServicios());
}
