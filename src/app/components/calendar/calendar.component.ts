import {
  Component,
  Input,
  OnInit,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksViewComponent } from '../tasks-view/tasks-view.component';
import { utcToZonedTime, format } from 'date-fns-tz';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendar: any;
  private modalController = inject(ModalController);
  public formattedDateTime = computed(() => {
    const date = utcToZonedTime(new Date(), 'America/Argentina/Buenos_Aires');
    return format(date, "yyyy-MM-dd'T'HH:mm:ss", { timeZone: 'America/Argentina/Buenos_Aires'});
  });
  public getTodayDate = computed(() => {
    const today = this.formattedDateTime();
    return today.slice(0, 10);
  });

  public getYesterdayDate = computed(() => {
    const today = this.formattedDateTime();
    const date = new Date(today);
    date.setDate(date.getDate() - 3);
    return format(date, "yyyy-MM-dd", { timeZone: 'America/Argentina/Buenos_Aires'});
  });

  date: string = '';

  ngOnInit() {}

  onDateChange(dateTime: any) {
    this.date = dateTime.split('T')[0];
    this.showdate();
  }

  async showdate() {
    const modal = await this.modalController.create({
      component: TasksViewComponent,
      componentProps: { idDate: this.date },
      cssClass: 'custom-modal',
      animated: true,
      mode: 'ios',
      backdropDismiss: true,
      backdropBreakpoint: 0,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
      showBackdrop: true,
      canDismiss: true,
    });
    modal.present();
  }
}
