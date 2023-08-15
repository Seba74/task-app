import { Component, Input, OnInit, computed, effect, inject, signal } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ITask } from 'src/app/interfaces';
import { LoadingService } from 'src/app/services/loading.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-accordion-tasks',
  templateUrl: './accordion-tasks.component.html',
  styleUrls: ['./accordion-tasks.component.scss'],
})
export class AccordionTasksComponent  implements OnInit {

  @Input() data: any = {};
  private taskService: TaskService = inject(TaskService);
  private loadingService: LoadingService = inject(LoadingService);

  public isToastOpen: boolean = false;
  public toastMessage: string = '';
  public toastIcon: string = '';
  public toastClass: string = '';

  public title = computed(() => {
    const date = parseISO(this.data.date);
    // if today is the same day as the date of the tasks, return 'Hoy'
    if (format(date, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy')) {
      return 'Hoy';
    }

    return format(date, 'd \'de\' MMMM', { locale: es });
  });
  private _tasks = signal<ITask[]>([]);
  public tasks = computed(() => this._tasks());

  public tasksReadyEffect = effect(() => {});

  actionTask(data: any) {
    this.loadingService.showLoading();
    const task: ITask = data[0];
    const type: string = data[1];

    if (type === 'complete') {
      this.toastIcon = 'checkmark-circle-outline';
      this.toastClass = 'toast-success';
      this.toastMessage = 'Tarea completada';
      this.isToastOpen = true;
      this.taskService
        .updateTask(task._id, { is_completed: true })
        .subscribe(() => {
          this.loadingService.dismissLoading();
          setTimeout(() => {
            this.setOpen(false);
          }, 2000);
        });
    } else {
      this.toastIcon = 'close-circle-outline';
      this.toastClass = 'toast-delete';
      this.toastMessage = 'Tarea eliminada';
      this.isToastOpen = true;
      this.taskService.deleteTask(task._id).subscribe(() => {
        this.loadingService.dismissLoading();
        setTimeout(() => {
          this.setOpen(false);
        }, 2000);
      });
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  ngOnInit() {
  }

}
