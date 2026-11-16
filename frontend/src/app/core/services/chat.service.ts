import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { timeout } from 'rxjs';
import { ChatRespuesta, MensajeVista, TIPOS_ACCION } from '../models/chat.model';
import { CarritoService } from './carrito.service';

const CLAVE = 'santi-chat';

function leer(): MensajeVista[] {
  try {
    const bruto = localStorage.getItem(CLAVE);
    return bruto ? (JSON.parse(bruto) as MensajeVista[]) : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly carrito = inject(CarritoService);

  readonly mensajes = signal<MensajeVista[]>(leer());
  readonly enviando = signal(false);
  readonly fallo = signal<string | null>(null);

  constructor() {
    effect(() => localStorage.setItem(CLAVE, JSON.stringify(this.mensajes().slice(-40))));
  }

  enviar(texto: string): void {
    const mensaje = texto.trim();
    if (!mensaje || this.enviando()) {
      return;
    }
    const historial = this.mensajes()
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));
    this.mensajes.update((m) => [...m, { role: 'user', content: mensaje, acciones: [] }]);
    this.fallo.set(null);
    this.enviando.set(true);

    this.http
      .post<ChatRespuesta>('/api/chat', { mensaje, historial })
      .pipe(timeout(120000))
      .subscribe({
        next: (r) => {
          const acciones = (r.acciones ?? []).filter((a) => (TIPOS_ACCION as readonly string[]).includes(a.tipo));
          this.mensajes.update((m) => [...m, { role: 'assistant', content: r.respuesta ?? '', acciones }]);
          this.enviando.set(false);
          this.carrito.cargar();
        },
        error: () => {
          this.fallo.set(mensaje);
          this.enviando.set(false);
          this.carrito.cargar();
        },
      });
  }

  reintentar(): void {
    const texto = this.fallo();
    if (!texto) {
      return;
    }
    this.mensajes.update((m) => m.slice(0, -1));
    this.enviar(texto);
  }

  limpiar(): void {
    this.mensajes.set([]);
    this.fallo.set(null);
  }
}
