import { Component, inject, input, linkedSignal } from '@angular/core';
import { CarritoService } from '../core/services/carrito.service';
import { SitioService } from '../core/services/sitio.service';
import { CarritoLista } from './carrito-lista';
import { CheckoutForm } from './checkout-form';
import { Icono } from './icono';

@Component({
  selector: 'app-carrito-flujo',
  imports: [CarritoLista, CheckoutForm, Icono],
  template: `
    <div class="tarjeta-chat">
      <button type="button" class="flex w-full cursor-pointer items-center gap-3 text-left" [attr.aria-expanded]="abierto()" (click)="abierto.set(!abierto())">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-oro/10 text-oro">
          <app-icono nombre="shopping-cart" [tamano]="17" />
        </span>
        <span class="flex-1">
          <span class="block text-sm font-semibold">{{ t('carrito.titulo') }}</span>
          <span class="block text-xs text-suave">{{ carrito().cantidad }} · {{ precio(carrito().total) }}</span>
        </span>
        <span class="giro text-suave" [class.giro-abierto]="abierto()">
          <app-icono nombre="chevron-down" [tamano]="18" />
        </span>
      </button>

      <div class="plegable" [class.plegable-abierto]="abierto() && !pagando()">
        <div>
          <div class="pt-3">
            <app-carrito-lista (checkout)="pagando.set(true)" />
          </div>
        </div>
      </div>

      <div class="plegable" [class.plegable-abierto]="abierto() && pagando()">
        <div>
          <div class="pt-3">
            <app-checkout-form [conVolver]="true" (volver)="pagando.set(false)" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CarritoFlujo {
  readonly iniciarPagando = input(false);
  private readonly servicio = inject(CarritoService);
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  protected readonly carrito = this.servicio.carrito;
  protected readonly abierto = linkedSignal(() => true);
  protected readonly pagando = linkedSignal(() => this.iniciarPagando());
}
