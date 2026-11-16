import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FotoGaleria } from '../models/cafeteria.model';

@Injectable({ providedIn: 'root' })
export class GaleriaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<FotoGaleria[]> {
    return this.http.get<FotoGaleria[]>('/api/galeria');
  }
}
