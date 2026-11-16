import { Injectable, signal } from '@angular/core';

export type PestanaPanel = 'chat' | 'carrito';
export type VistaCarrito = 'lista' | 'checkout';

@Injectable({ providedIn: 'root' })
export class PanelService {
  readonly abierto = signal(false);
  readonly pestana = signal<PestanaPanel>('chat');
  readonly vista = signal<VistaCarrito>('lista');

  abrir(pestana: PestanaPanel, vista: VistaCarrito = 'lista'): void {
    this.pestana.set(pestana);
    this.vista.set(vista);
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
  }

  elegir(pestana: PestanaPanel): void {
    this.pestana.set(pestana);
    this.vista.set('lista');
  }
}
