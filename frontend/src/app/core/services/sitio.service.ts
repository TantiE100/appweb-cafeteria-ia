import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Sitio } from '../models/sitio.model';

@Injectable({ providedIn: 'root' })
export class SitioService {
  private readonly http = inject(HttpClient);

  readonly datos = signal<Sitio | null>(null);
  readonly cafeteria = computed(() => this.datos()?.cafeteria ?? null);
  readonly navegacion = computed(() => this.datos()?.navegacion ?? []);
  readonly sugerencias = computed(() => this.datos()?.sugerencias ?? []);
  readonly agente = computed(() => this.datos()?.agente ?? null);

  readonly t = (clave: string): string => this.datos()?.textos?.[clave] ?? clave;

  readonly precio = (valor: number | string): string =>
    `${this.t('comun.moneda')} ${Number(valor).toFixed(2)}`;

  cargar(): Promise<void> {
    return firstValueFrom(this.http.get<Sitio>('/api/sitio'))
      .then((d) => {
        this.datos.set(d);
        document.title = d.cafeteria.nombre;
      })
      .catch(() => undefined);
  }
}
