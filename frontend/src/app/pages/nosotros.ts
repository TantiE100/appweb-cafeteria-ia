import { Component, inject } from '@angular/core';
import { NosotrosService } from '../core/services/nosotros.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Imagen } from '../shared/imagen';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-nosotros',
  imports: [Imagen, EstadoCarga, Reveal],
  template: `
    <div class="pagina">
      <h1 class="titulo-seccion mb-12" appReveal>Nosotros</h1>
      <app-estado-carga [cargando]="nosotros.cargando()" [error]="nosotros.error()" />
      @if (nosotros.datos(); as n) {
        <div class="grid gap-12 lg:grid-cols-3">
          <p class="whitespace-pre-line text-lg leading-relaxed text-texto/80 lg:col-span-2">{{ n.historia }}</p>
          <dl class="space-y-5 border border-borde bg-superficie p-8 text-sm">
            <div>
              <dt class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Dirección</dt>
              <dd>{{ n.direccion }}</dd>
            </div>
            <div>
              <dt class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Teléfono</dt>
              <dd>{{ n.telefono }}</dd>
            </div>
            <div>
              <dt class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Email</dt>
              <dd class="break-all">{{ n.email }}</dd>
            </div>
            <div>
              <dt class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Horario</dt>
              <dd class="whitespace-pre-line">{{ n.horario }}</dd>
            </div>
          </dl>
        </div>

        <h2 class="titulo-seccion mb-8 mt-20 text-3xl sm:text-4xl">Galería</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          @for (f of n.galeria; track f.id) {
            <figure class="relative h-56 overflow-hidden border border-borde sm:h-64" [appReveal]="($index % 3) * 100">
              <app-imagen [src]="f.imagen" [nombre]="f.titulo" />
              <figcaption
                class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-xs font-semibold uppercase tracking-widest"
              >
                {{ f.titulo }}
              </figcaption>
            </figure>
          }
        </div>
      }
    </div>
  `,
})
export class NosotrosPagina {
  protected readonly nosotros = cargar(inject(NosotrosService).obtener());
}
