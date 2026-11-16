import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SitioService } from '../core/services/sitio.service';
import { Icono } from '../shared/icono';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icono, Logo],
  template: `
    <footer class="border-t border-borde bg-superficie">
      @if (sitio.cafeteria(); as c) {
        <div class="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <app-logo [nombre]="c.nombre" [alto]="48" />
            <p class="mt-5 max-w-xs text-sm leading-relaxed text-suave">{{ c.eslogan }}</p>
          </div>
          <ul class="space-y-3 text-sm text-suave">
            <li class="flex gap-3"><span class="mt-0.5 text-oro"><app-icono nombre="map-pin" [tamano]="16" /></span>{{ c.direccion }}</li>
            <li class="flex gap-3"><span class="mt-0.5 text-oro"><app-icono nombre="phone" [tamano]="16" /></span>{{ c.telefono }}</li>
            <li class="flex gap-3"><span class="mt-0.5 text-oro"><app-icono nombre="mail" [tamano]="16" /></span>{{ c.email }}</li>
            <li class="flex gap-3"><span class="mt-0.5 text-oro"><app-icono nombre="clock" [tamano]="16" /></span><span class="whitespace-pre-line">{{ c.horario }}</span></li>
          </ul>
          <ul class="space-y-2 text-sm md:justify-self-end">
            @for (enlace of sitio.navegacion(); track enlace.ruta) {
              <li><a [routerLink]="enlace.ruta" class="text-suave transition-colors duration-200 hover:text-oro">{{ enlace.etiqueta }}</a></li>
            }
          </ul>
        </div>
        <div class="border-t border-borde px-6 py-5 text-center text-xs text-suave">
          © {{ anio }} {{ c.nombre }}. {{ sitio.t('footer.derechos') }}
        </div>
      }
    </footer>
  `,
})
export class Footer {
  protected readonly sitio = inject(SitioService);
  protected readonly anio = new Date().getFullYear();
}
