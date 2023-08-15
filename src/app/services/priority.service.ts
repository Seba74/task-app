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
  private storage = inject(Storage);

  private _priorities = signal<IPriority[]>([]);
  public readonly priorities = computed(() => this._priorities());

  public async getPrioritiesFromStorage() {
    const priorities = (await this.storage.get('priorities')) || [];
    this._priorities.set(priorities);
  }

  public getAllPriorities(): Observable<IPriority[]> {

    if (this.priorities().length > 0) {
      return new Observable((observer) => {
        observer.next(this.priorities());
        observer.complete();
      });
    }

    const headers = { Authorization: `Bearer ${this.authService.token()}`};
    return this.http.get<DataResponse>(this.apiUrl, { headers }).pipe(map((response) => {
      this._priorities.set(response.data);
      this.storage.set('priorities', this.priorities());
      return response.data;
    }));
  }

  public getPriorityByLevel(level: number): Observable<IPriority> {
    let priorityExist: IPriority | undefined;
    for (const priority of this.priorities()) {
      if (priority.level === level) {
        priorityExist = priority;
        break;
      }
    }

    if (priorityExist) {
      return new Observable((observer) => {
        observer.next(priorityExist);
        observer.complete();
      });
    }

    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const priorityApi: string = `${this.apiUrl}/level/${level}`;
    return this.http.get<DataResponse>(priorityApi, { headers }).pipe(map((response) => response.data));
  }

}
