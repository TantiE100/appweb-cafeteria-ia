import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Carrito, CheckoutPeticion, MenuRespuesta, Pedido } from '../models/carrito.model';

const VACIO: Carrito = { id: 0, items: [], cantidad: 0, total: 0 };

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly http = inject(HttpClient);
  readonly carrito = signal<Carrito>(VACIO);

  private fijar = tap<Carrito>((c) => this.carrito.set(c));

  cargar(): void {
    this.http.get<Carrito>('/api/carrito').subscribe({ next: (c) => this.carrito.set(c), error: () => undefined });
  }

  agregar(productoId: number, cantidad = 1): Observable<Carrito> {
    return this.http.post<Carrito>('/api/carrito/items', { producto_id: productoId, cantidad }).pipe(this.fijar);
  }

  cambiar(itemId: number, cantidad: number): Observable<Carrito> {
    return this.http.patch<Carrito>(`/api/carrito/items/${itemId}`, { cantidad }).pipe(this.fijar);
  }

  quitar(itemId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`/api/carrito/items/${itemId}`).pipe(this.fijar);
  }

  vaciar(): Observable<Carrito> {
    return this.http.delete<Carrito>('/api/carrito').pipe(this.fijar);
  }

  pagar(peticion: CheckoutPeticion): Observable<{ pedido: Pedido }> {
    return this.http.post<{ pedido: Pedido }>('/api/carrito/checkout', peticion).pipe(
      tap(() => this.cargar()),
    );
  }

  menu(categoria: string | null, pagina: number, porPagina = 6): Observable<MenuRespuesta> {
    const params: Record<string, string | number> = { pagina, por_pagina: porPagina };
    if (categoria) {
      params['categoria'] = categoria;
    }
    return this.http.get<MenuRespuesta>('/api/menu', { params });
  }
}
