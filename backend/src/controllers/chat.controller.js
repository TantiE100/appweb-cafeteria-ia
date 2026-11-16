import { responderChat } from '../chatbot/agente.js';

export async function postChat(req, res) {
  const { mensaje, historial } = req.body;
  res.json(await responderChat(mensaje, historial));
}
