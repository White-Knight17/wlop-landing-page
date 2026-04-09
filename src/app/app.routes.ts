import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/contacto/contacto.component').then((m) => m.ContactoComponent),
    data: { section: 'contacto' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
