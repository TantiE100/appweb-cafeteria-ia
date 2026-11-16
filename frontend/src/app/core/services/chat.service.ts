import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { ChatPeticion, ChatRespuesta } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  enviar(peticion: ChatPeticion): Observable<ChatRespuesta> {
    return this.http.post<ChatRespuesta>('/api/chat', peticion).pipe(timeout(120000));
  }
}
