import { obtenerCarrito, agregarItem, cambiarCantidad, vaciarCarrito } from '../../models/carrito.model.js';
import { encontrarProducto } from '../../models/producto.model.js';
import { listarOpciones } from '../../models/opcion.model.js';
import { bs, texto, entero, resumenCarrito } from './util.js';

function elegir(opciones, nombre, porDefecto) {
  const buscado = texto(nombre).toLowerCase();
  if (!buscado) return porDefecto;
  return (
    opciones.find((o) => o.nombre.toLowerCase() === buscado) ||
    opciones.find((o) => o.nombre.toLowerCase().includes(buscado) || buscado.includes(o.nombre.toLowerCase().split(' (')[0])) ||
    porDefecto
  );
}

function carritoComo(tipo, carrito, prefijo = '') {
  return { tipo, datos: carrito, resumen: `${prefijo}${resumenCarrito(carrito)}` };
}

export default [
  {
    nombre: 'ver_carrito',
    descripcion: 'Muestra el carrito actual del cliente con sus productos y el total.',
    parametros: { type: 'object', properties: {} },
    async ejecutar(_args, { sesion }) {
      return carritoComo('carrito', await obtenerCarrito(sesion));
    }
  },
  {
    nombre: 'agregar_al_carrito',
    descripcion: 'Agrega uno o varios productos de la carta al carrito.',
    parametros: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              producto: { type: 'string', description: 'Nombre del producto tal como aparece en la carta.' },
              cantidad: { type: 'integer', minimum: 1 }
            },
            required: ['producto']
          }
        }
      },
      required: ['items']
    },
    async ejecutar({ items }, { sesion }) {
      const lista = Array.isArray(items) ? items : [];
      if (!lista.length) return { error: 'No se indicó ningún producto.' };
      const faltantes = [];
      let carrito = null;
      for (const item of lista) {
        const producto = await encontrarProducto(item.producto);
        if (!producto || !producto.disponible) {
          faltantes.push(texto(item.producto));
          continue;
        }
        carrito = await agregarItem(sesion, {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: producto.precio,
          cantidad: entero(item.cantidad, 1)
        });
      }
      if (!carrito) return { error: `No encontré en la carta: ${faltantes.join(', ')}. Sugiere buscar o ver el menú.` };
      const aviso = faltantes.length ? ` No se agregó (no está en la carta o está agotado): ${faltantes.join(', ')}.` : '';
      return { ...carritoComo('carrito', carrito, 'Agregado. '), resumen: `Agregado. ${resumenCarrito(carrito)}${aviso}` };
    }
  },
  {
    nombre: 'armar_cafe',
    descripcion: 'Arma un café a medida con las opciones de la base de datos y lo agrega al carrito. Los datos no indicados usan valores por defecto (mediano, espresso, leche entera, sin azúcar).',
    parametros: {
      type: 'object',
      properties: {
        tamano: { type: 'string' },
        base: { type: 'string' },
        leche: { type: 'string' },
        extras: { type: 'array', items: { type: 'string' } },
        endulzante: { type: 'string' },
        cantidad: { type: 'integer', minimum: 1 }
      }
    },
    async ejecutar(args, { sesion }) {
      const o = await listarOpciones();
      const tamano = elegir(o.tamanos, args.tamano, o.tamanos[1]);
      const base = elegir(o.bases, args.base, o.bases[0]);
      const leche = elegir(o.leches, args.leche, o.leches[1]);
      const endulzante = elegir(o.endulzantes, args.endulzante, o.endulzantes[0]);
      const extras = (Array.isArray(args.extras) ? args.extras : []).map((e) => elegir(o.extras, e, null)).filter(Boolean);
      const precio = [tamano, base, leche, endulzante, ...extras].reduce((s, x) => s + Number(x.precio_extra), 0);
      const detalle = [tamano.nombre, leche.nombre, endulzante.nombre, ...extras.map((e) => e.nombre)].join(' · ');
      const carrito = await agregarItem(sesion, {
        nombre: `Café a medida: ${base.nombre}`,
        precio_unitario: precio,
        cantidad: entero(args.cantidad, 1),
        detalle
      });
      return carritoComo('carrito', carrito, `Café a medida agregado (${base.nombre}, ${detalle}) a ${bs(precio)}. `);
    }
  },
  {
    nombre: 'quitar_del_carrito',
    descripcion: 'Quita un producto del carrito o reduce su cantidad.',
    parametros: {
      type: 'object',
      properties: {
        producto: { type: 'string' },
        cantidad: { type: 'integer', minimum: 1, description: 'Unidades a quitar; si se omite se quita completo.' }
      },
      required: ['producto']
    },
    async ejecutar({ producto, cantidad }, { sesion }) {
      const carrito = await obtenerCarrito(sesion);
      const buscado = texto(producto).toLowerCase();
      const item = carrito.items.find((i) => i.nombre.toLowerCase() === buscado) || carrito.items.find((i) => i.nombre.toLowerCase().includes(buscado));
      if (!item) return { error: `"${producto}" no está en el carrito.`, tipo: 'carrito', datos: carrito };
      const nueva = cantidad ? Math.max(item.cantidad - entero(cantidad, 1), 0) : 0;
      return carritoComo('carrito', await cambiarCantidad(sesion, item.id, nueva), 'Actualizado. ');
    }
  },
  {
    nombre: 'vaciar_carrito',
    descripcion: 'Vacía el carrito por completo.',
    parametros: { type: 'object', properties: {} },
    async ejecutar(_args, { sesion }) {
      return carritoComo('carrito', await vaciarCarrito(sesion), 'Carrito vaciado. ');
    }
  },
  {
    nombre: 'iniciar_checkout',
    descripcion: 'Abre el formulario de pago en el chat para que el cliente pague su carrito (tarjeta, QR o efectivo).',
    parametros: { type: 'object', properties: {} },
    async ejecutar(_args, { sesion }) {
      const carrito = await obtenerCarrito(sesion);
      if (!carrito.items.length) return { error: 'El carrito está vacío; ofrece agregar productos primero.' };
      return carritoComo('checkout', carrito, 'Formulario de pago mostrado al cliente. ');
    }
  }
];
