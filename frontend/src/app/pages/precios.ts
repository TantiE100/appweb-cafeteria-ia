import { Component, inject } from '@angular/core';
import { PreciosService } from '../core/services/precios.service';
import { SitioService } from '../core/services/sitio.service';
import { cargar } from '../core/util/cargar';
import { BotonAgregar } from '../shared/boton-agregar';
import { EstadoCarga } from '../shared/estado-carga';
import { Icono } from '../shared/icono';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-precios',
  imports: [EstadoCarga, Reveal, Icono, BotonAgregar],
  template: `
    <div class="pagina">
      <header class="encabezado" appReveal>
        <h1 class="titulo-seccion">{{ t('precios.titulo') }}</h1>
        <p class="subtitulo">{{ t('precios.subtitulo') }}</p>
      </header>
      <app-estado-carga [cargando]="precios.cargando()" [error]="precios.error()" />
      <div class="grid gap-6 lg:grid-cols-2">
        @for (grupo of precios.datos(); track grupo.categoria) {
          <section class="tarjeta p-7" [appReveal]="($index % 2) * 100">
            <h2 class="mb-5 flex items-center gap-3 text-lg font-semibold">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-oro/10 text-oro">
                <app-icono [nombre]="grupo.icono" [tamano]="19" />
              </span>
              {{ grupo.categoria }}
            </h2>
            <ul class="divide-y divide-borde">
              @for (p of grupo.productos; track p.id) {
                <li class="flex items-center gap-4 py-4">
                  <div class="min-w-0 flex-1">
                    <h3 class="font-medium">{{ p.nombre }}</h3>
                    <p class="mt-0.5 text-sm text-suave">{{ p.descripcion }}</p>
                  </div>
                  <span class="whitespace-nowrap font-semibold text-oro">{{ precio(p.precio) }}</span>
                  <app-boton-agregar [productoId]="p.id" [compacto]="true" />
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
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  protected readonly precios = cargar(inject(PreciosService).listar());
}
