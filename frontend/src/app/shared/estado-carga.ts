import { Component, inject, input } from '@angular/core';
import { SitioService } from '../core/services/sitio.service';

@Component({
  selector: 'app-estado-carga',
  template: `
    @if (error()) {
      <p class="rounded-2xl border border-borde bg-superficie p-6 text-center text-suave">{{ t('comun.error') }}</p>
    } @else if (cargando()) {
      <p class="p-6 text-center text-sm text-suave">{{ t('comun.cargando') }}</p>
    }
  `,
})
export class EstadoCarga {
  protected readonly t = inject(SitioService).t;
  readonly cargando = input(false);
  readonly error = input(false);
}
