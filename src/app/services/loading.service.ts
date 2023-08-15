import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingController = inject(LoadingController);

  async showLoading() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      spinner: 'dots',
      cssClass: 'custom-loading',
    });
    loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

}
