import { crearContacto } from '../../models/contacto.model.js';
import { texto } from './util.js';

export default [
  {
    nombre: 'dejar_mensaje',
    descripcion: 'Envía un mensaje, sugerencia o reclamo al equipo. Requiere nombre, email y mensaje.',
    parametros: {
      type: 'object',
      properties: { nombre: { type: 'string' }, email: { type: 'string' }, mensaje: { type: 'string' } },
      required: ['nombre', 'email', 'mensaje']
    },
    async ejecutar(args) {
      const nombre = texto(args.nombre);
      const email = texto(args.email);
      const mensaje = texto(args.mensaje);
      if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || mensaje.length < 5) {
        return { error: 'Se necesita nombre, un email válido y el mensaje.' };
      }
      const id = await crearContacto({ nombre, email, telefono: null, mensaje });
      return { resumen: `Mensaje #${id} registrado; el equipo responderá a ${email}.` };
    }
  }
];
