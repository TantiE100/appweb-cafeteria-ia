import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pedido } from '../core/models/carrito.model';
import { CarritoService } from '../core/services/carrito.service';
import { SitioService } from '../core/services/sitio.service';
import { Icono } from './icono';
import { PedidoTicket } from './pedido-ticket';

@Component({
  selector: 'app-checkout-form',
  imports: [ReactiveFormsModule, Icono, PedidoTicket],
  template: `
    @if (pedido(); as p) {
      <app-pedido-ticket [pedido]="p" />
    } @else {
      <form class="space-y-4 rounded-2xl border border-borde bg-superficie p-4" [formGroup]="form" (ngSubmit)="pagar()" novalidate>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">{{ t('checkout.titulo') }}</h3>
          <span class="text-sm font-semibold text-oro">{{ precio(carrito().total) }}</span>
        </div>

        <div>
          <label class="etiqueta-campo" for="co-cliente">{{ t('checkout.cliente') }}</label>
          <input id="co-cliente" class="campo" formControlName="cliente" autocomplete="name" [class.campo-error]="invalido('cliente')" />
        </div>
        <div>
          <label class="etiqueta-campo" for="co-telefono">{{ t('checkout.telefono') }}</label>
          <input id="co-telefono" type="tel" class="campo" formControlName="telefono" autocomplete="tel" />
        </div>

        <fieldset>
          <legend class="etiqueta-campo">{{ t('checkout.modalidad') }}</legend>
          <div class="flex flex-wrap gap-2">
            @for (m of modalidades; track m.valor) {
              <label class="opcion" [class.opcion-activa]="form.controls.modalidad.value === m.valor">
                <input type="radio" class="sr-only" formControlName="modalidad" [value]="m.valor" />
                <app-icono [nombre]="m.icono" [tamano]="14" />
                {{ t(m.clave) }}
              </label>
            }
          </div>
        </fieldset>

        <fieldset>
          <legend class="etiqueta-campo">{{ t('checkout.metodo') }}</legend>
          <div class="flex flex-wrap gap-2">
            @for (m of metodos; track m.valor) {
              <label class="opcion" [class.opcion-activa]="form.controls.metodo_pago.value === m.valor">
                <input type="radio" class="sr-only" formControlName="metodo_pago" [value]="m.valor" />
                <app-icono [nombre]="m.icono" [tamano]="14" />
                {{ t(m.clave) }}
              </label>
            }
          </div>
        </fieldset>

        @if (form.controls.metodo_pago.value === 'tarjeta') {
          <div class="space-y-3">
            <div>
              <label class="etiqueta-campo" for="co-numero">{{ t('checkout.numero') }}</label>
              <input id="co-numero" class="campo" inputmode="numeric" autocomplete="cc-number" formControlName="numero" [class.campo-error]="invalido('numero')" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="etiqueta-campo" for="co-venc">{{ t('checkout.vencimiento') }}</label>
                <input id="co-venc" class="campo" autocomplete="cc-exp" formControlName="vencimiento" [class.campo-error]="invalido('vencimiento')" />
              </div>
              <div>
                <label class="etiqueta-campo" for="co-cvv">{{ t('checkout.cvv') }}</label>
                <input id="co-cvv" class="campo" inputmode="numeric" autocomplete="cc-csc" formControlName="cvv" [class.campo-error]="invalido('cvv')" />
              </div>
            </div>
          </div>
        }

        <p class="flex items-start gap-2 text-xs text-suave">
          <app-icono nombre="info" [tamano]="14" />
          <span>{{ t('checkout.aviso_simulado') }}</span>
        </p>

        @if (error()) {
          <p class="flex items-start gap-2 rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
            <app-icono nombre="circle-alert" [tamano]="14" />
            <span>{{ error() }}</span>
          </p>
        }

        <div class="flex gap-2">
          @if (conVolver()) {
            <button type="button" class="btn-borde px-4 py-2.5 text-xs" (click)="volver.emit()">
              <app-icono nombre="arrow-left" [tamano]="14" />
              {{ t('comun.anterior') }}
            </button>
          }
          <button type="submit" class="btn-oro flex-1 py-2.5 text-xs" [disabled]="procesando() || carrito().items.length === 0">
            {{ procesando() ? t('checkout.procesando') : t('checkout.pagar') }}
          </button>
        </div>
      </form>
    }
  `,
})
export class CheckoutForm {
  private readonly servicio = inject(CarritoService);
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  protected readonly carrito = this.servicio.carrito;
  readonly volver = output<void>();
  readonly conVolver = input(false);

  protected readonly modalidades = [
    { valor: 'mesa', clave: 'checkout.mesa', icono: 'utensils' },
    { valor: 'llevar', clave: 'checkout.llevar', icono: 'shopping-bag' },
    { valor: 'delivery', clave: 'checkout.delivery', icono: 'bike' },
  ] as const;
  protected readonly metodos = [
    { valor: 'tarjeta', clave: 'checkout.tarjeta', icono: 'credit-card' },
    { valor: 'qr', clave: 'checkout.qr', icono: 'qr-code' },
    { valor: 'efectivo', clave: 'checkout.efectivo', icono: 'banknote' },
  ] as const;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    cliente: ['', Validators.required],
    telefono: [''],
    modalidad: ['mesa' as 'mesa' | 'llevar' | 'delivery'],
    metodo_pago: ['tarjeta' as 'tarjeta' | 'qr' | 'efectivo'],
    numero: [''],
    vencimiento: [''],
    cvv: [''],
  });

  protected readonly procesando = signal(false);
  protected readonly error = signal('');
  protected readonly pedido = signal<Pedido | null>(null);

  protected invalido(campo: 'cliente' | 'numero' | 'vencimiento' | 'cvv'): boolean {
    const c = this.form.controls[campo];
    const requerido = campo === 'cliente' || this.form.controls.metodo_pago.value === 'tarjeta';
    return requerido && !c.value.trim() && (c.touched || this.intentado);
  }

  private intentado = false;

  protected pagar(): void {
    this.intentado = true;
    const v = this.form.getRawValue();
    const tarjeta = v.metodo_pago === 'tarjeta';
    if (!v.cliente.trim() || (tarjeta && (!v.numero.trim() || !v.vencimiento.trim() || !v.cvv.trim()))) {
      this.form.markAllAsTouched();
      return;
    }
    this.procesando.set(true);
    this.error.set('');
    this.servicio
      .pagar({
        cliente: v.cliente.trim(),
        ...(v.telefono.trim() ? { telefono: v.telefono.trim() } : {}),
        modalidad: v.modalidad,
        metodo_pago: v.metodo_pago,
        ...(tarjeta ? { tarjeta: { numero: v.numero.trim(), vencimiento: v.vencimiento.trim(), cvv: v.cvv.trim() } } : {}),
      })
      .subscribe({
        next: (r) => {
          this.procesando.set(false);
          this.pedido.set(r.pedido);
        },
        error: (e: HttpErrorResponse) => {
          this.procesando.set(false);
          this.error.set(typeof e.error?.error === 'string' && e.error.error ? e.error.error : this.t('comun.error'));
        },
      });
  }
}
