import { crearContacto } from '../models/contacto.model.js';

export async function postContacto(req, res) {
  const id = await crearContacto(req.body);
  res.status(201).json({ id, mensaje: '¡Gracias! Recibimos tu mensaje y te responderemos pronto.' });
}
