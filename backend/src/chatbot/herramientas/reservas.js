import { crearReserva, obtenerReserva } from '../../models/reserva.model.js';
import { texto, entero } from './util.js';

export default [
  {
    nombre: 'reservar_mesa',
    descripcion: 'Reserva una mesa. Requiere nombre, fecha (AAAA-MM-DD), hora (HH:MM) y número de personas.',
    parametros: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        fecha: { type: 'string', description: 'AAAA-MM-DD' },
        hora: { type: 'string', description: 'HH:MM en 24 horas' },
        personas: { type: 'integer', minimum: 1 },
        telefono: { type: 'string' }
      },
      required: ['nombre', 'fecha', 'hora', 'personas']
    },
    async ejecutar(args) {
      const nombre = texto(args.nombre);
      const fecha = texto(args.fecha);
      const hora = texto(args.hora);
      const personas = entero(args.personas, 0);
      const faltan = [];
      if (!nombre) faltan.push('nombre');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) faltan.push('fecha');
      if (!/^\d{1,2}:\d{2}$/.test(hora)) faltan.push('hora');
      if (!personas) faltan.push('número de personas');
      if (faltan.length) return { error: `Para reservar falta: ${faltan.join(', ')}.` };
      if (personas > 20) return { error: 'Para más de 20 personas se organiza como evento; sugiere llamar a la cafetería.' };
      const r = await crearReserva({ nombre, telefono: texto(args.telefono), fecha, hora, personas });
      return { tipo: 'reserva', datos: r, resumen: `Reserva ${r.codigo} confirmada a nombre de ${r.nombre} para ${r.personas} personas el ${r.fecha} a las ${r.hora}.` };
    }
  },
  {
    nombre: 'ver_reserva',
    descripcion: 'Consulta una reserva por su código (R-123456).',
    parametros: { type: 'object', properties: { codigo: { type: 'string' } }, required: ['codigo'] },
    async ejecutar({ codigo }) {
      const r = await obtenerReserva(codigo);
      if (!r) return { error: `No existe una reserva con el código ${texto(codigo)}.` };
      return { tipo: 'reserva', datos: r, resumen: `Reserva ${r.codigo}: ${r.personas} personas el ${r.fecha} a las ${r.hora}, ${r.estado}.` };
    }
  }
];
