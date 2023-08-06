import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITask } from 'src/app/interfaces';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent {
  @Input() tasks: ITask[] = [];
  @Output() taskToEdit: EventEmitter<ITask> = new EventEmitter();
  
  ionViewWillEnter(){}

  sendTaskToEdit(task: ITask) {
    this.taskToEdit.emit(task);
  }
}
