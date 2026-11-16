import { Component, inject, input, signal } from '@angular/core';
import { CarritoService } from '../core/services/carrito.service';
import { SitioService } from '../core/services/sitio.service';
import { Icono } from './icono';

@Component({
  selector: 'app-boton-agregar',
  imports: [Icono],
  template: `
    <button
      type="button"
      class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      [class]="
        (agregado() ? 'border-oro bg-oro text-fondo ' : 'border-white/15 text-texto hover:border-oro hover:text-oro ') +
        (compacto() ? 'h-8 w-8' : 'px-4 py-2')
      "
      [disabled]="ocupado()"
      [attr.aria-label]="t('comun.agregar')"
      (click)="agregar()"
    >
      <app-icono [nombre]="agregado() ? 'check' : 'plus'" [tamano]="compacto() ? 16 : 14" />
      @if (!compacto()) {
        <span>{{ agregado() ? t('comun.agregado') : t('comun.agregar') }}</span>
      }
    </button>
  `,
})
export class BotonAgregar {
  private readonly carrito = inject(CarritoService);
  protected readonly t = inject(SitioService).t;
  readonly productoId = input.required<number>();
  readonly compacto = input(false);
  protected readonly ocupado = signal(false);
  protected readonly agregado = signal(false);

  protected agregar(): void {
    this.ocupado.set(true);
    this.carrito.agregar(this.productoId()).subscribe({
      next: () => {
        this.ocupado.set(false);
        this.agregado.set(true);
        setTimeout(() => this.agregado.set(false), 1500);
      },
      error: () => this.ocupado.set(false),
    });
  }
}
