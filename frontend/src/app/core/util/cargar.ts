import { Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';

export interface Carga<T> {
  datos: Signal<T | null>;
  error: Signal<boolean>;
  cargando: Signal<boolean>;
}

type Estado<T> = { datos: T | null; error: boolean; listo: boolean };

export function cargar<T>(origen: Observable<T>): Carga<T> {
  const estado = toSignal(
    origen.pipe(
      map((datos): Estado<T> => ({ datos, error: false, listo: true })),
      catchError(() => of<Estado<T>>({ datos: null, error: true, listo: true })),
    ),
    { initialValue: { datos: null, error: false, listo: false } as Estado<T> },
  );
  return {
    datos: computed(() => estado().datos),
    error: computed(() => estado().error),
    cargando: computed(() => !estado().listo),
  };
}
