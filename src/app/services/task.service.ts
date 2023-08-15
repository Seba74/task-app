import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { DataResponse, ICreateTask, ITask } from '../interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoadingService } from './loading.service';
import { format, utcToZonedTime } from 'date-fns-tz';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl: string = `${environment.apiUrl}/task`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private storage = inject(Storage);

  private _allTasks = signal<{ [key: string]: ITask[] }>({});
  public allTasks = computed(() => {
    for (let dates in this._allTasks()) {
      for (let task of this._allTasks()[dates]) {
        const timeZone = 'America/Argentina/Buenos_Aires';
        const date = utcToZonedTime(new Date(task.deadline), timeZone);
        task.deadline = format(date, "yyyy-MM-dd'T'HH:mm:ss", { timeZone });
      }
    }
    return this._allTasks();
  });

  public orderTasksDates() {
    const dates = Object.keys(this._allTasks());
    dates.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
    return dates;
  }


  public async getTasksFromStorage() {
    const tasks = (await this.storage.get('tasks')) || {};
    this._allTasks.set(tasks);
  }

  public getNoCompletedTasksByUser(): Observable<{}> {
    const idUser = this.authService.currentUser()?._id;
    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const taskApi: string = `${this.apiUrl}/user/${idUser}`;
    return this.http.get<DataResponse>(taskApi, { headers }).pipe(
      map(async (response) => {
        const tasks: ITask[] = response.data.filter(
          (task: ITask) => !task.is_completed
        );
        tasks.forEach((task: ITask) => {
          this._allTasks.update((prev) => {
            return {
              ...prev,
              [task.idDate]: [...(prev[task.idDate] || []), task],
            };
          });
        });
        await this.storage.set('tasks', this.allTasks());
      })
    );
  }

  public getUserTasksByDate(idDate: string): Observable<{}> {
    const idUser = this.authService.currentUser()?._id;
    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const taskApi: string = `${this.apiUrl}/user/${idUser}/date/${idDate}`;
    return this.http.get<DataResponse>(taskApi, { headers }).pipe(
      map(async (response) => {
        const tasks: ITask[] = response.data;
        tasks.forEach((task: ITask) => {
          this._allTasks.update((prev) => {
            return {
              ...prev,
              [task.idDate]: [...(prev[task.idDate] || []), task],
            };
          });
        });
        await this.storage.set('tasks', this.allTasks());
      })
    );
  }

  public getNoCompletedTasksByDate(idDate: string): Observable<{}> {
    console.log('getNoCompletedTasksByDate');
    console.log(this.allTasks()[idDate]);

    if (this.allTasks()[idDate]) {
      console.log('exists');

      return new Observable((observer) => {
        observer.next();
        observer.complete();
      });
    }

    const idUser = this.authService.currentUser()?._id;
    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const taskApi: string = `${this.apiUrl}/user/${idUser}/date/${idDate}`;
    return this.http.get<DataResponse>(taskApi, { headers }).pipe(
      map(async (response) => {
        const tasks: ITask[] = response.data.filter(
          (task: ITask) => !task.is_completed
        );
        this._allTasks.update((prev) => {
          return { ...prev, [idDate]: tasks };
        });
        await this.storage.set('tasks', this.allTasks());
      })
    );
  }

  public getTaskById(idTask: string): Observable<ITask> {
    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const taskApi: string = `${this.apiUrl}/${idTask}`;
    return this.http
      .get<DataResponse>(taskApi, { headers })
      .pipe(map((response) => response.data));
  }

  public createTask(task: ICreateTask): Observable<{}> {
    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const taskApi: string = `${this.apiUrl}`;
    return this.http.post<DataResponse>(taskApi, task, { headers }).pipe(
      map(async (response) => {
        const task: ITask = response.data;
        this._allTasks.update((prev) => {
          return {
            ...prev,
            [task.idDate]: [...(prev[task.idDate] || []), task],
          };
        });
        await this.storage.set('tasks', this.allTasks());
      })
    );
  }

  public updateTask(id: string, task: any): Observable<{}> {
    const headers = { Authorization: `Bearer ${this.authService.token()}` };
    const taskApi: string = `${this.apiUrl}/${id}`;
    return this.http.put<DataResponse>(taskApi, task, { headers }).pipe(
      map(async (response) => {
        const task: ITask = response.data;

        this._allTasks.update((prev) => {
          if (task.is_completed) {
            const tasks = prev[task.idDate] || [];
            const index = tasks.findIndex((t) => t._id === task._id);
            tasks.splice(index, 1);
            return { ...prev, [task.idDate]: tasks };
          }

          const tasks = prev[task.idDate] || [];
          const index = tasks.findIndex((t) => t._id === task._id);
          tasks[index] = task;
          return { ...prev, [task.idDate]: tasks };
        });
        await this.storage.set('tasks', this.allTasks());
      })
    );
  }

  public deleteTask(id: string): Observable<{}> {
    const headers: any = {
      Authorization: `Bearer ${this.authService.token()}`,
    };
    const taskApi: string = `${this.apiUrl}/${id}`;
    return this.http.delete<DataResponse>(taskApi, { headers }).pipe(
      map(async (response) => {
        const task: ITask = response.data;
        this._allTasks.update((prev) => {
          const tasks = prev[task.idDate] || [];
          const index = tasks.findIndex((t) => t._id === task._id);
          tasks.splice(index, 1);
          return { ...prev, [task.idDate]: tasks };
        });
        await this.storage.set('tasks', this.allTasks());
      })
    );
  }
}
