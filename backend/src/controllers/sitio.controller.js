import { obtenerSitio } from '../models/sitio.model.js';

export async function getSitio(req, res) {
  res.json(await obtenerSitio());
}
