import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { IonicModule } from '@ionic/angular';
import { AddTaskComponent } from './add-task/add-task.component';
import { TasksViewComponent } from './tasks-view/tasks-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './item/item.component';
import { TaskOptionsComponent } from './task-options/task-options.component';
import { SelectOptionsComponent } from './select-options/select-options.component';




@NgModule({
  declarations: [CalendarComponent, AddTaskComponent, TasksViewComponent, ItemsComponent, ItemComponent, TaskOptionsComponent, SelectOptionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [CalendarComponent]
})
export class ComponentsModule { }
