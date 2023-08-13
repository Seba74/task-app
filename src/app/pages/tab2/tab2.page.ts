import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ITask } from 'src/app/interfaces';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule, CommonModule],
})
export class Tab2Page {
  public title: string = 'Pendientes';
  private taskService: TaskService = inject(TaskService);
  private _tasks = signal<ITask[]>([]);
  public tasks = computed(() => this._tasks());
  public datesWithTasks: string[] = [];
  public datesWithTasksGrouped: any = [];

  private loadingController = inject(LoadingController);
  public loading!: HTMLIonLoadingElement;

  public tasksReadyEffect = effect(() => {
    if (this.tasks().length > 0) {
      this.datesWithTasks = this.tasks()
        .map((task: ITask) => task.idDate)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();

      this.datesWithTasksGrouped = this.groupTasksByDate();
      console.log(this.datesWithTasksGrouped);
      this.loading.dismiss();
    }

    console.log('tasksReadyEffect');

  });

  ngOnInit() {
    this.showLoading();
    this.taskService.getNoCompletedTasksByUser().subscribe((tasks: ITask[]) => {
      this._tasks.set(tasks);
      if (this.tasks().length === 0) this.loading.dismiss();
    });
  }

  getTasksByDate(date: string) {
    return this.tasks().filter((task: ITask) => task.idDate === date);
  }

  groupTasksByDate() {
    const groupTasks: any = [];
    this.datesWithTasks.forEach((date: string) => {
      groupTasks.push({
        date: date,
        tasks: this.getTasksByDate(date),
      });
    });
    return groupTasks;
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      mode: 'ios',
      cssClass: 'tasks-loading',
      translucent: true,
      showBackdrop: true,
    });
    this.loading.present();
  }
}
