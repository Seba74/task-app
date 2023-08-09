import { Component, EventEmitter, Input, OnInit, Output, computed } from '@angular/core';
import { ITask } from 'src/app/interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() task!: ITask;

  @Output() taskToEdit: EventEmitter<ITask> = new EventEmitter();
  @Output() sendActionTask: EventEmitter<[ITask, string]> = new EventEmitter();

  public deadlineJustTime = computed(() => {
    const time = this.task.deadline.split('T')[1];
    return time.slice(0, 5);
  });

  ngOnInit() {
  }

  editTask(){
    this.taskToEdit.emit(this.task);
  }

  actionTask(type: string){
    this.sendActionTask.emit([this.task, type]);
  }

}
