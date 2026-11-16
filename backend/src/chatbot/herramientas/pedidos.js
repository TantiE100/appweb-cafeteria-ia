import { obtenerPedido, cancelarPedido, ultimoPedidoDeSesion } from '../../models/pedido.model.js';
import { realizarCheckout } from '../../services/checkout.service.js';
import { bs, texto } from './util.js';

function resumenPedido(p) {
  return `Pedido ${p.codigo} de ${p.cliente}: ${p.items.map((i) => `${i.cantidad} x ${i.producto}`).join(', ')}. Total ${bs(p.total)}. Estado ${p.estado}. Pago ${p.metodo_pago} ${p.pago_estado}.`;
}

async function buscar(codigo, sesion) {
  return texto(codigo) ? obtenerPedido(codigo) : ultimoPedidoDeSesion(sesion);
}

export default [
  {
    nombre: 'confirmar_pedido',
    descripcion: 'Convierte el carrito en un pedido pagando en efectivo o QR. Para pagar con tarjeta usa iniciar_checkout.',
    parametros: {
      type: 'object',
      properties: {
        cliente: { type: 'string' },
        telefono: { type: 'string' },
        modalidad: { type: 'string', enum: ['mesa', 'llevar', 'delivery'] },
        metodo_pago: { type: 'string', enum: ['efectivo', 'qr'] }
      },
      required: ['cliente', 'modalidad', 'metodo_pago']
    },
    async ejecutar(args, { sesion }) {
      try {
        const pedido = await realizarCheckout(sesion, args);
        return { tipo: 'pedido', datos: pedido, resumen: `Pedido creado. ${resumenPedido(pedido)}` };
      } catch (err) {
        if (err.publico) return { error: err.message };
        throw err;
      }
    }
  },
  {
    nombre: 'ver_pedido',
    descripcion: 'Consulta un pedido por su código (SC-123456). Sin código, devuelve el último pedido del cliente.',
    parametros: { type: 'object', properties: { codigo: { type: 'string' } } },
    async ejecutar({ codigo }, { sesion }) {
      const pedido = await buscar(codigo, sesion);
      if (!pedido) return { error: 'No encontré ese pedido. Pide el código al cliente.' };
      return { tipo: 'pedido', datos: pedido, resumen: resumenPedido(pedido) };
    }
  },
  {
    nombre: 'cancelar_pedido',
    descripcion: 'Cancela un pedido si aún no está listo. Sin código, cancela el último pedido del cliente. Si estaba pagado se reembolsa.',
    parametros: { type: 'object', properties: { codigo: { type: 'string' } } },
    async ejecutar({ codigo }, { sesion }) {
      const pedido = await buscar(codigo, sesion);
      if (!pedido) return { error: 'No encontré ese pedido. Pide el código al cliente.' };
      const r = await cancelarPedido(pedido.codigo);
      if (r.error) return { error: r.error, tipo: 'pedido', datos: r.pedido };
      return { tipo: 'pedido', datos: r.pedido, resumen: `Cancelado. ${resumenPedido(r.pedido)}` };
    }
  }
];
