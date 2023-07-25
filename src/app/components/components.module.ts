import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { IonicModule } from '@ionic/angular';
import { AddTaskComponent } from './add-task/add-task.component';
import { TasksViewComponent } from './tasks-view/tasks-view.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CalendarComponent, AddTaskComponent, TasksViewComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [CalendarComponent]
})
export class ComponentsModule { }
