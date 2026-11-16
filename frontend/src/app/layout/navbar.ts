import { Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CafeteriaService } from '../core/services/cafeteria.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300"
      [class]="solido() || abierto() ? 'border-borde bg-fondo' : 'border-transparent bg-transparent'"
    >
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a routerLink="/" class="flex items-center gap-3" (click)="abierto.set(false)">
          <span class="h-3 w-3 rounded-full bg-oro"></span>
          <span class="text-lg font-bold tracking-wide">{{ cafeteria()?.nombre }}</span>
        </a>

        <ul class="hidden items-center gap-8 md:flex">
          @for (enlace of enlaces; track enlace.ruta) {
            <li>
              <a
                [routerLink]="enlace.ruta"
                routerLinkActive="text-oro"
                [routerLinkActiveOptions]="{ exact: enlace.ruta === '/' }"
                class="enlace-sub text-xs font-semibold uppercase tracking-[0.2em] text-texto transition-colors duration-200 hover:text-oro"
              >
                {{ enlace.etiqueta }}
              </a>
            </li>
          }
        </ul>

        <button
          type="button"
          class="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Abrir menú"
          [attr.aria-expanded]="abierto()"
          (click)="abierto.set(!abierto())"
        >
          <span class="h-0.5 w-6 bg-oro"></span>
          <span class="h-0.5 w-6 bg-oro"></span>
          <span class="h-0.5 w-6 bg-oro"></span>
        </button>
      </nav>

      @if (abierto()) {
        <ul class="border-t border-white/5 bg-fondo px-6 py-4 md:hidden">
          @for (enlace of enlaces; track enlace.ruta) {
            <li>
              <a
                [routerLink]="enlace.ruta"
                routerLinkActive="text-oro"
                [routerLinkActiveOptions]="{ exact: enlace.ruta === '/' }"
                class="block py-3 text-xs font-semibold uppercase tracking-[0.2em]"
                (click)="abierto.set(false)"
              >
                {{ enlace.etiqueta }}
              </a>
            </li>
          }
        </ul>
      }
    </header>
  `,
})
export class Navbar {
  protected readonly cafeteria = toSignal(
    inject(CafeteriaService).cafeteria$.pipe(catchError(() => of(null))),
    { initialValue: null },
  );
  protected readonly abierto = signal(false);
  protected readonly solido = signal(typeof window !== 'undefined' && window.scrollY > 40);

  @HostListener('window:scroll')
  protected alDesplazar(): void {
    this.solido.set(window.scrollY > 40);
  }

  protected readonly enlaces = [
    { ruta: '/', etiqueta: 'Inicio' },
    { ruta: '/servicios', etiqueta: 'Servicios' },
    { ruta: '/especialidades', etiqueta: 'Especialidades' },
    { ruta: '/nosotros', etiqueta: 'Nosotros' },
    { ruta: '/precios', etiqueta: 'Precios' },
    { ruta: '/contactos', etiqueta: 'Contactos' },
  ];
}
