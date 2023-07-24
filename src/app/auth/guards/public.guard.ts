// function guard
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const navController = inject(NavController);

  if (authService.authStatus() === AuthStatus.authenticated) {
    navController.navigateRoot('/home');
    return false;
  }

  return true;
};
