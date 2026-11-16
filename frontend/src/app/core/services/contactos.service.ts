import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactoPeticion, ContactoRespuesta } from '../models/contacto.model';

@Injectable({ providedIn: 'root' })
export class ContactosService {
  private readonly http = inject(HttpClient);

  enviar(datos: ContactoPeticion): Observable<ContactoRespuesta> {
    return this.http.post<ContactoRespuesta>('/api/contactos', datos);
  }
}
