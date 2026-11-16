import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CarritoService } from '../core/services/carrito.service';
import { ChatService } from '../core/services/chat.service';
import { SitioService } from '../core/services/sitio.service';
import { PanelService } from '../core/state/panel.service';
import { CarritoLista } from '../shared/carrito-lista';
import { CheckoutForm } from '../shared/checkout-form';
import { Icono } from '../shared/icono';
import { ChatAccion } from './chat-acciones';

@Component({
  selector: 'app-chatbot',
  imports: [Icono, ChatAccion, CarritoLista, CheckoutForm],
  template: `
    <aside
      class="panel-chat"
      [class.panel-abierto]="panel.abierto()"
      [attr.inert]="panel.abierto() ? null : ''"
      [attr.aria-label]="t('chat.abrir')"
    >
      <header class="border-b border-borde px-4 pt-4">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-oro/10 text-oro">
            <app-icono nombre="coffee" [tamano]="20" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ sitio.agente()?.nombre }}</p>
            <p class="truncate text-xs text-suave">{{ sitio.agente()?.rol }}</p>
          </div>
          @if (panel.pestana() === 'chat' && chat.mensajes().length) {
            <button type="button" class="icono-btn" [attr.aria-label]="t('chat.limpiar')" [title]="t('chat.limpiar')" (click)="chat.limpiar()">
              <app-icono nombre="rotate-ccw" [tamano]="16" />
            </button>
          }
          <button type="button" class="icono-btn" [attr.aria-label]="t('chat.cerrar')" [title]="t('chat.cerrar')" (click)="panel.cerrar()">
            <app-icono nombre="x" [tamano]="18" />
          </button>
        </div>
        <div class="mt-3 flex gap-1" role="tablist">
          <button type="button" role="tab" class="pestana" [class.pestana-activa]="panel.pestana() === 'chat'" [attr.aria-selected]="panel.pestana() === 'chat'" (click)="panel.elegir('chat')">
            <app-icono nombre="message-circle" [tamano]="15" />
            {{ t('chat.tab_chat') }}
          </button>
          <button type="button" role="tab" class="pestana" [class.latido]="carrito.resaltar()" [class.pestana-activa]="panel.pestana() === 'carrito'" [attr.aria-selected]="panel.pestana() === 'carrito'" (click)="panel.elegir('carrito')">
            <app-icono nombre="shopping-cart" [tamano]="15" />
            {{ t('chat.tab_carrito') }}
            @if (carrito.carrito().cantidad > 0) {
              <span class="rounded-full bg-oro px-1.5 text-[10px] font-semibold leading-4 text-fondo">{{ carrito.carrito().cantidad }}</span>
            }
          </button>
        </div>
      </header>

      @if (panel.pestana() === 'chat') {
        <div #lista class="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          <div class="msg flex">
            <p class="burbuja burbuja-asistente">{{ t('chat.bienvenida') }}</p>
          </div>
          @if (!chat.mensajes().length && sitio.sugerencias().length) {
            <div class="flex flex-wrap gap-2">
              @for (s of sitio.sugerencias(); track s.texto) {
                <button type="button" class="chip" (click)="chat.enviar(s.texto)">
                  <app-icono [nombre]="s.icono" [tamano]="14" />
                  {{ s.texto }}
                </button>
              }
            </div>
          }
          @for (m of chat.mensajes(); track $index) {
            <div class="msg space-y-2">
              @if (m.content) {
                <div class="flex" [class.justify-end]="m.role === 'user'">
                  <p class="burbuja" [class]="m.role === 'user' ? 'burbuja-usuario' : 'burbuja-asistente'">{{ m.content }}</p>
                </div>
              }
              @for (a of m.acciones; track $index) {
                <app-chat-accion [accion]="a" />
              }
            </div>
          }
          @if (chat.enviando()) {
            <div class="msg flex items-center gap-2">
              <span class="burbuja burbuja-asistente flex gap-1" aria-hidden="true">
                <span class="punto"></span><span class="punto" style="animation-delay: 150ms"></span><span class="punto" style="animation-delay: 300ms"></span>
              </span>
              <span class="text-xs text-suave">{{ t('chat.escribiendo') }}</span>
            </div>
          }
          @if (chat.fallo()) {
            <div class="msg flex items-center gap-3 rounded-2xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
              <app-icono nombre="circle-alert" [tamano]="16" />
              <span class="flex-1">{{ t('chat.error') }}</span>
              <button type="button" class="btn-borde px-3 py-1.5 text-xs" (click)="chat.reintentar()">
                <app-icono nombre="refresh-cw" [tamano]="13" />
                {{ t('comun.reintentar') }}
              </button>
            </div>
          }
        </div>

        <form class="border-t border-borde p-3" (submit)="$event.preventDefault(); enviar()">
          <div class="flex items-end gap-2 rounded-3xl border border-borde bg-superficie py-1.5 pl-4 pr-1.5 transition-colors duration-200 focus-within:border-oro/60">
            <textarea
              #entrada
              rows="1"
              class="max-h-36 min-h-9 flex-1 resize-none self-center bg-transparent py-1.5 text-sm text-texto outline-none placeholder:text-suave/60"
              [placeholder]="t('chat.placeholder')"
              [attr.aria-label]="t('chat.placeholder')"
              [value]="texto()"
              (input)="alEscribir($event)"
              (keydown.enter)="alEnter($event)"
            ></textarea>
            <button type="submit" class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-oro text-fondo transition duration-200 hover:bg-oro-claro active:scale-95 disabled:cursor-not-allowed disabled:opacity-40" [disabled]="!texto().trim() || chat.enviando()" [attr.aria-label]="t('chat.enviar')">
              <app-icono nombre="arrow-up" [tamano]="18" [trazo]="2.25" />
            </button>
          </div>
        </form>
      } @else {
        <div class="flex-1 overflow-y-auto px-4 py-5">
          <h2 class="mb-3 text-sm font-semibold">{{ t(panel.vista() === 'lista' ? 'carrito.titulo' : 'checkout.titulo') }}</h2>
          @if (panel.vista() === 'lista') {
            <div class="vista-panel"><app-carrito-lista (checkout)="panel.vista.set('checkout')" /></div>
          } @else {
            <div class="vista-panel"><app-checkout-form [conVolver]="true" (volver)="panel.vista.set('lista')" /></div>
          }
        </div>
      }
    </aside>

    <button type="button" class="flotante lg:hidden" [class.flotante-oculto]="panel.abierto()" [attr.aria-label]="t('chat.abrir')" (click)="panel.abrir('chat')">
      <app-icono nombre="message-circle" [tamano]="24" />
    </button>
  `,
})
export class Chatbot {
  protected readonly panel = inject(PanelService);
  protected readonly chat = inject(ChatService);
  protected readonly carrito = inject(CarritoService);
  protected readonly sitio = inject(SitioService);
  protected readonly t = this.sitio.t;

  protected readonly texto = signal('');
  private readonly lista = viewChild<ElementRef<HTMLElement>>('lista');
  private readonly entrada = viewChild<ElementRef<HTMLTextAreaElement>>('entrada');
  protected readonly vacio = computed(() => !this.chat.mensajes().length);

  constructor() {
    this.carrito.cargar();
    effect(() => {
      this.chat.mensajes();
      this.chat.enviando();
      this.chat.fallo();
      this.panel.pestana();
      this.panel.abierto();
      setTimeout(() => {
        const el = this.lista()?.nativeElement;
        el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }, 50);
    });
  }

  protected alEscribir(evento: Event): void {
    const area = evento.target as HTMLTextAreaElement;
    this.texto.set(area.value);
    this.ajustar(area);
  }

  protected alEnter(evento: Event): void {
    const e = evento as KeyboardEvent;
    if (e.shiftKey || e.isComposing) {
      return;
    }
    e.preventDefault();
    this.enviar();
  }

  protected enviar(): void {
    const valor = this.texto().trim();
    if (!valor || this.chat.enviando()) {
      return;
    }
    this.chat.enviar(valor);
    this.texto.set('');
    const area = this.entrada()?.nativeElement;
    if (area) {
      area.value = '';
      this.ajustar(area);
    }
  }

  private ajustar(area: HTMLTextAreaElement): void {
    area.style.height = 'auto';
    area.style.height = `${Math.min(area.scrollHeight, 144)}px`;
  }
}
