import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-tasks-view',
  templateUrl: './tasks-view.component.html',
  styleUrls: ['./tasks-view.component.scss'],
})
export class TasksViewComponent implements OnInit {
  private modalController = inject(ModalController);
  @Input() details: string = '';
  type: string = '';

  tasks: any[] = [];

  private meses: string[] = [
    '',
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  public title = computed<string>(() => {
    const date = this.details.split('T')[0];
    const dateArray = date.split('-');

    if (parseInt(dateArray[2]) < 10)
      dateArray[2] = dateArray[2].replace('0', '');

    const month: string = this.meses[parseInt(dateArray[1])];
    return `${dateArray[2]} de ${month} de ${dateArray[0]}`;
  });

  ngOnInit() {}

  addTask(type: string) {
    this.type = type;
    this.addView();
  }

  async addView() {
    const modal = await this.modalController.create({
      component: AddTaskComponent,
      componentProps: { type: this.type },
      cssClass: 'add-task-modal',
      animated: true,
      backdropDismiss: true,
    });
    modal.present();
  }
}
