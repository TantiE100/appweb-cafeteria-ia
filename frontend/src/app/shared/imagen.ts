import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-imagen',
  host: { class: 'relative block h-full w-full overflow-hidden bg-superficie-alta' },
  template: `
    @if (fallo() || !src()) {
      <div
        class="flex h-full w-full items-center justify-center bg-superficie-alta p-3 text-center text-xs font-semibold uppercase tracking-widest text-suave"
      >
        {{ nombre() }}
      </div>
    } @else {
      <img
        [src]="src()"
        [alt]="nombre()"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 hover:scale-105"
        (error)="fallo.set(true)"
      />
    }
  `,
})
export class Imagen {
  readonly src = input<string | null | undefined>('');
  readonly nombre = input('');
  protected readonly fallo = signal(false);
}
