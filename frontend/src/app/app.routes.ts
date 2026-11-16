import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/inicio').then((m) => m.Inicio),
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios').then((m) => m.Servicios),
  },
  {
    path: 'especialidades',
    loadComponent: () => import('./pages/especialidades').then((m) => m.Especialidades),
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros').then((m) => m.NosotrosPagina),
  },
  {
    path: 'precios',
    loadComponent: () => import('./pages/precios').then((m) => m.Precios),
  },
  {
    path: 'contactos',
    loadComponent: () => import('./pages/contactos').then((m) => m.Contactos),
  },
  { path: '**', redirectTo: '' },
];
