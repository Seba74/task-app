import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { DataResponse, IPriority, ITask } from '../interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PriorityService {
  private readonly apiUrl: string = `${environment.apiUrl}/priority`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public getAllPriorities(): Observable<IPriority[]> {
    const headers = { Authorization: `Bearer ${this.authService.token()}`};
    return this.http.get<DataResponse>(this.apiUrl, { headers }).pipe(map((response) => response.data));
  }

  public getPriorityByLevel(level: number): Observable<IPriority> {
    const headers = { Authorization: `Bearer ${this.authService.token()}`};
    const priorityApi: string = `${this.apiUrl}/level/${level}`;
    return this.http.get<DataResponse>(priorityApi, { headers }).pipe(map((response) => response.data));
  }
}
