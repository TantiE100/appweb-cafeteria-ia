import { Component, inject, input, signal } from '@angular/core';
import { AccionChat } from '../core/models/chat.model';
import { MenuRespuesta } from '../core/models/carrito.model';
import { CarritoService } from '../core/services/carrito.service';
import { SitioService } from '../core/services/sitio.service';
import { PanelService } from '../core/state/panel.service';
import { BotonAgregar } from '../shared/boton-agregar';
import { CarritoLista } from '../shared/carrito-lista';
import { CheckoutForm } from '../shared/checkout-form';
import { Icono } from '../shared/icono';
import { Imagen } from '../shared/imagen';
import { PedidoTicket } from '../shared/pedido-ticket';

@Component({
  selector: 'app-chat-menu',
  imports: [BotonAgregar, Icono],
  template: `
    <div class="tarjeta-chat">
      <div class="flex flex-wrap gap-1.5">
        <button type="button" class="chip" [class.chip-activo]="!menu().categoria" (click)="ir(null, 1)">
          {{ t('menu.todas') }}
        </button>
        @for (c of menu().categorias; track c) {
          <button type="button" class="chip" [class.chip-activo]="menu().categoria === c" (click)="ir(c, 1)">{{ c }}</button>
        }
      </div>
      <ul class="mt-3 divide-y divide-borde" [class.opacity-50]="cargando()">
        @for (p of menu().productos; track p.id) {
          <li class="flex items-center gap-3 py-2.5">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ p.nombre }}</p>
              <p class="line-clamp-1 text-xs text-suave">{{ p.descripcion }}</p>
            </div>
            <span class="whitespace-nowrap text-xs font-semibold text-oro">{{ precio(p.precio) }}</span>
            <app-boton-agregar [productoId]="p.id" [compacto]="true" />
          </li>
        }
      </ul>
      @if (menu().total_paginas > 1) {
        <div class="mt-3 flex items-center justify-between text-xs text-suave">
          <button type="button" class="paso" [disabled]="menu().pagina <= 1 || cargando()" [attr.aria-label]="t('comun.anterior')" (click)="ir(menu().categoria, menu().pagina - 1)">
            <app-icono nombre="chevron-left" [tamano]="16" />
          </button>
          <span>{{ t('comun.pagina') }} {{ menu().pagina }} {{ t('comun.de') }} {{ menu().total_paginas }}</span>
          <button type="button" class="paso" [disabled]="menu().pagina >= menu().total_paginas || cargando()" [attr.aria-label]="t('comun.siguiente')" (click)="ir(menu().categoria, menu().pagina + 1)">
            <app-icono nombre="chevron-right" [tamano]="16" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ChatMenu {
  private readonly carrito = inject(CarritoService);
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  readonly inicial = input.required<MenuRespuesta>();
  private readonly actual = signal<MenuRespuesta | null>(null);
  protected readonly cargando = signal(false);

  protected menu(): MenuRespuesta {
    return this.actual() ?? this.inicial();
  }

  protected ir(categoria: string | null, pagina: number): void {
    this.cargando.set(true);
    this.carrito.menu(categoria, pagina, this.menu().por_pagina || 6).subscribe({
      next: (m) => {
        this.actual.set(m);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}

@Component({
  selector: 'app-chat-accion',
  imports: [BotonAgregar, Icono, Imagen, CarritoLista, CheckoutForm, PedidoTicket, ChatMenu],
  template: `
    @switch (accion().tipo) {
      @case ('menu') {
        <app-chat-menu [inicial]="accion().datos" />
      }
      @case ('productos') {
        <div class="tarjeta-chat">
          <ul class="divide-y divide-borde">
            @for (p of accion().datos; track p.id) {
              <li class="flex items-center gap-3 py-2.5">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">{{ p.nombre }}</p>
                  <p class="line-clamp-1 text-xs text-suave">{{ p.descripcion }}</p>
                </div>
                <span class="whitespace-nowrap text-xs font-semibold text-oro">{{ precio(p.precio) }}</span>
                <app-boton-agregar [productoId]="p.id" [compacto]="true" />
              </li>
            }
          </ul>
        </div>
      }
      @case ('especialidades') {
        <div class="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          @for (e of accion().datos; track e.id) {
            <article class="w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-borde bg-superficie">
              <div class="h-24"><app-imagen [src]="e.imagen" [nombre]="e.nombre" /></div>
              <div class="p-3">
                <p class="truncate text-sm font-medium">{{ e.nombre }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-xs font-semibold text-oro">{{ precio(e.precio) }}</span>
                  <app-boton-agregar [productoId]="e.producto_id" [compacto]="true" />
                </div>
              </div>
            </article>
          }
        </div>
      }
      @case ('servicios') {
        <div class="tarjeta-chat space-y-3">
          @for (s of accion().datos; track s.id) {
            <div class="flex gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oro/10 text-oro">
                <app-icono [nombre]="s.icono" [tamano]="17" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium">{{ s.nombre }}</p>
                <p class="text-xs text-suave">{{ s.descripcion }}</p>
              </div>
            </div>
          }
        </div>
      }
      @case ('info') {
        <div class="tarjeta-chat space-y-3 text-sm">
          @for (f of filasInfo; track f.icono) {
            @if (accion().datos[f.campo]) {
              <div class="flex gap-3">
                <span class="mt-0.5 text-oro"><app-icono [nombre]="f.icono" [tamano]="16" /></span>
                <span class="min-w-0 whitespace-pre-line break-words">{{ accion().datos[f.campo] }}</span>
              </div>
            }
          }
        </div>
      }
      @case ('opciones') {
        <div class="tarjeta-chat space-y-3">
          @for (g of gruposOpciones; track g) {
            @if (accion().datos[g]?.length) {
              <div>
                <p class="mb-1.5 text-xs font-medium text-suave">{{ t('opciones.' + g) }}</p>
                <div class="flex flex-wrap gap-1.5">
                  @for (o of accion().datos[g]; track o.id) {
                    <span class="chip">
                      {{ o.nombre }}
                      @if (o.precio_extra > 0) {
                        <span class="text-oro">+{{ precio(o.precio_extra) }}</span>
                      }
                    </span>
                  }
                </div>
              </div>
            }
          }
        </div>
      }
      @case ('carrito') {
        <div class="tarjeta-chat">
          <app-carrito-lista (checkout)="panel.abrir('carrito', 'checkout')" />
        </div>
      }
      @case ('checkout') {
        <app-checkout-form />
      }
      @case ('pedido') {
        <app-pedido-ticket [pedido]="accion().datos" />
      }
      @case ('reserva') {
        <div class="tarjeta-chat">
          <div class="flex items-center gap-2 text-suave">
            <app-icono nombre="calendar-check" [tamano]="16" />
            <span class="text-xs font-medium">{{ t('reserva.titulo') }}</span>
          </div>
          <p class="mt-2 text-xl font-semibold tracking-widest text-oro">{{ accion().datos.codigo }}</p>
          <p class="mt-1 text-sm">{{ accion().datos.nombre }}</p>
          <dl class="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div><dt class="text-suave">{{ t('reserva.fecha') }}</dt><dd class="mt-0.5 font-medium">{{ accion().datos.fecha }}</dd></div>
            <div><dt class="text-suave">{{ t('reserva.hora') }}</dt><dd class="mt-0.5 font-medium">{{ accion().datos.hora }}</dd></div>
            <div><dt class="text-suave">{{ t('reserva.personas') }}</dt><dd class="mt-0.5 font-medium">{{ accion().datos.personas }}</dd></div>
          </dl>
          <span class="mt-3 inline-block rounded-full border border-oro/40 px-2.5 py-1 text-xs font-medium text-oro">{{ accion().datos.estado }}</span>
        </div>
      }
    }
  `,
})
export class ChatAccion {
  protected readonly panel = inject(PanelService);
  protected readonly t = inject(SitioService).t;
  protected readonly precio = inject(SitioService).precio;
  readonly accion = input.required<AccionChat>();

  protected readonly filasInfo = [
    { campo: 'direccion', icono: 'map-pin' },
    { campo: 'telefono', icono: 'phone' },
    { campo: 'email', icono: 'mail' },
    { campo: 'horario', icono: 'clock' },
  ];
  protected readonly gruposOpciones = ['tamanos', 'bases', 'leches', 'extras', 'endulzantes'];
}
