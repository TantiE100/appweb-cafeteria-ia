export function requerirSesion(req, res, next) {
  const sesion = String(req.get('X-Sesion') ?? '').trim();
  if (!/^[A-Za-z0-9-]{8,64}$/.test(sesion)) return res.status(400).json({ error: 'Falta el header X-Sesion' });
  req.sesion = sesion;
  next();
}
