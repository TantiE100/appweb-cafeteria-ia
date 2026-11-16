import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PreciosService } from '../core/services/precios.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-precios',
  imports: [DecimalPipe, EstadoCarga, Reveal],
  template: `
    <div class="pagina">
      <h1 class="titulo-seccion mb-12" appReveal>Precios</h1>
      <app-estado-carga [cargando]="precios.cargando()" [error]="precios.error()" />
      <div class="grid gap-12 lg:grid-cols-2">
        @for (grupo of precios.datos(); track grupo.categoria) {
          <section [appReveal]="$index * 100">
            <h2 class="mb-6 border-b border-oro/40 pb-3 text-2xl font-medium italic text-oro">{{ grupo.categoria }}</h2>
            <ul class="space-y-6">
              @for (p of grupo.productos; track p.id) {
                <li>
                  <div class="flex items-baseline gap-3">
                    <h3 class="font-bold">{{ p.nombre }}</h3>
                    <span class="flex-1 border-b border-dotted border-borde"></span>
                    <span class="whitespace-nowrap font-semibold text-oro">Bs {{ p.precio | number: '1.2-2' }}</span>
                  </div>
                  <p class="mt-1 text-sm text-suave">{{ p.descripcion }}</p>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    </div>
  `,
})
export class Precios {
  protected readonly precios = cargar(inject(PreciosService).listar());
}
