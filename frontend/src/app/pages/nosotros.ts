import { Component, inject } from '@angular/core';
import { NosotrosService } from '../core/services/nosotros.service';
import { SitioService } from '../core/services/sitio.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Icono } from '../shared/icono';
import { Imagen } from '../shared/imagen';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-nosotros',
  imports: [Imagen, EstadoCarga, Reveal, Icono],
  template: `
    <div class="pagina">
      <header class="encabezado" appReveal>
        <h1 class="titulo-seccion">{{ t('nosotros.titulo') }}</h1>
        <p class="subtitulo">{{ t('nosotros.subtitulo') }}</p>
      </header>
      <app-estado-carga [cargando]="nosotros.cargando()" [error]="nosotros.error()" />
      @if (nosotros.datos(); as n) {
        <div class="grid gap-10 lg:grid-cols-3">
          <p class="whitespace-pre-line text-lg leading-relaxed text-texto/80 lg:col-span-2">{{ n.historia }}</p>
          <dl class="tarjeta h-fit space-y-5 p-7 text-sm">
            @for (f of filas(n); track f.icono) {
              <div class="flex gap-3">
                <span class="mt-0.5 text-oro"><app-icono [nombre]="f.icono" [tamano]="17" /></span>
                <div class="min-w-0">
                  <dt class="mb-0.5 text-xs font-medium text-suave">{{ t(f.clave) }}</dt>
                  <dd class="whitespace-pre-line break-words">{{ f.valor }}</dd>
                </div>
              </div>
            }
          </dl>
        </div>

        <h2 class="mb-8 mt-20 text-2xl font-semibold tracking-tight">{{ t('nosotros.galeria') }}</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          @for (f of n.galeria; track f.id) {
            <figure class="relative h-56 overflow-hidden rounded-2xl border border-borde sm:h-64" [appReveal]="($index % 3) * 100">
              <app-imagen [src]="f.imagen" [nombre]="f.titulo" />
              <figcaption class="absolute inset-x-0 bottom-0 bg-fondo/70 px-4 py-2.5 text-xs font-medium backdrop-blur-sm">
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
  protected readonly t = inject(SitioService).t;
  protected readonly nosotros = cargar(inject(NosotrosService).obtener());

  protected filas(n: { direccion: string; telefono: string; email: string; horario: string }) {
    return [
      { icono: 'map-pin', clave: 'nosotros.direccion', valor: n.direccion },
      { icono: 'phone', clave: 'nosotros.telefono', valor: n.telefono },
      { icono: 'mail', clave: 'nosotros.email', valor: n.email },
      { icono: 'clock', clave: 'nosotros.horario', valor: n.horario },
    ];
  }
}
