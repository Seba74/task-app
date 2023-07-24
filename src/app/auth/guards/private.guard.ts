// function guard
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const privateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }

  return false;
};
