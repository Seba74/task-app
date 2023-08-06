import {
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss'],
})
export class SelectOptionsComponent implements OnInit {
  private modalController = inject(ModalController);

  @Input() title: string = '';
  @Input() options: any[] = [{}];
  @Input() selectedOption: any = {};

  ngOnInit() {}

  checkboxChange(option: any) {
    this.selectedOption = option;
    this.modalController.dismiss(this.selectedOption);
  }
}
