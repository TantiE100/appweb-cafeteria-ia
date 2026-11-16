import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EspecialidadesService } from '../core/services/especialidades.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Reveal } from '../shared/reveal';
import { Imagen } from '../shared/imagen';

@Component({
  selector: 'app-especialidades',
  imports: [DecimalPipe, Imagen, EstadoCarga, Reveal],
  template: `
    <div class="pagina">
      <h1 class="titulo-seccion mb-12" appReveal>Especialidades</h1>
      <app-estado-carga [cargando]="especialidades.cargando()" [error]="especialidades.error()" />
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        @for (e of especialidades.datos(); track e.id) {
          <article class="tarjeta" [appReveal]="($index % 3) * 100">
            <div class="h-60">
              <app-imagen [src]="e.imagen" [nombre]="e.nombre" />
            </div>
            <div class="p-6">
              <div class="flex items-baseline justify-between gap-4">
                <h2 class="text-lg font-bold">{{ e.nombre }}</h2>
                <span class="whitespace-nowrap font-semibold text-oro">Bs {{ e.precio | number: '1.2-2' }}</span>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-suave">{{ e.descripcion }}</p>
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class Especialidades {
  protected readonly especialidades = cargar(inject(EspecialidadesService).listar());
}
