import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CafeteriaService } from '../core/services/cafeteria.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-borde bg-superficie">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
        @if (cafeteria(); as c) {
          <div class="flex items-center gap-3">
            <span class="h-3 w-3 rounded-full bg-oro"></span>
            <span class="text-xl font-bold">{{ c.nombre }}</span>
          </div>
          <p class="italic text-oro">{{ c.eslogan }}</p>
          <p class="text-sm text-suave">{{ c.direccion }}</p>
          <p class="text-sm text-suave">{{ c.telefono }}</p>
        }
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly cafeteria = toSignal(
    inject(CafeteriaService).cafeteria$.pipe(catchError(() => of(null))),
    { initialValue: null },
  );
}
