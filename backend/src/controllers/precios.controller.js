import { listarPreciosPorCategoria } from '../models/producto.model.js';

export async function getPrecios(req, res) {
  res.json(await listarPreciosPorCategoria());
}
