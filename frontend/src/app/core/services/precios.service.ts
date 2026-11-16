import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaPrecios } from '../models/precio.model';

@Injectable({ providedIn: 'root' })
export class PreciosService {
  private readonly http = inject(HttpClient);

  listar(): Observable<CategoriaPrecios[]> {
    return this.http.get<CategoriaPrecios[]>('/api/precios');
  }
}
