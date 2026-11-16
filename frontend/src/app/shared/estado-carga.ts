import { Component, input } from '@angular/core';

@Component({
  selector: 'app-estado-carga',
  template: `
    @if (error()) {
      <p class="border border-borde bg-superficie p-6 text-center text-suave">
        No se pudo cargar la información. Intenta nuevamente en unos minutos.
      </p>
    } @else if (cargando()) {
      <p class="p-6 text-center text-sm uppercase tracking-widest text-suave">Cargando…</p>
    }
  `,
})
export class EstadoCarga {
  readonly cargando = input(false);
  readonly error = input(false);
}
