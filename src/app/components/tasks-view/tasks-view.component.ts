import {
  Component,
  Input,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Keyboard, KeyboardPlugin } from '@capacitor/keyboard';
import { ICreateTask, IPriority, ITask } from 'src/app/interfaces';
import { TaskService } from 'src/app/services/task.service';
import { PriorityService } from 'src/app/services/priority.service';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { forkJoin } from 'rxjs';
import { utcToZonedTime, format } from 'date-fns-tz';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tasks-view',
  templateUrl: './tasks-view.component.html',
  styleUrls: ['./tasks-view.component.scss'],
})
export class TasksViewComponent implements OnInit {
  @Input() idDate: string = '';

  private sortingOptions = {
    sortOption: { value: 'priority', label: 'Prioridad' },
    filterOption: { value: 0, label: 'Todas' },
    orderOption: { value: 'asc', label: 'Ascendente' },
  };

  private modalController = inject(ModalController);
  private loadingController = inject(LoadingController);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private priorityService = inject(PriorityService);

  private addModal!: HTMLIonModalElement;

  public loading!: HTMLIonLoadingElement;
  public priorities: IPriority[] = [];

  public isToastOpen: boolean = false;
  public toastMessage: string = '';
  public toastIcon: string = '';
  public toastClass: string = '';

  private _tasks = signal<ITask[]>([]);
  public tasks = computed<ITask[]>(() => this._tasks());

  private _filterTasks = signal<ITask[]>([]);
  public filterTasks = computed<ITask[]>(() => this._filterTasks());

  public emptyTasks = computed<boolean>(() => this.filterTasks().length === 0);

  private _user = signal<User | null>(this.authService.currentUser());
  public user = computed<User | null>(() => this._user());
  private keyboard: any = Capacitor.isNativePlatform() ? Keyboard : null;
  // public keyboardChange = effect(() => {
  //   if (this.keyboard) {
  //     return this.keyboard.addListener('keyboardWillShow', (info: any) => {
  //       this.addModal.style.setProperty(
  //         'margin-bottom',
  //         `${info.keyboardHeight}px`
  //       );
  //       this.addModal.style.setProperty('--height', `max-content`);
  //     });
  //   }
  // });

  // public keyboardHide = effect(() => {
  //   if (this.keyboard) {
  //     return this.keyboard.addListener('keyboardWillHide', () => {
  //       this.addModal.style.setProperty('margin-bottom', `0px`);
  //       this.addModal.style.setProperty('--height', `max-content`);
  //     });
  //   }
  // });

  public title = computed<string>(() => {
    const dateArray = this.idDate.split('-');
    if (parseInt(dateArray[2]) < 10)
      dateArray[2] = dateArray[2].replace('0', '');

    const year = parseInt(dateArray[0]);
    const month = parseInt(dateArray[1]);

    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const monthName = new Date(year, month - 1).toLocaleDateString(
      'es',
      options
    );
    const capitalizedMonth =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${dateArray[2]} de ${capitalizedMonth} de ${year}`;
  });

  public tasksChanges = effect(() => {
    if(this.tasks().length > 0) this.loading.dismiss();
  });

  ngOnInit() {
    this.showLoading();
    forkJoin([
      this.priorityService.getAllPriorities(),
      this.taskService.getNoCompletedTasksByDate(this.idDate),
    ]).subscribe(([priorities, tasks]) => {
      if(tasks.length === 0) this.loading.dismiss();
      this._tasks.set(tasks);
      this._filterTasks.set(this.sortTasks(this.sortingOptions));
      this.priorities = priorities;
    });
  }

  async addView(task?: ITask) {
    if (this.keyboard) this.keyboard.show();

    const data = await this.presentAddModal(task);

    if (data) {
      await this.showLoading();
      if (!task) {
        await this.createTask(data);
      } else {
        await this.updateTask(task, data);
      }
    }
  }

  private async presentAddModal(task?: ITask): Promise<any> {
    this.addModal = await this.modalController.create({
      component: AddTaskComponent,
      componentProps: { priorities: this.priorities, task: task },
      cssClass: 'add-task-modal',
      animated: true,
      backdropDismiss: true,
      backdropBreakpoint: 0,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
      showBackdrop: true,
      canDismiss: true,
    });

    await this.addModal.present();
    const { data } = await this.addModal.onDidDismiss();
    return data;
  }

  private async createTask(data: any) {
    this.priorityService
      .getPriorityByLevel(data.levelPriority)
      .subscribe((p) => {
        const task: ICreateTask = {
          title: data.title,
          description: data.description,
          idDate: this.idDate,
          deadline: data.deadline,
          idPriority: p._id,
          idUser: this.user()!._id,
        };
        this.taskService.createTask(task).subscribe((t) => {
          this._tasks.update((tasks) => [...tasks, t]);
          this._filterTasks.set(this.sortTasks(this.sortingOptions));
          this.loading.dismiss();
        });
      });
  }

  private async updateTask(task: ITask, data: any) {
    this.taskService.updateTask(task._id, data).subscribe((t) => {
      this._tasks.update((tasks) => {
        const index = tasks.findIndex((t) => t._id === task._id);
        tasks[index] = t;
        return tasks;
      });
      this._filterTasks.set(this.sortTasks(this.sortingOptions));
      this.loading.dismiss();
    });
  }

  public sortTasks(data: any) {
    const { filterOption, orderOption, sortOption } = data;
    let filteredTasks = this.tasks();

    if (filterOption.value !== 0) {
      filteredTasks = filteredTasks.filter(
        (t) => t.priority.level === filterOption.value
      );
    }

    if (sortOption.value === 'priority') {
      filteredTasks.sort((a, b) => a.priority.level - b.priority.level);
    }

    if (sortOption.value === 'deadline') {
      filteredTasks.sort((a, b) => {
        const dateA = this.getTimeFromDate(a.deadline);
        const dateB = this.getTimeFromDate(b.deadline);
        return dateA.localeCompare(dateB);
      });
    }

    if (orderOption.value === 'desc') {
      filteredTasks.reverse();
    }

    return filteredTasks;
  }

  getTimeFromDate(date: string) {
    const localDate = utcToZonedTime(date, 'America/Argentina/Buenos_Aires');
    return format(localDate, 'HH:mm', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });
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

  async showOptions() {
    const optionsModal = await this.modalController.create({
      component: TaskOptionsComponent,
      componentProps: {
        sortOption: this.sortingOptions.sortOption,
        orderOption: this.sortingOptions.orderOption,
        filterOption: this.sortingOptions.filterOption,
      },
      cssClass: 'options-modal',
      animated: true,
      backdropDismiss: true,
      backdropBreakpoint: 0,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
      showBackdrop: true,
      canDismiss: true,
    });

    await optionsModal.present();
    const { data } = await optionsModal.onDidDismiss();
    if (!data) return;
    this.sortingOptions.sortOption = data.sortOption;
    this.sortingOptions.orderOption = data.orderOption;
    this.sortingOptions.filterOption = data.filterOption;
    this._filterTasks.set(this.sortTasks(this.sortingOptions));
  }

  actionTask(data: any) {
    const task: ITask = data[0];
    const type: string = data[1];

    this._tasks.update((tasks) => {
      const index = tasks.findIndex((t) => t._id === task._id);
      tasks.splice(index, 1);
      return tasks;
    });
    this._filterTasks.set(this.sortTasks(this.sortingOptions));

    if (type === 'complete') {
      this.toastIcon = 'checkmark-circle-outline';
      this.toastClass = 'toast-success';
      this.toastMessage = 'Tarea completada';
      this.isToastOpen = true;
      this.taskService
        .updateTask(task._id, { is_completed: true })
        .subscribe(() => {
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
        setTimeout(() => {
          this.setOpen(false);
        }, 2000);
      });
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
