import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';
import {
  User,
  AuthStatus,
  AuthResponse,
  AuthTokenStatus,
} from '../interfaces/index';
import { Storage } from '@ionic/storage-angular';
import { LoadingController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);
  private navController = inject(NavController);
  private storage = inject(Storage);

  // signals
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _token = signal<string | null>(null);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());
  public token = computed(() => this._token());
  public loadingController = inject(LoadingController);
  
  constructor() {
    this.showLoading().finally(() => {
      this.validateToken().subscribe();
    });
    this.storage.create()
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      spinner: 'dots',
      cssClass: 'custom-loading',
    });
    loading.present();
  }

  login(email: string, password: string): Observable<boolean> {
    const apiLogin: string = `${this.apiUrl}/auth/login`;
    const body = { email, password };
    this.showLoading();
    return this.http.post<AuthResponse>(apiLogin, body).pipe(
      tap(({ user, token }) => {
        this.loadingController.dismiss();
        return from(this.saveTokenAndUpdateSignals(token, user));
      }),
      map(() => true),
      
      catchError((err) => {
        this.loadingController.dismiss();
        return throwError(err.error);
      })
    );
  }

  register(
    name: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ): Observable<boolean> {
    const apiRegister: string = `${this.apiUrl}/auth/register`;
    const body = { name, lastname, username, email, password };

    return this.http.post<AuthResponse>(apiRegister, body).pipe(
      tap(({ user, token }) => {
        return from(this.saveTokenAndUpdateSignals(token, user));
      }),
      map(() => true),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }

  private async saveTokenAndUpdateSignals(token: string, user: User) {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    this._token.set(token);
    await this.storage.set('token', token);
  }

  private async getToken() {
    if (!this._token()) {
      const token = (await this.storage.get('token')) || null;
      this._token.set(token);
    }
  }

  validateToken(): Observable<boolean> {
    return from(this.getToken()).pipe(
      mergeMap(() => {
        if (!this.token()) {
          this.logout().subscribe();
          return of(false);
        }
        const apiValidateToken: string = `${this.apiUrl}/auth/validate-token`;
        const headers = { Authorization: `Bearer ${this.token()}` };
        return this.http.get<AuthTokenStatus>(apiValidateToken, { headers }).pipe(
            tap(({ user, token }) => {
              if(!user || !token) return this.logout().subscribe();
              return from(this.saveTokenAndUpdateSignals(token, user));
            }),
            map(() => true),
            catchError((err) => {
              this.logout().subscribe();
              return throwError(err.error);
            })
          );
      })
    );  
  }

  logout(): Observable<boolean> {
    this.storage.remove('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._token.set(null);
    this.navController.navigateRoot('/auth');
    return of(true);
  }
}
