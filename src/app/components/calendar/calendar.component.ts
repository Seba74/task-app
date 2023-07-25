import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksViewComponent } from '../tasks-view/tasks-view.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private modalController = inject(ModalController);
  details: string = '';
  constructor() {}

  ngOnInit() {}

  onDateChange(event: any) {
    console.log(event.detail.value);
    this.details = event.detail.value;
    this.showDetails();
  }

  async showDetails() {
    const modal = await this.modalController.create({
      component: TasksViewComponent,
      componentProps: { details: this.details },
      cssClass: 'custom-modal',
      mode: 'ios',
      animated: true,
      backdropDismiss: true,
    });
    modal.present();
  }
}
