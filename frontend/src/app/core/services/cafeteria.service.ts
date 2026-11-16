import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Cafeteria } from '../models/cafeteria.model';

@Injectable({ providedIn: 'root' })
export class CafeteriaService {
  private readonly http = inject(HttpClient);

  readonly cafeteria$: Observable<Cafeteria> = this.http
    .get<Cafeteria>('/api/cafeteria')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));
}
