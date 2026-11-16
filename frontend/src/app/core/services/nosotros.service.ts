import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Nosotros } from '../models/cafeteria.model';

@Injectable({ providedIn: 'root' })
export class NosotrosService {
  private readonly http = inject(HttpClient);

  obtener(): Observable<Nosotros> {
    return this.http.get<Nosotros>('/api/nosotros');
  }
}
