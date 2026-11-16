import { DecimalPipe, UpperCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CafeteriaService } from '../core/services/cafeteria.service';
import { EspecialidadesService } from '../core/services/especialidades.service';
import { ServiciosService } from '../core/services/servicios.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { Imagen } from '../shared/imagen';
import { Reveal } from '../shared/reveal';
import { Titulo } from '../shared/titulo';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, DecimalPipe, UpperCasePipe, Titulo, Imagen, EstadoCarga, Reveal],
  template: `
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-fondo">
      <div #fondo class="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform">
        @if (cafeteria.datos()?.video; as video) {
          <video
            class="h-full w-full object-cover"
            [src]="video"
            [muted]="true"
            muted
            autoplay
            loop
            playsinline
          ></video>
        }
      </div>
      <div class="absolute inset-0 bg-fondo/70"></div>

      <div #contenido class="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center">
        @if (cafeteria.datos(); as c) {
          <p class="etiqueta mb-6" appReveal>— {{ c.ciudad | uppercase }} —</p>
          <h1 class="titulo-hero text-5xl font-bold leading-tight tracking-tight sm:text-7xl" appReveal="100">
            <app-titulo [texto]="c.titulo" [destacado]="c.titulo_destacado" />
          </h1>
          <p class="mt-6 text-lg text-texto/80 sm:text-xl" appReveal="200">{{ c.eslogan }}</p>
          <a routerLink="/precios" class="btn-oro mt-10" appReveal="300">Explorar menú</a>
        } @else {
          <app-estado-carga [cargando]="cafeteria.cargando()" [error]="cafeteria.error()" />
        }
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-28">
      <div class="mb-14 flex flex-wrap items-end justify-between gap-6" appReveal>
        <h2 class="titulo-seccion">Servicios</h2>
        <a routerLink="/servicios" class="enlace-sub etiqueta">Ver todos</a>
      </div>
      <app-estado-carga [cargando]="servicios.cargando()" [error]="servicios.error()" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (s of serviciosResumen(); track s.id) {
          <article class="tarjeta p-8" [appReveal]="($index % 3) * 100">
            <div class="mb-5 text-3xl">{{ s.icono }}</div>
            <h3 class="mb-2 text-lg font-semibold">{{ s.nombre }}</h3>
            <p class="text-sm leading-relaxed text-suave">{{ s.descripcion }}</p>
          </article>
        }
      </div>
    </section>

    <section class="border-y border-borde bg-superficie">
      <div class="mx-auto max-w-6xl px-6 py-28">
        <div class="mb-14 flex flex-wrap items-end justify-between gap-6" appReveal>
          <h2 class="titulo-seccion">Especialidades</h2>
          <a routerLink="/especialidades" class="enlace-sub etiqueta">Ver todas</a>
        </div>
        <app-estado-carga [cargando]="especialidades.cargando()" [error]="especialidades.error()" />
        <div class="grid gap-8 md:grid-cols-3">
          @for (e of destacadas(); track e.id) {
            <article class="tarjeta" [appReveal]="$index * 100">
              <div class="h-56">
                <app-imagen [src]="e.imagen" [nombre]="e.nombre" />
              </div>
              <div class="p-6">
                <div class="flex items-baseline justify-between gap-4">
                  <h3 class="text-lg font-semibold">{{ e.nombre }}</h3>
                  <span class="whitespace-nowrap font-semibold text-oro">Bs {{ e.precio | number: '1.2-2' }}</span>
                </div>
                <p class="mt-3 text-sm leading-relaxed text-suave">{{ e.descripcion }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    @if (cafeteria.datos(); as c) {
      <section class="mx-auto grid max-w-6xl gap-12 px-6 py-28 lg:grid-cols-2 lg:items-center">
        <div appReveal>
          <p class="etiqueta mb-4">Nosotros</p>
          <h2 class="titulo-seccion mb-6">{{ c.nombre }}</h2>
          <p class="line-clamp-6 leading-relaxed text-suave">{{ c.historia }}</p>
          <a routerLink="/nosotros" class="enlace-sub etiqueta mt-8">Conocer más</a>
        </div>
        <dl class="space-y-6 border border-borde p-8 text-sm" appReveal="150">
          <div>
            <dt class="etiqueta mb-1">Dirección</dt>
            <dd>{{ c.direccion }}</dd>
          </div>
          <div>
            <dt class="etiqueta mb-1">Horario</dt>
            <dd class="whitespace-pre-line">{{ c.horario }}</dd>
          </div>
        </dl>
      </section>
    }

    <section class="border-t border-borde bg-superficie">
      <div class="mx-auto max-w-3xl px-6 py-28 text-center" appReveal>
        @if (cafeteria.datos(); as c) {
          <h2 class="titulo-seccion mb-4">{{ c.eslogan }}</h2>
        }
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <a routerLink="/precios" class="btn-oro">Ver precios</a>
          <a routerLink="/contactos" class="btn-borde">Contactar</a>
        </div>
      </div>
    </section>
  `,
})
export class Inicio {
  protected readonly cafeteria = cargar(inject(CafeteriaService).cafeteria$);
  protected readonly servicios = cargar(inject(ServiciosService).listar());
  protected readonly especialidades = cargar(inject(EspecialidadesService).listar());
  protected readonly serviciosResumen = computed(() => (this.servicios.datos() ?? []).slice(0, 6));
  protected readonly destacadas = computed(() => (this.especialidades.datos() ?? []).slice(0, 3));

  private readonly fondo = viewChild<ElementRef<HTMLElement>>('fondo');
  private readonly contenido = viewChild<ElementRef<HTMLElement>>('contenido');
  private cuadro = 0;
  private readonly reducido =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  @HostListener('window:scroll')
  protected alDesplazar(): void {
    if (this.reducido || this.cuadro) {
      return;
    }
    this.cuadro = requestAnimationFrame(() => {
      this.cuadro = 0;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) {
        return;
      }
      const fondo = this.fondo()?.nativeElement;
      const contenido = this.contenido()?.nativeElement;
      if (fondo) {
        fondo.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
      }
      if (contenido) {
        contenido.style.transform = `translate3d(0, ${y * -0.1}px, 0)`;
        contenido.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      }
    });
  }
}
