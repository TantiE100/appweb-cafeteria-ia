import { listarPreciosPorCategoria, paginarMenu } from '../models/producto.model.js';

export async function getPrecios(req, res) {
  res.json(await listarPreciosPorCategoria());
}

export async function getMenu(req, res) {
  const { categoria, pagina, por_pagina } = req.query;
  res.json(await paginarMenu({ categoria, pagina, porPagina: por_pagina }));
}
