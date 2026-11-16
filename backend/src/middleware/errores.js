export function noEncontrado(req, res) {
  res.status(404).json({ error: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
}

export function manejarErrores(err, req, res, next) {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
  if (err.code === 'OLLAMA_NO_DISPONIBLE') return res.status(503).json({ error: 'El asistente no está disponible ahora. Intenta en un momento.' });
  if (err.code === 'OLLAMA_ERROR') return res.status(502).json({ error: 'El asistente no pudo responder. Intenta de nuevo.' });
  if (err.code === 'ECONNREFUSED' || err.code?.startsWith?.('ER_')) return res.status(503).json({ error: 'La base de datos no está disponible' });
  res.status(500).json({ error: 'Error interno del servidor' });
}
