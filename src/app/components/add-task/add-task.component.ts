import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('jsebguevara@gmail.com', [Validators.required]),
    description: new FormControl(),
    priority: new FormControl(),
    time: new FormControl(),
  });

  ngOnInit() {}

  addTask() {
    if (!this.addTaskForm.valid) {
      console.log('Invalid Form');
      return;
    }
    const { title, description, priority, time } = this.addTaskForm.value;
    console.log(title, description, priority, time);
  }

  priority() {}

  customAlertOptions = {
    header: 'Priority',
    translucent: true,
  };
}
