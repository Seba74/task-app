import { Component, Input, OnInit, computed, effect, inject, signal } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ITask } from 'src/app/interfaces';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-accordion-tasks',
  templateUrl: './accordion-tasks.component.html',
  styleUrls: ['./accordion-tasks.component.scss'],
})
export class AccordionTasksComponent  implements OnInit {

  @Input() data: any = {};
  private taskService: TaskService = inject(TaskService);
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

  ngOnInit() {
    console.log(this.data);
  }

}
