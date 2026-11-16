import { Component, inject } from '@angular/core';
import { ServiciosService } from '../core/services/servicios.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-servicios',
  imports: [EstadoCarga, Reveal],
  template: `
    <div class="pagina">
      <h1 class="titulo-seccion mb-12" appReveal>Servicios</h1>
      <app-estado-carga [cargando]="servicios.cargando()" [error]="servicios.error()" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (s of servicios.datos(); track s.id) {
          <article class="tarjeta p-8" [appReveal]="($index % 3) * 100">
            <div class="mb-5 text-4xl">{{ s.icono }}</div>
            <h2 class="mb-3 text-xl font-bold">{{ s.nombre }}</h2>
            <p class="text-sm leading-relaxed text-suave">{{ s.descripcion }}</p>
          </article>
        }
      </div>
    </div>
  `,
})
export class Servicios {
  protected readonly servicios = cargar(inject(ServiciosService).listar());
}
