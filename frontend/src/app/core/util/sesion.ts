import { HttpInterceptorFn } from '@angular/common/http';

const CLAVE = 'santi-sesion';

export function sesion(): string {
  let id = localStorage.getItem(CLAVE);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLAVE, id);
  }
  return id;
}

export const sesionInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith('/api/') ? next(req.clone({ setHeaders: { 'X-Sesion': sesion() } })) : next(req);
