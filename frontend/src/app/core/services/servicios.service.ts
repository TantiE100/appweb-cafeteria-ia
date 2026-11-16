import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>('/api/servicios');
  }
}
