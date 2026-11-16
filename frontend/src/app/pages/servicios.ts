import { Component, inject } from '@angular/core';
import { SitioService } from '../core/services/sitio.service';
import { ServiciosService } from '../core/services/servicios.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Icono } from '../shared/icono';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-servicios',
  imports: [EstadoCarga, Reveal, Icono],
  template: `
    <div class="pagina">
      <header class="encabezado" appReveal>
        <h1 class="titulo-seccion">{{ t('servicios.titulo') }}</h1>
        <p class="subtitulo">{{ t('servicios.subtitulo') }}</p>
      </header>
      <app-estado-carga [cargando]="servicios.cargando()" [error]="servicios.error()" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (s of servicios.datos(); track s.id) {
          <article class="tarjeta p-7" [appReveal]="($index % 3) * 100">
            <span class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-oro/10 text-oro">
              <app-icono [nombre]="s.icono" [tamano]="22" />
            </span>
            <h2 class="mb-2 text-lg font-semibold">{{ s.nombre }}</h2>
            <p class="text-sm leading-relaxed text-suave">{{ s.descripcion }}</p>
          </article>
        }
      </div>
    </div>
  `,
})
export class Servicios {
  protected readonly t = inject(SitioService).t;
  protected readonly servicios = cargar(inject(ServiciosService).listar());
}
