import { Routes } from '@angular/router';
import { privateGuard } from './auth/guards/private.guard';
import { publicGuard } from './auth/guards/public.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    canActivate: [privateGuard],
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
