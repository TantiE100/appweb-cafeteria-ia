import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SitioService } from '../core/services/sitio.service';
import { EspecialidadesService } from '../core/services/especialidades.service';
import { ServiciosService } from '../core/services/servicios.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';
import { BotonAgregar } from '../shared/boton-agregar';
import { Icono } from '../shared/icono';
import { Imagen } from '../shared/imagen';
import { Reveal } from '../shared/reveal';
import { Titulo } from '../shared/titulo';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Titulo, Imagen, EstadoCarga, Reveal, Icono, BotonAgregar],
  template: `
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-fondo">
      <div #fondo class="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform">
        @if (cafeteria()?.video; as video) {
          <video class="h-full w-full object-cover" [src]="video" [muted]="true" muted autoplay loop playsinline></video>
        }
      </div>
      <div class="absolute inset-0 bg-fondo/70"></div>

      <div #contenido class="relative z-10 mx-auto max-w-3xl px-6 pt-24 text-center">
        @if (cafeteria(); as c) {
          <p class="etiqueta mb-6" appReveal>{{ c.ciudad }}</p>
          <h1 class="titulo-hero text-5xl font-semibold leading-tight tracking-tight sm:text-7xl" appReveal="100">
            <app-titulo [texto]="c.titulo" [destacado]="c.titulo_destacado" />
          </h1>
          <p class="mx-auto mt-6 max-w-xl text-lg text-texto/80 sm:text-xl" appReveal="200">{{ c.eslogan }}</p>
          <a routerLink="/precios" class="btn-oro mt-10 px-8 py-3.5" appReveal="300">
            {{ t('hero.cta') }}
            <app-icono nombre="arrow-right" [tamano]="16" />
          </a>
        }
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-28">
      <div class="mb-12 flex flex-wrap items-end justify-between gap-6" appReveal>
        <h2 class="titulo-seccion">{{ t('inicio.servicios.titulo') }}</h2>
        <a routerLink="/servicios" class="enlace-sub">{{ t('inicio.servicios.cta') }}</a>
      </div>
      <app-estado-carga [cargando]="servicios.cargando()" [error]="servicios.error()" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (s of serviciosResumen(); track s.id) {
          <article class="tarjeta p-7" [appReveal]="($index % 3) * 100">
            <span class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-oro/10 text-oro">
              <app-icono [nombre]="s.icono" [tamano]="22" />
            </span>
            <h3 class="mb-2 text-lg font-semibold">{{ s.nombre }}</h3>
            <p class="text-sm leading-relaxed text-suave">{{ s.descripcion }}</p>
          </article>
        }
      </div>
    </section>

    <section class="border-y border-borde bg-superficie">
      <div class="mx-auto max-w-6xl px-6 py-28">
        <div class="mb-12 flex flex-wrap items-end justify-between gap-6" appReveal>
          <h2 class="titulo-seccion">{{ t('inicio.especialidades.titulo') }}</h2>
          <a routerLink="/especialidades" class="enlace-sub">{{ t('inicio.especialidades.cta') }}</a>
        </div>
        <app-estado-carga [cargando]="especialidades.cargando()" [error]="especialidades.error()" />
        <div class="grid gap-6 md:grid-cols-3">
          @for (e of destacadas(); track e.id) {
            <article class="tarjeta flex flex-col bg-fondo" [appReveal]="$index * 100">
              <div class="m-2 h-52 overflow-hidden rounded-xl">
                <app-imagen [src]="e.imagen" [nombre]="e.nombre" />
              </div>
              <div class="flex flex-1 flex-col p-5 pt-3">
                <div class="flex items-baseline justify-between gap-4">
                  <h3 class="text-lg font-semibold">{{ e.nombre }}</h3>
                  <span class="whitespace-nowrap font-semibold text-oro">{{ precio(e.precio) }}</span>
                </div>
                <p class="mt-2 flex-1 text-sm leading-relaxed text-suave">{{ e.descripcion }}</p>
                <div class="mt-5"><app-boton-agregar [productoId]="e.producto_id" /></div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    @if (cafeteria(); as c) {
      <section class="mx-auto grid max-w-6xl gap-12 px-6 py-28 lg:grid-cols-2 lg:items-center">
        <div appReveal>
          <h2 class="titulo-seccion mb-6">{{ t('inicio.nosotros.titulo') }}</h2>
          <p class="line-clamp-6 max-w-prose leading-relaxed text-suave">{{ c.historia }}</p>
          <a routerLink="/nosotros" class="enlace-sub mt-8">{{ t('inicio.nosotros.cta') }}</a>
        </div>
        <dl class="tarjeta space-y-6 p-8 text-sm" appReveal="150">
          <div class="flex gap-3">
            <span class="mt-0.5 text-oro"><app-icono nombre="map-pin" [tamano]="17" /></span>
            <div>
              <dt class="mb-0.5 text-xs font-medium text-suave">{{ t('nosotros.direccion') }}</dt>
              <dd>{{ c.direccion }}</dd>
            </div>
          </div>
          <div class="flex gap-3">
            <span class="mt-0.5 text-oro"><app-icono nombre="clock" [tamano]="17" /></span>
            <div>
              <dt class="mb-0.5 text-xs font-medium text-suave">{{ t('nosotros.horario') }}</dt>
              <dd class="whitespace-pre-line">{{ c.horario }}</dd>
            </div>
          </div>
        </dl>
      </section>
    }

    <section class="border-t border-borde bg-superficie">
      <div class="mx-auto max-w-2xl px-6 py-28 text-center" appReveal>
        <h2 class="titulo-seccion mb-4">{{ t('inicio.cierre.titulo') }}</h2>
        <p class="text-suave">{{ t('inicio.cierre.texto') }}</p>
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <a routerLink="/precios" class="btn-oro">{{ t('inicio.cierre.cta_precios') }}</a>
          <a routerLink="/contactos" class="btn-borde">{{ t('inicio.cierre.cta_contacto') }}</a>
        </div>
      </div>
    </section>
  `,
})
export class Inicio {
  private readonly sitio = inject(SitioService);
  protected readonly t = this.sitio.t;
  protected readonly precio = this.sitio.precio;
  protected readonly cafeteria = this.sitio.cafeteria;
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
