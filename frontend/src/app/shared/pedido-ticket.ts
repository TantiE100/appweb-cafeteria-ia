import { Component, inject, input } from '@angular/core';
import { Pedido } from '../core/models/carrito.model';
import { SitioService } from '../core/services/sitio.service';
import { Icono } from './icono';

@Component({
  selector: 'app-pedido-ticket',
  imports: [Icono],
  template: `
    @if (pedido(); as p) {
      <div class="rounded-2xl border border-borde bg-superficie p-4">
        <div class="flex items-center gap-2 text-suave">
          <app-icono nombre="receipt" [tamano]="16" />
          <span class="text-xs font-medium">{{ t('pedido.titulo') }}</span>
        </div>
        <p class="mt-2 text-2xl font-semibold tracking-widest text-oro">{{ p.codigo }}</p>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full border border-oro/40 px-2.5 py-1 font-medium text-oro">{{ p.estado }}</span>
          <span class="text-suave">{{ t('pedido.estado') }}</span>
        </div>
        <ul class="mt-4 space-y-1.5 border-t border-borde pt-3 text-sm">
          @for (i of p.items; track $index) {
            <li class="flex justify-between gap-3">
              <span class="min-w-0 truncate">{{ i.cantidad }} x {{ i.producto }}</span>
              <span class="text-suave">{{ precio(i.subtotal) }}</span>
            </li>
          }
        </ul>
        <dl class="mt-3 space-y-1 border-t border-borde pt-3 text-xs">
          <div class="flex justify-between">
            <dt class="text-suave">{{ t('pedido.pago') }}</dt>
            <dd>{{ p.metodo_pago }} · {{ p.pago_estado }}</dd>
          </div>
          <div class="flex justify-between text-sm">
            <dt class="text-suave">{{ t('pedido.total') }}</dt>
            <dd class="font-semibold text-oro">{{ precio(p.total) }}</dd>
          </div>
        </dl>
      </div>
    }
  `,
})
export class PedidoTicket {
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  readonly pedido = input<Pedido | null>(null);
}
