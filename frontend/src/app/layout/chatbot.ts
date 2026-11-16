import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AccionChat,
  ChatRespuesta,
  MensajeChat,
  MensajeVista,
  TIPOS_ACCION,
} from '../core/models/chat.model';
import { ChatService } from '../core/services/chat.service';
import { ChatAccion } from './chat-acciones';

const CLAVE = 'santis-coffee-chat';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, ChatAccion],
  template: `
    @if (abierto()) {
      <div class="fixed inset-0 z-40 bg-black/50 sm:hidden" (click)="abierto.set(false)"></div>
    }

    <section
      class="fixed inset-0 z-50 flex flex-col border-borde bg-superficie transition-[transform,opacity] duration-300 ease-suave sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[26rem] sm:border-l"
      [class]="abierto() ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'"
      [attr.aria-hidden]="!abierto()"
    >
      <header class="flex items-center justify-between border-b border-borde px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="h-2.5 w-2.5 rounded-full" [class]="escribiendo() ? 'bg-oro' : 'bg-emerald-500'"></span>
          <div>
            <p class="text-sm font-semibold">Lucho · barista virtual</p>
            <p class="text-xs text-suave">{{ escribiendo() ? 'Escribiendo…' : 'En línea' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          @if (mensajes().length) {
            <button
              type="button"
              class="enlace-sub cursor-pointer text-xs text-suave transition-colors hover:text-texto"
              (click)="limpiar()"
            >
              Limpiar
            </button>
          }
          <button
            type="button"
            class="cursor-pointer text-2xl leading-none text-suave transition-colors hover:text-oro"
            aria-label="Cerrar chat"
            (click)="abierto.set(false)"
          >
            ×
          </button>
        </div>
      </header>

      <div #lista class="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
        @if (mensajes().length === 0) {
          <p class="text-sm text-suave">Hola, soy Lucho. Elige una sugerencia o escribe tu consulta.</p>
          <div class="flex flex-wrap gap-2">
            @for (s of sugerencias; track s) {
              <button
                type="button"
                class="cursor-pointer border border-borde px-3 py-2 text-xs transition-colors duration-200 hover:border-oro hover:text-oro"
                (click)="enviar(s)"
              >
                {{ s }}
              </button>
            }
          </div>
        }

        @for (m of mensajes(); track $index) {
          <div
            class="flex max-w-[92%] animate-[entrada_300ms_ease-out] flex-col gap-2"
            [class]="m.role === 'user' ? 'self-end items-end' : 'self-start items-start'"
          >
            <div
              class="whitespace-pre-wrap px-3.5 py-2.5 text-sm leading-relaxed"
              [class]="m.role === 'user' ? 'bg-oro text-fondo' : 'bg-superficie-alta text-texto'"
            >
              {{ m.content }}
            </div>
            @for (a of m.acciones; track $index) {
              <div class="w-full">
                <app-chat-accion [accion]="a" />
              </div>
            }
          </div>
        }

        @if (escribiendo()) {
          <div class="flex animate-[entrada_300ms_ease-out] items-center gap-1.5 self-start bg-superficie-alta px-4 py-3">
            @for (r of retrasos; track r) {
              <span
                class="h-1.5 w-1.5 rounded-full bg-suave animate-[punto_1s_ease-in-out_infinite]"
                [style.animation-delay]="r + 'ms'"
              ></span>
            }
          </div>
        }

        @if (error()) {
          <div class="animate-[entrada_300ms_ease-out] self-start border border-red-900 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
            <p>{{ error() }}</p>
            <button
              type="button"
              class="enlace-sub mt-2 cursor-pointer text-xs font-semibold uppercase tracking-widest text-red-200"
              (click)="reintentar()"
            >
              Reintentar
            </button>
          </div>
        }
      </div>

      <form class="flex items-end gap-2 border-t border-borde p-4" (ngSubmit)="enviar()">
        <textarea
          #entrada
          name="texto"
          rows="1"
          class="max-h-32 min-h-[2.75rem] flex-1 resize-none border border-borde bg-fondo px-3 py-2.5 text-sm text-texto outline-none transition-colors duration-200 placeholder:text-suave/60 focus:border-oro"
          placeholder="Escribe un mensaje"
          [(ngModel)]="texto"
          (input)="ajustar()"
          (keydown.enter)="alEnter($event)"
        ></textarea>
        <button type="submit" class="btn-oro !px-5 !py-3" [disabled]="escribiendo() || !texto.trim()">
          Enviar
        </button>
      </form>
    </section>

    @if (!abierto()) {
      <button
        type="button"
        class="fixed bottom-5 right-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-oro bg-oro text-fondo transition-colors duration-300 hover:bg-fondo hover:text-oro"
        aria-label="Abrir chat"
        (click)="abrir()"
      >
        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
      </button>
    }
  `,
})
export class Chatbot {
  private readonly chat = inject(ChatService);
  private readonly lista = viewChild<ElementRef<HTMLElement>>('lista');
  private readonly entrada = viewChild<ElementRef<HTMLTextAreaElement>>('entrada');

  protected readonly abierto = signal(false);
  protected readonly mensajes = signal<MensajeVista[]>(this.restaurar());
  protected readonly escribiendo = signal(false);
  protected readonly error = signal('');
  protected texto = '';
  private ultimo = '';

  protected readonly retrasos = [0, 150, 300];
  protected readonly sugerencias = [
    'Ver el menú',
    'Arma mi café',
    '¿Qué me recomiendas?',
    'Reservar una mesa',
    'Horario y dirección',
    'Estado de mi pedido',
  ];

  constructor() {
    effect(() => {
      const actual = this.mensajes();
      try {
        sessionStorage.setItem(CLAVE, JSON.stringify(actual));
      } catch {
        return;
      }
    });
    effect(() => {
      this.mensajes();
      this.escribiendo();
      this.error();
      this.abierto();
      this.bajar();
    });
  }

  protected abrir(): void {
    this.abierto.set(true);
    setTimeout(() => this.entrada()?.nativeElement.focus(), 320);
  }

  protected limpiar(): void {
    this.mensajes.set([]);
    this.error.set('');
    this.ultimo = '';
  }

  protected alEnter(evento: Event): void {
    const e = evento as KeyboardEvent;
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    this.enviar();
  }

  protected ajustar(): void {
    const el = this.entrada()?.nativeElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
    }
  }

  protected reintentar(): void {
    if (this.ultimo) {
      this.error.set('');
      this.solicitar(this.ultimo, this.mensajes().slice(0, -1));
    }
  }

  protected enviar(sugerencia?: string): void {
    const mensaje = (sugerencia ?? this.texto).trim();
    if (!mensaje || this.escribiendo()) {
      return;
    }
    const historial = this.mensajes();
    this.mensajes.set([...historial, { role: 'user', content: mensaje, acciones: [] }]);
    this.texto = '';
    this.error.set('');
    setTimeout(() => this.ajustar());
    this.solicitar(mensaje, historial);
  }

  private solicitar(mensaje: string, historial: MensajeVista[]): void {
    this.ultimo = mensaje;
    this.escribiendo.set(true);
    const previo: MensajeChat[] = historial.map(({ role, content }) => ({ role, content }));

    this.chat.enviar({ mensaje, historial: previo }).subscribe({
      next: (r: ChatRespuesta) => {
        this.mensajes.update((m) => [
          ...m,
          { role: 'assistant', content: r.respuesta, acciones: this.filtrar(r.acciones) },
        ]);
        this.escribiendo.set(false);
        this.ultimo = '';
      },
      error: (e) => {
        const detalle = e?.error?.error;
        this.error.set(
          typeof detalle === 'string' && detalle
            ? detalle
            : 'No se pudo obtener una respuesta. Intenta nuevamente.',
        );
        this.escribiendo.set(false);
      },
    });
  }

  private filtrar(acciones: ChatRespuesta['acciones']): AccionChat[] {
    return (acciones ?? []).filter(
      (a) =>
        a &&
        a.datos != null &&
        (TIPOS_ACCION as readonly string[]).includes(a.tipo),
    ) as AccionChat[];
  }

  private restaurar(): MensajeVista[] {
    try {
      const crudo = sessionStorage.getItem(CLAVE);
      return crudo ? (JSON.parse(crudo) as MensajeVista[]) : [];
    } catch {
      return [];
    }
  }

  private bajar(): void {
    setTimeout(() => {
      const el = this.lista()?.nativeElement;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    });
  }
}
