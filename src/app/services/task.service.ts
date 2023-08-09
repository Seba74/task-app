import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { DataResponse, ICreateTask, ITask } from '../interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl: string = `${environment.apiUrl}/task`;
  private http = inject(HttpClient);
  private AuthService = inject(AuthService);
  private storage = inject(Storage);

  //   private _tasks = signal<ITask | null>(null);
  //   public tasks = computed(() => this._tasks());

  public getUserTasksByDate(idDate: string): Observable<ITask[]> {
    const idUser = this.AuthService.currentUser()?._id;
    const headers = { Authorization: `Bearer ${this.AuthService.token()}` };
    const taskApi: string = `${this.apiUrl}/user/${idUser}/date/${idDate}`;
    return this.http.get<DataResponse>(taskApi, { headers }).pipe(map((response) => response.data));
  }

  public getNoCompletedTasksByDate(idDate: string): Observable<ITask[]> {
    const idUser = this.AuthService.currentUser()?._id;
    const headers = { Authorization: `Bearer ${this.AuthService.token()}` };
    const taskApi: string = `${this.apiUrl}/user/${idUser}/date/${idDate}`;
    return this.http.get<DataResponse>(taskApi, { headers }).pipe(map((response) => {
      return response.data.filter((task: ITask) => !task.is_completed);
    }));
  }
  
  public getTaskById(idTask: string): Observable<ITask> {
    const headers = { Authorization: `Bearer ${this.AuthService.token()}` };
    const taskApi: string = `${this.apiUrl}/${idTask}`;
    return this.http.get<DataResponse>(taskApi, { headers }).pipe(map((response) => response.data));
  }

  public createTask(task: ICreateTask): Observable<ITask> {
    const headers = { Authorization: `Bearer ${this.AuthService.token()}` };
    const taskApi: string = `${this.apiUrl}`;
    return this.http.post<DataResponse>(taskApi, task, { headers }).pipe(map((response) => response.data));
  }

  public updateTask(id: string, task: any): Observable<ITask> {
    const headers = { Authorization: `Bearer ${this.AuthService.token()}` };
    const taskApi: string = `${this.apiUrl}/${id}`;
    return this.http.put<DataResponse>(taskApi, task, { headers }).pipe(map((response) => response.data));
  }

  public deleteTask(id: string): Observable<ITask> {
    const headers: any = { Authorization: `Bearer ${this.AuthService.token()}` };
    const taskApi: string = `${this.apiUrl}/${id}`;
    return this.http.delete<DataResponse>(taskApi, { headers }).pipe(map((response) => response.data));
  }

}
