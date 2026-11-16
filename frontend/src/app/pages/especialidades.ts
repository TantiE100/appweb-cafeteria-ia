import { Component, inject } from '@angular/core';
import { EspecialidadesService } from '../core/services/especialidades.service';
import { SitioService } from '../core/services/sitio.service';
import { cargar } from '../core/util/cargar';
import { BotonAgregar } from '../shared/boton-agregar';
import { EstadoCarga } from '../shared/estado-carga';
import { Imagen } from '../shared/imagen';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-especialidades',
  imports: [Imagen, EstadoCarga, Reveal, BotonAgregar],
  template: `
    <div class="pagina">
      <header class="encabezado" appReveal>
        <h1 class="titulo-seccion">{{ t('especialidades.titulo') }}</h1>
        <p class="subtitulo">{{ t('especialidades.subtitulo') }}</p>
      </header>
      <app-estado-carga [cargando]="especialidades.cargando()" [error]="especialidades.error()" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (e of especialidades.datos(); track e.id) {
          <article class="tarjeta flex flex-col" [appReveal]="($index % 3) * 100">
            <div class="m-2 h-56 overflow-hidden rounded-xl">
              <app-imagen [src]="e.imagen" [nombre]="e.nombre" />
            </div>
            <div class="flex flex-1 flex-col p-5 pt-3">
              <div class="flex items-baseline justify-between gap-4">
                <h2 class="text-lg font-semibold">{{ e.nombre }}</h2>
                <span class="whitespace-nowrap font-semibold text-oro">{{ precio(e.precio) }}</span>
              </div>
              <p class="mt-2 flex-1 text-sm leading-relaxed text-suave">{{ e.descripcion }}</p>
              <div class="mt-5"><app-boton-agregar [productoId]="e.producto_id" /></div>
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class Especialidades {
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  protected readonly especialidades = cargar(inject(EspecialidadesService).listar());
}
