import { paginarMenu, buscarProductos } from '../../models/producto.model.js';
import { listarOpciones } from '../../models/opcion.model.js';
import { bs, texto, entero } from './util.js';

export default [
  {
    nombre: 'ver_menu',
    descripcion: 'Muestra la carta paginada (6 productos por página), opcionalmente filtrada por categoría. La tarjeta del chat permite pasar de página.',
    parametros: {
      type: 'object',
      properties: {
        categoria: { type: 'string', description: 'Nombre o parte del nombre de la categoría, por ejemplo "frías" o "repostería".' },
        pagina: { type: 'integer', minimum: 1 }
      }
    },
    async ejecutar({ categoria, pagina }) {
      const datos = await paginarMenu({ categoria: texto(categoria) || undefined, pagina: entero(pagina, 1) });
      return {
        tipo: 'menu',
        datos,
        resumen: `Página ${datos.pagina} de ${datos.total_paginas} (${datos.total} productos${datos.categoria ? ` en ${datos.categoria}` : ''}). Categorías: ${datos.categorias.join(', ')}. ${datos.productos.map((p) => `${p.nombre} ${bs(p.precio)}`).join(', ')}.`
      };
    }
  },
  {
    nombre: 'buscar_productos',
    descripcion: 'Busca productos por nombre, ingrediente o gusto (dulce, fuerte, frio, chocolate, vegetariano, tradicional, sin cafe), categoría o precio máximo. Úsala para recomendar.',
    parametros: {
      type: 'object',
      properties: {
        texto: { type: 'string' },
        categoria: { type: 'string' },
        precio_max: { type: 'number' }
      }
    },
    async ejecutar({ texto: t, categoria, precio_max }) {
      const datos = await buscarProductos({ texto: texto(t), categoria: texto(categoria), precioMax: precio_max });
      return {
        tipo: 'productos',
        datos,
        resumen: datos.length ? datos.map((p) => `${p.nombre} (${p.categoria}) ${bs(p.precio)}: ${p.descripcion}`).join('\n') : 'No se encontraron productos con ese criterio.'
      };
    }
  },
  {
    nombre: 'ver_opciones_cafe',
    descripcion: 'Muestra las opciones para armar un café a medida: tamaños, bases, leches, extras y endulzantes con su precio.',
    parametros: { type: 'object', properties: {} },
    async ejecutar() {
      const datos = await listarOpciones();
      const linea = (titulo, ops) => `${titulo}: ${ops.map((o) => `${o.nombre} (+${bs(o.precio_extra)})`).join(', ')}`;
      return {
        tipo: 'opciones',
        datos,
        resumen: [linea('Tamaños', datos.tamanos), linea('Bases', datos.bases), linea('Leches', datos.leches), linea('Extras', datos.extras), linea('Endulzantes', datos.endulzantes)].join('\n')
      };
    }
  }
];
