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
export class ItemsComponent implements OnInit {
  @Input() tasks: ITask[] = [];
  @Output() taskToEdit: EventEmitter<ITask> = new EventEmitter();
  @Output() sendActionTask: EventEmitter<[ITask, string]> = new EventEmitter();
  
  ngOnInit(): void {
  }

  sendTaskToEdit(task: ITask) {
    this.taskToEdit.emit(task);
  }
  
  actionTask(data: any) {
    this.sendActionTask.emit(data);
  }
}
