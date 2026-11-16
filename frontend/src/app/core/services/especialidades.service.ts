import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad.model';

@Injectable({ providedIn: 'root' })
export class EspecialidadesService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>('/api/especialidades');
  }
}
