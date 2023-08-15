import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { LoadingService } from 'src/app/services/loading.service';
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

  public tasks = computed(() => this.taskService.allTasks());
  public datesWithTasksGrouped: any = [];

  private loadingService = inject(LoadingService);

  public tasksReadyEffect = effect(() => {
    this.datesWithTasksGrouped = this.groupTasksByDate();
  });

  ngOnInit() {
    if (this.datesWithTasksGrouped.length === 0) {
      this.loadingService.showLoading();
      this.taskService.getNoCompletedTasksByUser().subscribe(() => {
        this.loadingService.dismissLoading();
      });
    }
  }

  groupTasksByDate() {
    const groupTasks = [];
    for (const date in this.tasks()) {
      if (this.tasks()[date].length > 0) {
        groupTasks.push({ date, tasks: this.tasks()[date] });
      }
    }

    groupTasks.sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    });

    return groupTasks;
  }
}
