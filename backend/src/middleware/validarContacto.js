const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarContacto(req, res, next) {
  const { nombre, email, telefono, mensaje } = req.body ?? {};
  const detalles = [];
  if (typeof nombre !== 'string' || nombre.trim().length < 2) detalles.push('El nombre debe tener al menos 2 caracteres.');
  if (typeof email !== 'string' || !EMAIL.test(email.trim())) detalles.push('El email no es válido.');
  if (telefono && !/^[+\d\s-]{6,20}$/.test(String(telefono))) detalles.push('El teléfono no es válido.');
  if (typeof mensaje !== 'string' || mensaje.trim().length < 10) detalles.push('El mensaje debe tener al menos 10 caracteres.');
  if (detalles.length) return res.status(400).json({ error: 'Datos de contacto inválidos', detalles });
  req.body = { nombre: nombre.trim(), email: email.trim(), telefono: telefono ? String(telefono).trim() : null, mensaje: mensaje.trim() };
  next();
}
