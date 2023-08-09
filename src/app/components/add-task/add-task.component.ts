import { Component, Input, computed, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController } from '@ionic/angular';
import { IPriority, ITask } from 'src/app/interfaces';
import { utcToZonedTime, format } from 'date-fns-tz';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  @ViewChild('title', { static: false }) title!: IonInput;
  @Input() task: ITask | null = null;
  level: number = 4;
  @Input() priorities: IPriority[] = [];
  private modalController = inject(ModalController);
  public formattedDateTime = computed(() => {
    const timeZone = 'America/Argentina/Buenos_Aires';
    const date = utcToZonedTime(new Date(), timeZone);
    return format(date, "yyyy-MM-dd'T'HH:mm:ss", { timeZone });
  });

  addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    time: new FormControl(this.formattedDateTime(), [Validators.required]),
  });

  ionViewWillEnter() {
    if (this.task) {
      this.level = this.task.priority.level;
      this.addTaskForm.setValue({
        title: this.task.title,
        description: this.task.description,
        time: this.task.deadline,
      });
    }
    this.title.setFocus();
  }

  addTask() {
    if (!this.addTaskForm.valid) {
      return;
    }
    const { title, description, time } = this.addTaskForm.value;
    let task: any = {};
    if (!this.task) {
      task = {
        title,
        description,
        idPriority: this.priorities.find((p) => p.level === this.level)?._id,
        deadline: time,
      };
    } else {
      const { title, description, time } = this.addTaskForm.value;
      if (title !== this.task.title) task.title = title;
      if (description !== this.task.description) task.description = description;
      if (time !== this.task.deadline) task.deadline = time;
      if (this.level !== this.task.priority.level)
        task.idPriority = this.priorities.find(
          (p) => p.level === this.level
        )?._id;
    }
    this.modalController.dismiss(task);
  }

  getPriority(value: number) {
    this.level = value;
  }
}
