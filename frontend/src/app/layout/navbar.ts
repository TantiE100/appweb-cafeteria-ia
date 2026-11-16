import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CarritoService } from '../core/services/carrito.service';
import { SitioService } from '../core/services/sitio.service';
import { PanelService } from '../core/state/panel.service';
import { Icono } from '../shared/icono';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icono, Logo],
  template: `
    <header
      class="barra fixed left-0 top-0 z-40 border-b"
      [class]="solido() || abierto() ? 'border-borde bg-fondo/95 backdrop-blur' : 'border-transparent bg-transparent'"
    >
      <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a routerLink="/" class="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oro" (click)="abierto.set(false)">
          <app-logo [nombre]="sitio.cafeteria()?.nombre ?? ''" [alto]="32" />
        </a>

        <ul class="hidden items-center gap-1 md:flex">
          @for (enlace of sitio.navegacion(); track enlace.ruta) {
            <li>
              <a
                [routerLink]="enlace.ruta"
                routerLinkActive="text-oro bg-white/5"
                [routerLinkActiveOptions]="{ exact: enlace.ruta === '/' }"
                class="block rounded-full px-3.5 py-2 text-sm font-medium text-texto/80 transition duration-200 hover:bg-white/5 hover:text-oro"
              >
                {{ enlace.etiqueta }}
              </a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-1">
          <button type="button" class="icono-btn hidden lg:flex" [attr.aria-label]="t('chat.abrir')" [title]="t('chat.abrir')" (click)="panel.abrir('chat')">
            <app-icono nombre="message-circle" [tamano]="20" />
          </button>
          <button type="button" class="icono-btn relative" [class.latido]="carrito.resaltar()" [attr.aria-label]="t('carrito.titulo')" [title]="t('carrito.titulo')" (click)="panel.abrir('carrito')">
            <app-icono nombre="shopping-cart" [tamano]="20" />
            @if (carrito.carrito().cantidad > 0) {
              <span class="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-oro px-1 text-center text-[10px] font-semibold leading-4 text-fondo">{{ carrito.carrito().cantidad }}</span>
            }
          </button>
          <button type="button" class="icono-btn md:hidden" [attr.aria-label]="t('nav.menu')" [attr.aria-expanded]="abierto()" (click)="abierto.set(!abierto())">
            <app-icono [nombre]="abierto() ? 'x' : 'menu'" [tamano]="22" />
          </button>
        </div>
      </nav>

      @if (abierto()) {
        <ul class="border-t border-borde px-6 py-3 md:hidden">
          @for (enlace of sitio.navegacion(); track enlace.ruta) {
            <li>
              <a
                [routerLink]="enlace.ruta"
                routerLinkActive="text-oro"
                [routerLinkActiveOptions]="{ exact: enlace.ruta === '/' }"
                class="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-medium"
                (click)="abierto.set(false)"
              >
                <app-icono [nombre]="enlace.icono" [tamano]="18" />
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
  protected readonly sitio = inject(SitioService);
  protected readonly t = this.sitio.t;
  protected readonly carrito = inject(CarritoService);
  protected readonly panel = inject(PanelService);
  protected readonly abierto = signal(false);
  protected readonly solido = signal(typeof window !== 'undefined' && window.scrollY > 40);

  @HostListener('window:scroll')
  protected alDesplazar(): void {
    this.solido.set(window.scrollY > 40);
  }
}
