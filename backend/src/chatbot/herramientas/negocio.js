import { obtenerCafeteria } from '../../models/cafeteria.model.js';
import { listarServicios } from '../../models/servicio.model.js';
import { listarEspecialidades } from '../../models/especialidad.model.js';
import { bs } from './util.js';

export default [
  {
    nombre: 'info_cafeteria',
    descripcion: 'Devuelve dirección, teléfono, email, horario e historia de la cafetería.',
    parametros: { type: 'object', properties: {} },
    async ejecutar() {
      const c = await obtenerCafeteria();
      return {
        tipo: 'info',
        datos: c,
        resumen: `Dirección: ${c.direccion}. Teléfono: ${c.telefono}. Email: ${c.email}. Horario: ${c.horario}. Historia: ${c.historia}`
      };
    }
  },
  {
    nombre: 'ver_servicios',
    descripcion: 'Lista los servicios que ofrece la cafetería (delivery, eventos, coworking, talleres, etc.).',
    parametros: { type: 'object', properties: {} },
    async ejecutar() {
      const datos = await listarServicios();
      return { tipo: 'servicios', datos, resumen: datos.map((s) => `${s.nombre}: ${s.descripcion}`).join('\n') };
    }
  },
  {
    nombre: 'ver_especialidades',
    descripcion: 'Muestra las especialidades de la casa con foto y precio.',
    parametros: { type: 'object', properties: {} },
    async ejecutar() {
      const datos = await listarEspecialidades();
      return { tipo: 'especialidades', datos, resumen: datos.map((e) => `${e.nombre} ${bs(e.precio)}: ${e.descripcion}`).join('\n') };
    }
  }
];
