import { Routes } from '@angular/router';

/**
 * Landing page routes.
 * All sections (hero, alice, fiama, mica, carrousel, contacto)
 * are rendered inline in the App component template.
 * Routes exist only for catch-all behavior and potential future
 * standalone section navigation.
 */
export const routes: Routes = [
  {
    path: '',
    children: [],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
