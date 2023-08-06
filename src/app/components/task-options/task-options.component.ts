import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { SelectOptionsComponent } from '../select-options/select-options.component';

@Component({
  selector: 'app-task-options',
  templateUrl: './task-options.component.html',
  styleUrls: ['./task-options.component.scss'],
})
export class TaskOptionsComponent implements OnInit {
  @ViewChild('selectOptionsModal', { static: true }) modal!: IonModal;
  private modalController = inject(ModalController);
  public title = 'Ajustes';
  public options = [{}];

  sortingOptions = [
    { value: 'priority', label: 'Prioridad' },
    { value: 'deadline', label: 'Hora límite' },
    { value: 'title', label: 'Titulo' },
  ];

  filterOptions = [
    { value: 0, label: 'Todas' },
    { value: 1, label: 'Urgente' },
    { value: 2, label: 'Importante' },
    { value: 3, label: 'Opcional' },
    { value: 4, label: 'Normal' },
  ];

  orderBy = [
    { value: 'asc', label: 'Ascendente' },
    { value: 'desc', label: 'Descendente' },
  ];

  @Input() sortOption: any = this.sortingOptions[0];
  @Input() filterOption: any = this.filterOptions[0];
  @Input() orderOption: any = this.orderBy[0];

  ngOnInit() {}

  sortSelected() {
    this.title = 'Ordenar Por';
    this.options = this.sortingOptions;
  }

  async selectOptions(
    title: string,
    options: { value: any; label: string }[],
    selectedOption: any
  ) {
    const optionsModal = await this.modalController.create({
      component: SelectOptionsComponent,
      componentProps: { title, options, selectedOption: selectedOption },
      cssClass: 'select-options',
      animated: true,
    });

    await optionsModal.present();
    const { data } = await optionsModal.onDidDismiss();
    if (!data) return;
    if (title.startsWith('Ordenar Por')) {
      this.sortOption = data;
    }
    if (title.startsWith('Tipo')) {
      this.filterOption = data;
    }
    if (title.startsWith('Ordenar En')) {
      this.orderOption = data;
    }
  }

  restart() {
    this.sortOption = this.sortingOptions[0];
    this.filterOption = this.filterOptions[0];
    this.orderOption = this.orderBy[0];
  }

  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    const data = {
      sortOption: this.sortOption,
      filterOption: this.filterOption,
      orderOption: this.orderOption,
    };
    this.modal.dismiss(data);
  }
}
