import { Component, inject, output } from '@angular/core';
import { CarritoService } from '../core/services/carrito.service';
import { SitioService } from '../core/services/sitio.service';
import { Icono } from './icono';

@Component({
  selector: 'app-carrito-lista',
  imports: [Icono],
  template: `
    @if (carrito().items.length === 0) {
      <div class="flex flex-col items-center gap-3 py-8 text-center text-sm text-suave">
        <app-icono nombre="shopping-cart" [tamano]="28" />
        <p>{{ t('carrito.vacio') }}</p>
      </div>
    } @else {
      <ul class="divide-y divide-borde">
        @for (i of carrito().items; track i.id) {
          <li class="flex items-center gap-3 py-3">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ i.nombre }}</p>
              @if (i.detalle) {
                <p class="truncate text-xs text-suave">{{ i.detalle }}</p>
              }
              <p class="mt-0.5 text-xs text-oro">{{ precio(i.subtotal) }}</p>
            </div>
            <div class="flex items-center gap-1 rounded-full border border-borde p-0.5">
              <button type="button" class="paso" [attr.aria-label]="t('carrito.disminuir')" (click)="cambiar(i.id, i.cantidad - 1)">
                <app-icono nombre="minus" [tamano]="14" />
              </button>
              <span class="w-5 text-center text-xs font-semibold">{{ i.cantidad }}</span>
              <button type="button" class="paso" [attr.aria-label]="t('carrito.aumentar')" (click)="cambiar(i.id, i.cantidad + 1)">
                <app-icono nombre="plus" [tamano]="14" />
              </button>
            </div>
            <button type="button" class="paso" [attr.aria-label]="t('carrito.quitar')" (click)="quitar(i.id)">
              <app-icono nombre="trash-2" [tamano]="15" />
            </button>
          </li>
        }
      </ul>
      <div class="mt-3 flex items-baseline justify-between border-t border-borde pt-4">
        <span class="text-sm text-suave">{{ t('carrito.total') }}</span>
        <span class="text-lg font-semibold text-oro">{{ precio(carrito().total) }}</span>
      </div>
      <div class="mt-4 flex gap-2">
        <button type="button" class="btn-borde px-4 py-2.5 text-xs" (click)="vaciar()">{{ t('carrito.vaciar') }}</button>
        <button type="button" class="btn-oro flex-1 py-2.5 text-xs" [class.latido]="resaltar()" (click)="checkout.emit()">
          {{ t('carrito.checkout') }}
        </button>
      </div>
    }
  `,
})
export class CarritoLista {
  private readonly servicio = inject(CarritoService);
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  protected readonly carrito = this.servicio.carrito;
  protected readonly resaltar = this.servicio.resaltar;
  readonly checkout = output<void>();

  protected cambiar(id: number, cantidad: number): void {
    this.servicio.cambiar(id, Math.max(0, cantidad)).subscribe();
  }

  protected quitar(id: number): void {
    this.servicio.quitar(id).subscribe();
  }

  protected vaciar(): void {
    this.servicio.vaciar().subscribe();
  }
}
