export function validarChat(req, res, next) {
  const { mensaje, historial } = req.body ?? {};
  if (typeof mensaje !== 'string' || !mensaje.trim()) return res.status(400).json({ error: 'El mensaje es obligatorio' });
  if (mensaje.length > 1000) return res.status(400).json({ error: 'El mensaje es demasiado largo' });
  const limpio = Array.isArray(historial)
    ? historial
        .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
        .slice(-10)
    : [];
  req.body = { mensaje: mensaje.trim(), historial: limpio };
  next();
}
