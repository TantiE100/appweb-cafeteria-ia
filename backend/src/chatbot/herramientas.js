import { obtenerCafeteria } from '../models/cafeteria.model.js';
import { listarServicios } from '../models/servicio.model.js';
import { listarEspecialidades } from '../models/especialidad.model.js';
import { listarPreciosPorCategoria, buscarProductos, encontrarProducto } from '../models/producto.model.js';
import { listarOpciones } from '../models/opcion.model.js';
import { crearPedido, obtenerPedido, cancelarPedido } from '../models/pedido.model.js';
import { crearReserva, obtenerReserva } from '../models/reserva.model.js';
import { crearContacto } from '../models/contacto.model.js';

const MODALIDADES = ['mesa', 'llevar', 'delivery'];

function bs(precio) {
  return `Bs ${Number(precio).toFixed(2)}`;
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : valor == null ? '' : String(valor).trim();
}

function entero(valor, porDefecto) {
  const n = Number.parseInt(valor, 10);
  return Number.isFinite(n) && n > 0 ? n : porDefecto;
}

function elegir(opciones, nombre, porDefecto) {
  const buscado = texto(nombre).toLowerCase();
  if (!buscado) return porDefecto;
  return (
    opciones.find((o) => o.nombre.toLowerCase() === buscado) ||
    opciones.find((o) => o.nombre.toLowerCase().includes(buscado) || buscado.includes(o.nombre.toLowerCase().split(' ')[0])) ||
    porDefecto
  );
}

function lista(valor) {
  if (Array.isArray(valor)) return valor;
  if (typeof valor === 'string' && valor.trim()) return valor.split(',');
  return [];
}

export const HERRAMIENTAS = {
  ver_menu: {
    descripcion: 'Muestra la carta completa con precios, o solo una categoría.',
    argumentos: '{ "categoria"?: string }',
    async ejecutar({ categoria }) {
      const menu = await listarPreciosPorCategoria(texto(categoria) || undefined);
      const datos = menu.length ? menu : await listarPreciosPorCategoria();
      const resumen = datos.map((g) => `${g.categoria}: ${g.productos.map((p) => `${p.nombre} ${bs(p.precio)}`).join(', ')}`).join('\n');
      return { tipo: 'menu', datos, resumen };
    }
  },
  buscar_productos: {
    descripcion: 'Busca productos por nombre, ingrediente, gusto (dulce, fuerte, frio, chocolate, vegetariano, tradicional, sin cafe), categoría o precio máximo. Úsala también para recomendar.',
    argumentos: '{ "texto"?: string, "categoria"?: string, "precio_max"?: number }',
    async ejecutar({ texto: t, categoria, precio_max }) {
      const datos = await buscarProductos({ texto: texto(t), categoria: texto(categoria), precioMax: precio_max });
      const resumen = datos.length
        ? datos.map((p) => `${p.nombre} (${p.categoria}) ${bs(p.precio)}: ${p.descripcion}`).join('\n')
        : 'No se encontraron productos con ese criterio.';
      return { tipo: 'productos', datos, resumen };
    }
  },
  ver_especialidades: {
    descripcion: 'Muestra las especialidades de la casa.',
    argumentos: '{}',
    async ejecutar() {
      const datos = await listarEspecialidades();
      return { tipo: 'especialidades', datos, resumen: datos.map((e) => `${e.nombre} ${bs(e.precio)}: ${e.descripcion}`).join('\n') };
    }
  },
  ver_servicios: {
    descripcion: 'Lista los servicios de la cafetería (delivery, eventos, coworking, talleres, etc.).',
    argumentos: '{}',
    async ejecutar() {
      const datos = await listarServicios();
      return { tipo: 'servicios', datos, resumen: datos.map((s) => `${s.nombre}: ${s.descripcion}`).join('\n') };
    }
  },
  info_cafeteria: {
    descripcion: 'Dirección, teléfono, email, horario e historia de la cafetería.',
    argumentos: '{}',
    async ejecutar() {
      const datos = await obtenerCafeteria();
      return {
        tipo: 'info',
        datos,
        resumen: `Dirección: ${datos.direccion}. Teléfono: ${datos.telefono}. Email: ${datos.email}. Horario: ${datos.horario}. Historia: ${datos.historia}`
      };
    }
  },
  ver_opciones_cafe: {
    descripcion: 'Muestra las opciones para armar un café a medida: tamaños, bases, leches, extras y endulzantes.',
    argumentos: '{}',
    async ejecutar() {
      const datos = await listarOpciones();
      const linea = (titulo, ops) => `${titulo}: ${ops.map((o) => `${o.nombre} (+${bs(o.precio_extra)})`).join(', ')}`;
      return {
        tipo: 'opciones',
        datos,
        resumen: [
          linea('Tamaños', datos.tamanos),
          linea('Bases', datos.bases),
          linea('Leches', datos.leches),
          linea('Extras', datos.extras),
          linea('Endulzantes', datos.endulzantes)
        ].join('\n')
      };
    }
  },
  armar_cafe: {
    descripcion: 'Crea un pedido con un café personalizado. Si el usuario no dio algún dato, usa los valores por defecto.',
    argumentos: '{ "cliente"?: string, "tamano"?: string, "base"?: string, "leche"?: string, "extras"?: string[], "endulzante"?: string, "cantidad"?: number, "modalidad"?: "mesa"|"llevar"|"delivery" }',
    async ejecutar(args) {
      const opciones = await listarOpciones();
      const tamano = elegir(opciones.tamanos, args.tamano, opciones.tamanos[1]);
      const base = elegir(opciones.bases, args.base, opciones.bases[0]);
      const leche = elegir(opciones.leches, args.leche, opciones.leches[1]);
      const endulzante = elegir(opciones.endulzantes, args.endulzante, opciones.endulzantes[0]);
      const extras = lista(args.extras)
        .map((e) => elegir(opciones.extras, e, null))
        .filter(Boolean);
      const partes = [tamano, base, leche, endulzante, ...extras];
      const precio = partes.reduce((suma, o) => suma + Number(o.precio_extra), 0);
      const detalle = [tamano.nombre, leche.nombre, endulzante.nombre, ...extras.map((e) => e.nombre)].join(' · ');
      const pedido = await crearPedido({
        cliente: texto(args.cliente) || 'Invitado',
        modalidad: MODALIDADES.includes(args.modalidad) ? args.modalidad : 'llevar',
        items: [{ producto: `Café a medida: ${base.nombre}`, cantidad: entero(args.cantidad, 1), precio_unitario: precio, detalle }]
      });
      return {
        tipo: 'pedido',
        datos: pedido,
        resumen: `Pedido ${pedido.codigo} creado para ${pedido.cliente}: ${base.nombre} (${detalle}), total ${bs(pedido.total)}, estado ${pedido.estado}.`
      };
    }
  },
  crear_pedido: {
    descripcion: 'Crea un pedido con productos de la carta.',
    argumentos: '{ "cliente"?: string, "items": [{ "producto": string, "cantidad"?: number, "nota"?: string }], "modalidad"?: "mesa"|"llevar"|"delivery" }',
    async ejecutar(args) {
      const pedidos = Array.isArray(args.items) ? args.items : args.producto ? [{ producto: args.producto, cantidad: args.cantidad }] : [];
      if (!pedidos.length) return { error: 'No se indicó ningún producto. Pregunta al cliente qué desea pedir.' };
      const items = [];
      const noEncontrados = [];
      for (const item of pedidos) {
        const nombre = typeof item === 'string' ? item : item.producto;
        const producto = await encontrarProducto(nombre);
        if (!producto || !producto.disponible) {
          noEncontrados.push(texto(nombre));
          continue;
        }
        items.push({
          producto_id: producto.id,
          producto: producto.nombre,
          cantidad: entero(item.cantidad, 1),
          precio_unitario: Number(producto.precio),
          detalle: texto(item.nota) || null
        });
      }
      if (!items.length) return { error: `No encontré en la carta: ${noEncontrados.join(', ')}. Ofrece ver el menú.` };
      const pedido = await crearPedido({
        cliente: texto(args.cliente) || 'Invitado',
        modalidad: MODALIDADES.includes(args.modalidad) ? args.modalidad : 'llevar',
        items
      });
      const aviso = noEncontrados.length ? ` No se agregó (no está en la carta o está agotado): ${noEncontrados.join(', ')}.` : '';
      return {
        tipo: 'pedido',
        datos: pedido,
        resumen: `Pedido ${pedido.codigo} creado para ${pedido.cliente}: ${pedido.items.map((i) => `${i.cantidad} x ${i.producto}`).join(', ')}. Total ${bs(pedido.total)}.${aviso}`
      };
    }
  },
  ver_pedido: {
    descripcion: 'Consulta el estado de un pedido por su código (formato SC-123456).',
    argumentos: '{ "codigo": string }',
    async ejecutar({ codigo }) {
      const pedido = await obtenerPedido(codigo);
      if (!pedido) return { error: `No existe un pedido con el código ${texto(codigo) || '(sin código)'}. Pide el código al cliente.` };
      return { tipo: 'pedido', datos: pedido, resumen: `Pedido ${pedido.codigo} de ${pedido.cliente}: estado ${pedido.estado}, total ${bs(pedido.total)}.` };
    }
  },
  cancelar_pedido: {
    descripcion: 'Cancela un pedido por su código si aún no está listo.',
    argumentos: '{ "codigo": string }',
    async ejecutar({ codigo }) {
      const resultado = await cancelarPedido(codigo);
      if (resultado.error) return { error: resultado.error, tipo: resultado.pedido ? 'pedido' : undefined, datos: resultado.pedido };
      return { tipo: 'pedido', datos: resultado.pedido, resumen: `Pedido ${resultado.pedido.codigo} cancelado.` };
    }
  },
  reservar_mesa: {
    descripcion: 'Reserva una mesa. Necesita nombre, fecha (AAAA-MM-DD), hora (HH:MM) y número de personas.',
    argumentos: '{ "nombre": string, "fecha": string, "hora": string, "personas": number, "telefono"?: string }',
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
      if (faltan.length) return { error: `Para reservar falta: ${faltan.join(', ')}. Pídeselo al cliente.` };
      if (personas > 20) return { error: 'Para más de 20 personas se reserva como evento; sugiere llamar a la cafetería.' };
      const reserva = await crearReserva({ nombre, telefono: texto(args.telefono), fecha, hora, personas });
      return {
        tipo: 'reserva',
        datos: reserva,
        resumen: `Reserva ${reserva.codigo} confirmada a nombre de ${reserva.nombre} para ${reserva.personas} personas el ${reserva.fecha} a las ${reserva.hora}.`
      };
    }
  },
  ver_reserva: {
    descripcion: 'Consulta una reserva por su código (formato R-123456).',
    argumentos: '{ "codigo": string }',
    async ejecutar({ codigo }) {
      const reserva = await obtenerReserva(codigo);
      if (!reserva) return { error: `No existe una reserva con el código ${texto(codigo) || '(sin código)'}.` };
      return { tipo: 'reserva', datos: reserva, resumen: `Reserva ${reserva.codigo}: ${reserva.personas} personas el ${reserva.fecha} a las ${reserva.hora}, ${reserva.estado}.` };
    }
  },
  dejar_mensaje: {
    descripcion: 'Envía un mensaje, sugerencia o reclamo al equipo de la cafetería. Necesita nombre, email y mensaje.',
    argumentos: '{ "nombre": string, "email": string, "mensaje": string }',
    async ejecutar(args) {
      const nombre = texto(args.nombre);
      const email = texto(args.email);
      const mensaje = texto(args.mensaje);
      if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || mensaje.length < 5) {
        return { error: 'Para dejar un mensaje se necesita nombre, un email válido y el mensaje. Pídeselos al cliente.' };
      }
      const id = await crearContacto({ nombre, email, telefono: null, mensaje });
      return { resumen: `Mensaje #${id} registrado. El equipo responderá a ${email}.` };
    }
  }
};

export function catalogoHerramientas() {
  return Object.entries(HERRAMIENTAS)
    .map(([nombre, h]) => `- ${nombre}: ${h.descripcion} Argumentos: ${h.argumentos}`)
    .join('\n');
}
